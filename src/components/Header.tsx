import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router'
import { NAV_LINKS } from '../data/nav'
import { Logo } from './Logo'

export default function Header() {
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  // initial theme is applied by the inline script in index.html <head>
  const [light, setLight] = useState(() => document.documentElement.dataset.theme === 'light')

  useEffect(() => setOpen(false), [pathname])
  useEffect(() => {
    const onScroll = () => setScrolled(scrollY > 20)
    addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => removeEventListener('scroll', onScroll)
  }, [])

  const toggleTheme = () => {
    const root = document.documentElement
    const next = light ? 'dark' : 'light'
    root.classList.add('theme-anim')
    root.dataset.theme = next
    try { localStorage.setItem('skald-theme', next) } catch { /* storage unavailable */ }
    setLight(!light)
    setTimeout(() => root.classList.remove('theme-anim'), 500)
  }

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
          <button className="theme-toggle" type="button" aria-label={light ? 'Switch to dark mode' : 'Switch to light mode'} aria-pressed={light} onClick={toggleTheme}>
            <svg className="i-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" /></svg>
            <svg className="i-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4.5" /><path d="M12 2v2.5M12 19.5V22M4.2 4.2l1.8 1.8M18 18l1.8 1.8M2 12h2.5M19.5 12H22M4.2 19.8 6 18M18 6l1.8-1.8" /></svg>
          </button>
          <Link className="btn btn-line nav-cta" to="/contact">Partner with us <span className="ar">↗</span></Link>
          <button className="nav-toggle" aria-label="Open menu" aria-expanded={open} onClick={() => setOpen(!open)}><span /><span /><span /></button>
        </div>
      </div>
    </header>
  )
}
