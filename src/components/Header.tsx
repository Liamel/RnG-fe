import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'
import { NAV_LINKS } from '../data/nav'
import { Logo } from './Logo'

// Display settings live on <html> (data-theme / data-crt), applied before first paint by index.html
const root = document.documentElement
const remember = (key: string, value: string) => { try { localStorage.setItem(key, value) } catch { /* storage unavailable */ } }

const time = () => new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })

/** Console system bar: clock, theme and CRT toggles; Q / E cycle through the pages. */
export default function Header() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [clock, setClock] = useState(time)
  const [light, setLight] = useState(() => root.dataset.theme === 'light')
  const [crt, setCrt] = useState(() => root.dataset.crt !== 'off')

  const toggleTheme = () => {
    const next = light ? 'dark' : 'light'
    root.classList.add('theme-anim')
    root.dataset.theme = next
    remember('skald-theme', next)
    setLight(!light)
    setTimeout(() => root.classList.remove('theme-anim'), 450)
  }
  const toggleCrt = () => {
    const next = crt ? 'off' : 'on'
    root.dataset.crt = next
    remember('skald-crt', next)
    setCrt(!crt)
  }

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
        <ul className="nav-links">
          {NAV_LINKS.map(([to, label], i) => (
            <li key={to}><Link to={to} className={pathname === to ? 'active' : ''}><span>0{i + 1}</span>{label}</Link></li>
          ))}
        </ul>
        <div className="nav-tools">
          <span className="sys-clock" aria-label="Local time"><i />{clock}</span>
          <button className="set-toggle theme-toggle" type="button" aria-label={light ? 'Switch to dark mode' : 'Switch to light mode'} aria-pressed={light} onClick={toggleTheme}>
            <svg className="i-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" /></svg>
            <svg className="i-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4.5" /><path d="M12 2v2.5M12 19.5V22M4.2 4.2l1.8 1.8M18 18l1.8 1.8M2 12h2.5M19.5 12H22M4.2 19.8 6 18M18 6l1.8-1.8" /></svg>
          </button>
          <button className="set-toggle crt-toggle" type="button" aria-label={crt ? 'Turn CRT effect off' : 'Turn CRT effect on'} aria-pressed={crt} onClick={toggleCrt}><i />CRT</button>
          <Link className="btn btn-line nav-cta" to="/contact">Partner with us <span className="ar">↗</span></Link>
          <button className="nav-toggle" aria-label="Open menu" aria-expanded={open} onClick={() => setOpen(!open)}><span /><span /><span /></button>
        </div>
      </div>
    </header>
  )
}
