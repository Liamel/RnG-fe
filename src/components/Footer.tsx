import { Link } from 'react-router'
import { NAV_LINKS } from '../data/nav'
import { Logo } from './Logo'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="footer-grid">
          <div><Logo /><p>An independent game studio building distinctive casino worlds with unmistakable character.</p></div>
          <div><h4>Navigate</h4><ul>{NAV_LINKS.map(([to, label]) => <li key={to}><Link to={to}>{label}</Link></li>)}</ul></div>
          <div><h4>Games</h4><ul>
            <li><Link to="/games">All games</Link></li><li><Link to="/games#slots">Video Slots</Link></li></ul></div>
          <div><h4>Contact</h4><ul>
            <li><a href="mailto:partners@skaldgaming.com">partners@skaldgaming.com</a></li>
            <li><a href="mailto:support@skaldgaming.com">support@skaldgaming.com</a></li>
            <li><Link to="/contact">Book a demo</Link></li></ul></div>
        </div>
        <div className="footer-big" aria-hidden="true">SKALD</div>
        <div className="footer-bottom">
          <span><span className="age">18+</span>Play responsibly · B2B distribution only</span>
          <span>© {new Date().getFullYear()} Skald Gaming</span>
        </div>
      </div>
    </footer>
  )
}
