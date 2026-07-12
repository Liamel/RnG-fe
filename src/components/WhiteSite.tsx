import { useState } from 'react'
import './WhiteSite.css'

type WhiteSiteProps = {
  onThemeToggle: () => void
}

const links = [
  { label: 'Games', href: '#games' },
  { label: 'Technology', href: '#tech' },
  { label: 'About', href: '#about' },
]

const titles = [
  { name: 'ARKNOID', blurb: 'Multiplayer crash · pseudo-3D arcade', status: 'live', label: 'LIVE' },
  { name: 'TITLE 02', blurb: 'Reveal Q1 2027', status: 'dev', label: 'IN DEV' },
  { name: 'TITLE 03', blurb: 'Reveal 2027', status: 'dev', label: 'IN DEV' },
]

function WhiteSite({ onThemeToggle }: WhiteSiteProps) {
  const [open, setOpen] = useState(false)

  return (
    <div className="white-theme">
      <header className="nav">
        <div className="nav-inner wrap">
          <a className="nav-brand" href="#top" onClick={() => setOpen(false)}>
            <span className="nav-mark">R<span className="nav-amp">&amp;</span>G</span>
            <span className="nav-studios">STUDIOS</span>
          </a>
          <nav className="nav-links" aria-label="Main">
            {links.map((link, index) => <a key={link.href} href={link.href} className={index === 0 ? 'nav-link-active' : undefined}>{link.label}</a>)}
            <a className="nav-cta" href="#contact">Partner with us</a>
            <button type="button" className="theme-toggle" onClick={onThemeToggle}>DARK THEME</button>
          </nav>
          <button type="button" className="nav-burger" aria-expanded={open} aria-label={open ? 'Close menu' : 'Open menu'} onClick={() => setOpen((value) => !value)}><span /><span /><span /></button>
        </div>
        {open && <nav className="nav-mobile" aria-label="Main">{links.map((link) => <a key={link.href} href={link.href} onClick={() => setOpen(false)}>{link.label}</a>)}<a className="nav-cta" href="#contact" onClick={() => setOpen(false)}>Partner with us</a><button type="button" className="theme-toggle" onClick={onThemeToggle}>DARK THEME</button></nav>}
      </header>
      <main>
        <section className="hero" id="top">
          <div className="hero-inner wrap">
            <div className="hero-tiles" aria-hidden="true"><div className="hero-tile"><span className="ht-dot ht-red" /></div><div className="hero-tile hero-tile-two"><span className="ht-dot ht-bone ht-tl" /><span className="ht-dot ht-bone ht-br" /></div><div className="hero-tile hero-tile-five"><span className="ht-dot ht-bone" /><span className="ht-dot ht-bone" /><span className="ht-dot ht-green" /><span className="ht-dot ht-bone" /><span className="ht-dot ht-bone" /></div><div className="hero-tile hero-tile-red"><span /><span /><span /><span /></div></div>
            <p className="hero-eyebrow">RASMUS &amp; GREGOR · RANDOM NUMBER GENERATOR · BOTH ARE TRUE</p>
            <h1 className="hero-title">WE MAKE GAMES<br />WHERE <span className="hero-red">CHANCE</span><br />IS THE HERO.</h1>
            <p className="hero-sub">Real-time multiplayer cash-out games with certified math and arcade hearts. First title: Arknoid.</p>
          </div>
        </section>
        <section className="featured" id="games"><div className="featured-inner wrap"><p className="featured-eyebrow">NOW LIVE</p><div className="featured-grid"><div><h2 className="featured-title">ARKNOID</h2><p className="featured-desc">One autonomous ball. Two closing barriers. Every bounce raises the multiplier — cash out before the escape gap swallows your wager. Same round, every player, live.</p><div className="featured-stats"><div><span>RTP </span>96.00%</div><div><span>MAX </span>10,000x</div><div><span>ROUND </span>2–45s</div></div><div className="featured-ctas"><a className="featured-btn featured-btn-red" href="#games">PLAY DEMO</a><a className="featured-btn featured-btn-outline" href="#games">GAME SHEET</a></div></div><div className="featured-capture stripes-light">[ arknoid gameplay capture ]</div></div></div></section>
        <section className="pipeline"><div className="pipeline-inner wrap"><div className="pipeline-head"><h2 className="pipeline-title">THE PIPELINE</h2><p className="pipeline-more">More titles roll in 2027 →</p></div><div className="pipeline-grid">{titles.map((title) => <article className={`pipeline-card pipeline-card-${title.status}`} key={title.name}><span className={`pipeline-badge pipeline-badge-${title.status}`}>{title.label}</span><h3 className="pipeline-name">{title.name}</h3><p className="pipeline-blurb">{title.blurb}</p></article>)}</div></div></section>
        <section className="trust" id="tech"><div className="trust-inner wrap"><h2 className="trust-title">FAIR IS NOT A FEELING.<br /><span>IT'S A CERTIFICATE.</span></h2><div className="trust-claims"><div>CERTIFIED RNG</div><div>SERVER-AUTHORITATIVE</div><div>AUDITED MATH v1.x</div></div></div></section>
      </main>
      <footer className="footer" id="contact"><div className="footer-inner wrap"><div className="footer-mark">R<span>&amp;</span>G STUDIOS © 2026</div><nav className="footer-links" aria-label="Footer"><a href="#top">Responsible gaming</a><a href="#about">Press kit</a><a href="mailto:hello@rngstudios.com">hello@rngstudios.com</a></nav></div></footer>
    </div>
  )
}

export default WhiteSite
