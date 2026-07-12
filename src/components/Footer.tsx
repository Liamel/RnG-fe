import './Footer.css'

function Footer() {
  return (
    <footer className="footer" id="contact">
      <div className="footer-inner wrap">
        <div className="footer-mark">
          R<span className="footer-n">n</span>G STUDIOS © 2026
        </div>
        <nav className="footer-links" aria-label="Footer">
          <a href="#top">RESPONSIBLE GAMING</a>
          <a href="#tech">CERTIFICATIONS</a>
          <a href="mailto:hello@rngstudios.com">CONTACT</a>
        </nav>
      </div>
    </footer>
  )
}

export default Footer
