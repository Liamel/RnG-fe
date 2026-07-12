import { useState } from 'react'
import './Nav.css'

const links = [
  { label: 'GAMES', href: '#games' },
  { label: 'TECH', href: '#tech' },
  { label: 'ABOUT', href: '#about' },
]

function DieLogo() {
  return (
    <div className="nav-die bevel-strong" aria-hidden="true">
      <span className="d d-tl" />
      <span className="d d-tr" />
      <span className="d d-c" />
      <span className="d d-bl" />
      <span className="d d-br" />
    </div>
  )
}

type NavProps = {
  onThemeToggle: () => void
}

function Nav({ onThemeToggle }: NavProps) {
  const [open, setOpen] = useState(false)

  return (
    <header className="nav">
      <div className="nav-inner wrap">
        <a className="nav-brand" href="#top" onClick={() => setOpen(false)}>
          <DieLogo />
          <span className="nav-wordmark">
            R<span className="nav-n">n</span>G <span className="nav-studios">STUDIOS</span>
          </span>
        </a>

        <nav className="nav-links" aria-label="Main">
          {links.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
          <a className="nav-cta bevel-strong" href="#contact">
            PARTNER WITH US
          </a>
          <button type="button" className="theme-toggle" onClick={onThemeToggle}>
            LIGHT THEME
          </button>
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
          <a
            className="nav-cta bevel-strong"
            href="#contact"
            onClick={() => setOpen(false)}
          >
            PARTNER WITH US
          </a>
          <button type="button" className="theme-toggle" onClick={onThemeToggle}>
            LIGHT THEME
          </button>
        </nav>
      )}
    </header>
  )
}

export default Nav
