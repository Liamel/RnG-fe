import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'
import { NAV_LINKS } from '../data/nav'
import { Logo } from './Logo'

const time = () => new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })

/** Console system bar: shoulder buttons (Q / E) cycle through the pages, plus a system clock. */
export default function Header() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [clock, setClock] = useState(time)

  const idx = NAV_LINKS.findIndex(([to]) => to === pathname)
  const step = (d: number) => navigate(NAV_LINKS[(Math.max(idx, 0) + d + NAV_LINKS.length) % NAV_LINKS.length][0])

  useEffect(() => setOpen(false), [pathname])
  useEffect(() => {
    const onScroll = () => setScrolled(scrollY > 20)
    addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    const tick = setInterval(() => setClock(time()), 10000)
    return () => { removeEventListener('scroll', onScroll); clearInterval(tick) }
  }, [])
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey || (e.target as Element).closest?.('input, textarea, select, [contenteditable]')) return
      if (e.key === 'q' || e.key === 'Q' || e.key === '[') step(-1)
      if (e.key === 'e' || e.key === 'E' || e.key === ']') step(1)
    }
    addEventListener('keydown', onKey)
    return () => removeEventListener('keydown', onKey)
  })

  return (
    <header className={`site-header${scrolled ? ' scrolled' : ''}${open ? ' open' : ''}`}>
      <div className="wrap nav">
        <Link to="/" aria-label="Skald Gaming home"><Logo /></Link>
        <div className="sys-menu">
          <button className="shoulder" onClick={() => step(-1)} aria-label="Previous page (Q)">L1</button>
          <ul className="nav-links">
            {NAV_LINKS.map(([to, label], i) => (
              <li key={to}><Link to={to} className={pathname === to ? 'active' : ''}><span>0{i + 1}</span>{label}</Link></li>
            ))}
          </ul>
          <button className="shoulder" onClick={() => step(1)} aria-label="Next page (E)">R1</button>
        </div>
        <div className="nav-tools">
          <span className="sys-clock" aria-label="Local time"><i />{clock}</span>
          <Link className="btn btn-line nav-cta" to="/contact">Partner with us <span className="ar">↗</span></Link>
          <button className="nav-toggle" aria-label="Open menu" aria-expanded={open} onClick={() => setOpen(!open)}><span /><span /><span /></button>
        </div>
      </div>
    </header>
  )
}
