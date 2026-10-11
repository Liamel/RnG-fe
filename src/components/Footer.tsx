import { SkaldLogo } from './Brand'
import './Footer.css'

function Footer() {
  return (
    <footer className="footer" id="contact">
      <div className="footer-inner wrap">
        <a href="#top" aria-label="SKALD Gaming — back to top">
          <SkaldLogo />
        </a>
        <nav className="footer-links" aria-label="Footer">
          <a href="#crash">Crash</a>
          <a href="#slots">Slots</a>
          <a href="mailto:hello@skaldgaming.com">Contact</a>
        </nav>
        <p className="footer-copy">© 2026 SKALD Gaming. All rights reserved.</p>
      </div>
    </footer>
  )
}

export default Footer
