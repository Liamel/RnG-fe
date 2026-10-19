import { useEffect, useRef, useState } from 'react'
import { CrtOverlay, Runes } from '../components/Signal'
import { reduced } from '../lib/quest'

const pad = (n: number) => String(n).padStart(2, '0')

/** Pre-launch splash: the only page the domain serves until COMING_SOON is switched off in main.tsx. */
export default function ComingSoon() {
  const root = useRef<HTMLDivElement>(null)
  const [clock, setClock] = useState('00:00:00')

  // VCR-style running timecode in the corner
  useEffect(() => {
    const t0 = Date.now()
    const tick = () => {
      const s = Math.floor((Date.now() - t0) / 1000)
      setClock(`${pad(Math.floor(s / 3600))}:${pad(Math.floor(s / 60) % 60)}:${pad(s % 60)}`)
    }
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  // every few seconds the signal tears: random slice bands jump sideways and the RGB fringe spikes
  useEffect(() => {
    if (reduced) return
    let timer = 0
    const glitch = () => {
      const el = root.current!
      const band = () => { const top = Math.random() * 90; return `${top}% 0 ${Math.max(0, 100 - top - (2 + Math.random() * 9))}% 0` }
      el.style.setProperty('--g1', band())
      el.style.setProperty('--g2', band())
      el.style.setProperty('--gx', `${(Math.random() < .5 ? -1 : 1) * (8 + Math.random() * 28)}px`)
      el.classList.add('glitching')
      setTimeout(() => el.classList.remove('glitching'), 110 + Math.random() * 180)
      timer = setTimeout(glitch, 1800 + Math.random() * 3200)
    }
    timer = setTimeout(glitch, 2600)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="soon" ref={root}>
      <div className="soon-stage" aria-hidden="true">
        {/* The artwork already carries the logo and "Coming soon"; the h1 keeps it readable for screen readers and search. */}
        <picture className="soon-art">
          <source media="(max-aspect-ratio: 4/5)" srcSet="/assets/coming-soon/coming-soon-mobile.jpg" width="1081" height="1920" />
          <img src="/assets/coming-soon/coming-soon-desktop.jpg" alt="" width="1921" height="1080" fetchPriority="high" />
        </picture>
        <div className="soon-ca r" />
        <div className="soon-ca b" />
        <div className="soon-slice s1" />
        <div className="soon-slice s2" />
      </div>
      <h1 className="sr-only">Skald Gaming: coming soon</h1>

      <div className="soon-roll" aria-hidden="true" />
      <div className="soon-hud" aria-hidden="true">
        <span className="rec"><i />Live · CH 01</span>
        <span>{clock}</span>
      </div>

      <footer className="soon-foot">
        <span><span className="age">18+</span>B2B only</span>
        <a href="mailto:partners@skaldgaming.com">partners@skaldgaming.com</a>
        <span><Runes text="Skald Gaming" /> © {new Date().getFullYear()}</span>
      </footer>
      <CrtOverlay />
      <div className="soon-power" aria-hidden="true" />
    </div>
  )
}
