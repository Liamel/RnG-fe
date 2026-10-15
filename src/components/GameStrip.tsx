import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { GAMES, typeLabel } from '../data/games'
import { useGameOverlays } from '../lib/overlays'
import { DemoButton } from './GameArt'

/* A tilted, endless strip of game cards (after meech213.com/photo).
   Scrolling feeds an inertial velocity that slides the strip, and the cards bow with that velocity. */
const C = {
  cameraFov: 28, cameraZ: 3.3,
  curveFrequency: .18, curveStrength: .12, depthCurveStrength: .2,
  gap: .16, imageSizeX: .72, imageSizeY: 1.28,
  groupPosition: [-.9, .1, .32] as const, groupRotation: [-.02, .28, -.03] as const,
  wheelDirection: -1, wheelFactor: .52,
}
const games = GAMES.filter((g) => g.img)
const n = games.length
// two laps, so the wrap-around happens off screen even on wide viewports
const cards = [...games, ...games]
const STEP = C.imageSizeX + C.gap
const SPAN = cards.length * STEP, HALF = SPAN / 2
const mod = (v: number, m: number) => (v % m + m) % m
const pad = (v: number) => String(v).padStart(2, '0')

const vertexShader = /* glsl */`
  uniform float uCurveFrequency, uCurveStrength, uDepthCurveStrength, uScrollSpeed;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    float wx = (modelMatrix * vec4(position, 1.)).x;
    vec3 p = position + vec3(
      -sin(uv.y * 3.14159265) * uScrollSpeed,
      cos(wx * uCurveFrequency) * uCurveStrength - uCurveStrength,
      -pow(abs(wx), 1.25) * uDepthCurveStrength);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.);
  }`
const fragmentShader = /* glsl */`
  uniform sampler2D uMap;
  uniform float uOpacity;
  varying vec2 vUv;
  void main() { gl_FragColor = vec4(texture2D(uMap, vUv).rgb, uOpacity); }`

export default function GameStrip() {
  const { openGame } = useGameOverlays()
  const section = useRef<HTMLElement>(null)
  const stage = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  const [hover, setHover] = useState(false)
  const g = games[active]

  useEffect(() => {
    const el = stage.current!, sec = section.current!
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' })
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
    renderer.setClearColor(0, 0)
    el.prepend(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(C.cameraFov, 1, .01, 200)
    camera.position.set(0, 0, C.cameraZ)
    const group = new THREE.Group()
    group.position.set(...C.groupPosition)
    group.rotation.set(...C.groupRotation)
    scene.add(group)

    const uniforms = {
      uCurveFrequency: { value: C.curveFrequency }, uCurveStrength: { value: C.curveStrength },
      uDepthCurveStrength: { value: C.depthCurveStrength }, uScrollSpeed: { value: 0 },
    }
    const geometry = new THREE.PlaneGeometry(1, 1, 16, 16)
    const size = games.map(() => ({ w: C.imageSizeX, h: C.imageSizeY }))
    const loader = new THREE.TextureLoader()
    const textures = games.map((game, i) => loader.load(game.img!, (t) => {
      // contain the artwork inside the card box
      const aspect = t.image.width / t.image.height, box = C.imageSizeX / C.imageSizeY
      size[i] = aspect > box ? { w: C.imageSizeX, h: C.imageSizeX / aspect } : { w: C.imageSizeY * aspect, h: C.imageSizeY }
    }))
    textures.forEach((t) => (t.anisotropy = renderer.capabilities.getMaxAnisotropy()))
    const meshes = cards.map((_, i) => {
      const material = new THREE.ShaderMaterial({
        uniforms: { ...uniforms, uMap: { value: textures[i % n] }, uOpacity: { value: 0 } },
        vertexShader, fragmentShader, transparent: true, side: THREE.DoubleSide,
      })
      const m = new THREE.Mesh(geometry, material)
      m.userData.game = i % n
      group.add(m)
      return m
    })

    const resize = () => {
      const { clientWidth: w, clientHeight: h } = el
      renderer.setSize(w, h)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      // narrow screens: centre the strip and step back so a whole card fits
      const a = camera.aspect
      group.position.x = C.groupPosition[0] * Math.max(0, Math.min(1, (a - .5) / .8))
      camera.position.z = C.cameraZ + Math.max(0, 1 - a) * 2.6
    }
    const ro = new ResizeObserver(resize)
    ro.observe(el)
    resize()
    // start with the featured game (first in the catalogue) in the centre of the screen
    meshes.forEach((m, i) => (m.position.x = mod(i * STEP - group.position.x + HALF, SPAN) - HALF))

    // scroll and touch drags push the velocity, like the reference's wheel handler
    let velocity = 0, current = -1
    const push = (d: number) => { velocity = Math.max(-180, Math.min(180, velocity + d)) }
    let lastY = scrollY, visible = false
    const onScroll = () => {
      if (visible) push(.18 * (scrollY - lastY))
      lastY = scrollY
    }
    addEventListener('scroll', onScroll, { passive: true })

    const raycaster = new THREE.Raycaster(), pointer = new THREE.Vector2()
    const hit = (e: PointerEvent): number | null => {
      const r = el.getBoundingClientRect()
      pointer.set((e.clientX - r.left) / r.width * 2 - 1, -(e.clientY - r.top) / r.height * 2 + 1)
      raycaster.setFromCamera(pointer, camera)
      return raycaster.intersectObjects(meshes)[0]?.object.userData.game ?? null
    }
    let drag: { id: number; x: number; moved: boolean } | null = null
    const canvas = renderer.domElement
    const onDown = (e: PointerEvent) => { drag = { id: e.pointerId, x: e.clientX, moved: false } }
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === 'mouse') { setHover(hit(e) !== null); return }
      if (drag?.id !== e.pointerId) return
      const dx = e.clientX - drag.x
      if (drag.moved || Math.abs(dx) >= 6) { drag.moved = true; push(-.315 * dx) }
      drag.x = e.clientX
    }
    const onUp = (e: PointerEvent) => {
      if (drag?.id !== e.pointerId) return
      const moved = drag.moved
      drag = null
      const i = moved ? null : hit(e)
      if (i !== null) openGame(games[i].id)
    }
    canvas.addEventListener('pointerdown', onDown)
    canvas.addEventListener('pointermove', onMove)
    canvas.addEventListener('pointerup', onUp)
    canvas.addEventListener('pointercancel', onUp)

    let revealAt: number | null = reduced ? -Infinity : null
    const frame = (now: number) => {
      velocity *= .92
      const t = .005 * velocity * C.wheelFactor * C.wheelDirection
      uniforms.uScrollSpeed.value = reduced ? 0 : -t
      // the card nearest the screen centre (local x = -group.position.x) is the active game
      let best = 0, dist = Infinity
      meshes.forEach((m, i) => {
        m.position.x = mod(m.position.x + t + HALF, SPAN) - HALF
        const d = Math.abs(m.position.x + group.position.x)
        if (d < dist) { dist = d; best = i }
        // cards rise in one after another the first time the strip shows
        const p = revealAt === null ? 0 : Math.max(0, Math.min(1, ((now - revealAt) / 1000 - i * .055) / .52))
        const e = 1 - (1 - p) ** 3, s = .88 + .12 * e, { w, h } = size[i % n]
        m.scale.set(w * s, h * s, 1)
        m.position.y = -.035 * (1 - e)
        ;(m.material as THREE.ShaderMaterial).uniforms.uOpacity.value = e
      })
      const a = best % n
      if (a !== current) { current = a; setActive(a) }
      renderer.render(scene, camera)
    }

    let raf = 0
    const loop = (now: number) => { frame(now); raf = requestAnimationFrame(loop) }
    // only draw while the section is on screen
    const io = new IntersectionObserver(([en]) => {
      visible = en.isIntersecting
      lastY = scrollY
      cancelAnimationFrame(raf)
      if (!visible) return
      revealAt ??= performance.now()
      raf = requestAnimationFrame(loop)
    })
    io.observe(sec)

    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      ro.disconnect()
      removeEventListener('scroll', onScroll)
      meshes.forEach((m) => (m.material as THREE.Material).dispose())
      geometry.dispose()
      textures.forEach((t) => t.dispose())
      renderer.dispose()
      canvas.remove()
    }
  }, [openGame])

  return (
    <section className="game-strip" ref={section} aria-label="Games strip">
      <div className={`game-strip-stage${hover ? ' hover' : ''}`} ref={stage}>
        <div className="game-strip-hud">
          <div className="game-strip-num">{pad(active + 1)}<small>/ {pad(n)}</small></div>
          <div className="game-strip-info" key={active}>
            <span className="label">{typeLabel[g.type]} · RTP {g.rtp}</span>
            <h2>{g.title}<span className="dot">.</span></h2>
          </div>
          <div className="game-strip-btns">
            <DemoButton game={g} />
            <button className="btn btn-red" onClick={() => openGame(g.id)}>Explore <span className="ar">↗</span></button>
          </div>
        </div>
        <span className="game-strip-hint idx" aria-hidden="true">Scroll to view</span>
      </div>
    </section>
  )
}
