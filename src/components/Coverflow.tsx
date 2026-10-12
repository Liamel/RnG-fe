import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react'
import { GAMES, typeLabel } from '../data/games'
import { DemoButton, GameArt, GameTitle } from './GameArt'
import { useGameOverlays } from '../lib/overlays'

// Showcase order: the featured game (first in the catalogue) sits at index 0 = centre;
// other titles with real artwork alternate to its right and left, placeholders fill the far side.
const [featured, ...others] = GAMES
const real = others.filter((g) => g.img), rest = others.filter((g) => !g.img)
const right = real.filter((_, i) => i % 2 === 0), left = real.filter((_, i) => i % 2 === 1)
const games = [featured, ...right, ...rest, ...left.reverse()]
const n = games.length
const pad = (v: number) => String(v).padStart(2, '0')

const useMobile = () => {
  const [mobile, setMobile] = useState(() => innerWidth < 700)
  useEffect(() => {
    const onResize = () => setMobile(innerWidth < 700)
    addEventListener('resize', onResize)
    return () => removeEventListener('resize', onResize)
  }, [])
  return mobile
}

/** 3D coverflow game showcase (home). */
export default function Coverflow() {
  const { openGame } = useGameOverlays()
  const mobile = useMobile()
  // tick changes on every show(), even of the same game, so the title and text animations replay
  const [{ cur, tick }, setView] = useState({ cur: 0, tick: 0 })
  const go = useCallback((f: (c: number) => number) => setView((v) => ({ cur: (f(v.cur) % n + n) % n, tick: v.tick + 1 })), [])
  const flow = useRef<HTMLDivElement>(null)
  const timer = useRef<ReturnType<typeof setInterval>>(undefined)
  const inView = useRef(false)
  const drag = useRef<{ startX: number | null; moved: boolean }>({ startX: null, moved: false })

  // only autoplay while visible; every change of game restarts the 5s countdown
  const restart = useCallback(() => {
    clearInterval(timer.current)
    if (inView.current) timer.current = setInterval(() => go((c) => c + 1), 5000)
  }, [go])
  const show = useCallback((i: number) => { go(() => i); restart() }, [go, restart])

  useEffect(() => {
    let seen = false
    // Centre the featured game when the showcase first scrolls into view
    const io = new IntersectionObserver(([en]) => {
      inView.current = en.isIntersecting
      if (inView.current && !seen) { seen = true; show(0) }
      else if (inView.current) restart()
      else clearInterval(timer.current)
    }, { threshold: .35 })
    io.observe(flow.current!)
    return () => { io.disconnect(); clearInterval(timer.current) }
  }, [show, restart])

  // drag / swipe; a drag must not also count as a click on a card
  useEffect(() => {
    const onUp = (e: PointerEvent) => {
      const d = drag.current
      if (d.startX === null) return
      const dx = e.clientX - d.startX
      d.startX = null
      if (Math.abs(dx) > 40) {
        d.moved = true
        go((c) => c + (dx < 0 ? 1 : -1))
        restart()
        setTimeout(() => (d.moved = false), 0) // only swallow the click fired by this same drag
      }
    }
    addEventListener('pointerup', onUp)
    return () => removeEventListener('pointerup', onUp)
  }, [go, restart])

  const g = games[cur]

  return (
    <div className="flow reveal" data-flow ref={flow} onPointerEnter={() => clearInterval(timer.current)} onPointerLeave={restart}>
      <div className="flow-bigtitle" aria-hidden="true" key={tick}>{g.title}</div>
      <div
        className="flow-stage"
        tabIndex={0}
        aria-roledescription="carousel"
        aria-label="Skald games showcase"
        onKeyDown={(e) => {
          if (e.key === 'ArrowLeft') { e.preventDefault(); show(cur - 1) }
          if (e.key === 'ArrowRight') { e.preventDefault(); show(cur + 1) }
        }}
        onPointerDown={(e) => { drag.current.startX = e.clientX; drag.current.moved = false }}
      >
        {games.map((game, i) => {
          // wrap around so the featured game sits centred with games on both sides
          let d = i - cur
          if (d > n / 2) d -= n
          if (d < -n / 2) d += n
          const ad = Math.abs(d), s = Math.sign(d)
          const x = d === 0 ? 0 : s * ((mobile ? 60 : 72) + (ad - 1) * (mobile ? 26 : 46))
          const hidden = ad > (mobile ? 1 : 2)
          const style: CSSProperties = {
            transform: `translateX(${x}%) translateZ(${-ad * 170}px) rotateY(${-s * Math.min(ad, 1) * 42}deg) scale(${d === 0 ? 1.06 : 1})`,
            zIndex: 100 - ad,
            opacity: hidden ? 0 : 1 - ad * .18,
            filter: d === 0 ? 'none' : `brightness(${1 - ad * .2}) saturate(${1 - ad * .15})`,
            pointerEvents: hidden ? 'none' : undefined,
          }
          return (
            <div
              key={game.id}
              className={`flow-card${d === 0 ? ' on' : ''}`}
              data-i={i}
              role="group"
              aria-label={game.title}
              style={style}
              onClick={() => {
                if (drag.current.moved) { drag.current.moved = false; return }
                if (d === 0) openGame(game.id); else show(i)
              }}
            >
              {game.tag && <span className="tag">{game.tag === 'hot' ? 'Hot' : 'New'}</span>}
              <GameArt game={game} />
            </div>
          )
        })}
      </div>
      <div className="flow-dots" role="tablist" aria-label="Choose a game">
        {games.map((game, i) => <button key={game.id} className={i === cur ? 'on' : ''} aria-label={game.title} onClick={() => show(i)} />)}
      </div>
      <div className="flow-info" aria-live="polite">
        <div className="flow-num">{pad(cur + 1)}<small>/ {pad(n)}</small></div>
        <div className="flow-text" key={tick}>
          <span className="label">{[typeLabel[g.type], ...g.grid.split(' · ').filter((p) => p !== typeLabel[g.type])].join(' · ')}</span>
          <h3><GameTitle game={g} /></h3>
          <p>{g.desc}</p>
          <div className="chips"><span>RTP {g.rtp}</span><span>Max win {g.max}</span><span>Volatility {g.vol}/5</span></div>
        </div>
        <div className="flow-side">
          <div className="flow-btns">
            <DemoButton game={g} />
            <button className="btn btn-red" onClick={() => openGame(g.id)}>Explore the game <span className="ar">↗</span></button>
          </div>
          <div className="arrows">
            <button aria-label="Previous game" onClick={() => show(cur - 1)}>←</button>
            <button aria-label="Next game" onClick={() => show(cur + 1)}>→</button>
          </div>
        </div>
      </div>
    </div>
  )
}
