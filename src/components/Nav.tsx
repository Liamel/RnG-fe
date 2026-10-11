import { useEffect, useState } from 'react'
import { SkaldLogo } from './Brand'
import './Nav.css'

const links = [
  { label: 'Crash', href: '#crash' },
  { label: 'Slots', href: '#slots' },
  { label: 'Studio', href: '#about' },
]

function Nav() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`nav${scrolled || open ? ' nav--solid' : ''}`}>
      <div className="nav-inner wrap">
        <a className="nav-brand" href="#top" aria-label="SKALD Gaming — home" onClick={() => setOpen(false)}>
          <SkaldLogo />
        </a>

        <nav className="nav-links" aria-label="Main">
          {links.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
          <a className="btn btn-red nav-cta" href="#about">
            Partner with us
          </a>
        </nav>

        <button
          type="button"
          className="nav-burger"
          aria-expanded={open}
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((o) => !o)}
        >
          <span />
          <span />
        </button>
      </div>

      {open && (
        <nav className="nav-mobile" aria-label="Main">
          {links.map((link) => (
            <a key={link.href} href={link.href} onClick={() => setOpen(false)}>
              {link.label}
            </a>
          ))}
          <a className="btn btn-red" href="#about" onClick={() => setOpen(false)}>
            Partner with us
          </a>
        </nav>
      )}
    </header>
  )
}

export default Nav
