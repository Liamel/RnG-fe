import './GamesGrid.css'
import AccordionGallery, { type AccordionGalleryItem } from './AccordionGallery'

const games: AccordionGalleryItem[] = [
  { image: '/games/arknoid-key-art.jpg', embedUrl: 'https://arknoid-fe.vercel.app/', label: 'ARKNOID', eyebrow: 'HOVER TO LOAD · LIVE DEMO', alt: 'Colorful brick-breaker arcade key art for Arknoid' },
  { image: '/games/spidey-key-art.jpg', embedUrl: 'https://arknoid-fe-spidey.vercel.app/', label: 'ARKNOID: SPIDEY', eyebrow: 'HOVER TO LOAD · LIVE DEMO', alt: 'Crimson web-swing arcade key art for Arknoid Spidey' },
  { image: '/games/vault-13-key-art.jpg', label: 'VAULT 13', eyebrow: 'MOCK TITLE · INSTANT WIN', alt: 'Futuristic golden vault key art' },
  { image: '/games/blackjack-zero-key-art.jpg', label: 'BLACKJACK ZERO', eyebrow: 'MOCK TITLE · TABLE', alt: 'Futuristic playing-card key art' },
  { image: '/games/orbit-key-art.jpg', label: 'ORBIT', eyebrow: 'MOCK TITLE · CRASH', alt: 'Neon spacecraft orbiting a planet' },
  { image: '/games/lucky-byte-key-art.jpg', label: 'LUCKY BYTE', eyebrow: 'MOCK TITLE · SLOTS', alt: 'Colorful voxel fruit arcade key art' },
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
