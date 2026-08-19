import './GamesGrid.css'
import AccordionGallery, { type AccordionGalleryItem } from './AccordionGallery'

const games: AccordionGalleryItem[] = [
  { image: '/games/arknoid.svg', embedUrl: 'https://arknoid-fe.vercel.app/', label: 'ARKNOID', eyebrow: 'HOVER TO LOAD · LIVE DEMO', alt: 'Red arcade tunnel artwork for Arknoid' },
  { image: '/games/spidey.svg', embedUrl: 'https://arknoid-fe-spidey.vercel.app/', label: 'ARKNOID: SPIDEY', eyebrow: 'HOVER TO LOAD · LIVE DEMO', alt: 'Red and blue web artwork for Arknoid Spidey' },
  { image: '/games/vault-13.svg', label: 'VAULT 13', eyebrow: 'MOCK TITLE · INSTANT WIN', alt: 'Glowing vault concept artwork' },
  { image: '/games/blackjack-zero.svg', label: 'BLACKJACK ZERO', eyebrow: 'MOCK TITLE · TABLE', alt: 'Futuristic playing card concept artwork' },
  { image: '/games/orbit.svg', label: 'ORBIT', eyebrow: 'MOCK TITLE · CRASH', alt: 'Planet and spacecraft concept artwork' },
  { image: '/games/lucky-byte.svg', label: 'LUCKY BYTE', eyebrow: 'MOCK TITLE · SLOTS', alt: 'Pixel fruit machine concept artwork' },
]

function GamesGrid() {
  return (
    <section className="games" id="games">
      <div className="wrap">
        <div className="games-head">
          <h2 className="games-title">OUR GAMES</h2>
          <a className="games-all" href="#games">
            ALL TITLES →
          </a>
        </div>
        <p className="games-intro">HOVER OR TAP A TITLE TO EXPLORE THE LINEUP.</p>
        <AccordionGallery items={games} defaultIndex={0} expandRatio={0.5} trigger="hover" height={500} gap={12} />
        <p className="games-note">DEMO LINEUP · PLACEHOLDER ART AND TITLES</p>
      </div>
    </section>
  )
}

export default GamesGrid
