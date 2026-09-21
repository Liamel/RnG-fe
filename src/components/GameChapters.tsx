import { useEffect, useState } from 'react'
import AccordionGallery, { type AccordionGalleryItem } from './AccordionGallery'
import FoldText from './FoldText'
import './GameChapters.css'

const crashGames: AccordionGalleryItem[] = [
  { image:'/games/orbit-key-art.jpg', link:'https://arknoid-fe.vercel.app/', label:'ARKNOID', eyebrow:'PLAY DEMO · LIVE GAME', alt:'Arknoid live game cover' },
  { image:'/games/vault-13-key-art.jpg', link:'https://arknoid-fe-spidey.vercel.app/', label:'SPIDEY', eyebrow:'PLAY DEMO · LIVE GAME', alt:'Spidey live game cover' },
  { image:'/games/arknoid-key-art.jpg', label:'ARKNOID', eyebrow:'CRASH · LIVE', alt:'Colorful arcade world' },
  { image:'/games/spidey-key-art.jpg', label:'REDLINE', eyebrow:'CRASH · LIVE', alt:'Red neon city action artwork' },
  { image:'/games/blackjack-zero-key-art.jpg', label:'ZERO G', eyebrow:'CRASH · LIVE', alt:'Futuristic zero gravity card artwork' },
  { image:'/games/lucky-byte-key-art.jpg', label:'BYTE RUSH', eyebrow:'CRASH · LIVE', alt:'Colorful pixel fruit artwork' },
]

const slotGames: AccordionGalleryItem[] = [
  { image:'/games/jade-garden-key-art.jpg', link:'https://jade-garden-alpha.vercel.app/', label:'JADE GARDEN', eyebrow:'PLAY DEMO · LIVE GAME', alt:'Jade Garden 5×3 orchard slot live game cover' },
  { image:'/games/pista-spin-key-art.jpg', link:'https://pistaspin-alpha.vercel.app/', label:'PISTA SPIN', eyebrow:'PLAY DEMO · LIVE GAME', alt:'Pista Spin fiesta market slot live game cover' },
  { image:'/games/aniwilder-key-art.jpg', link:'https://aniwilder-alpha.vercel.app/', label:'ANIWILDER', eyebrow:'PLAY DEMO · LIVE GAME', alt:'Aniwilder lock and spin sanctuary slot live game cover' },
  { image:'/games/lucky-byte-key-art.jpg', label:'LUCKY BYTE', eyebrow:'SLOTS · IN DEVELOPMENT', alt:'Lucky Byte slot game concept' },
  { image:'/games/vault-13-key-art.jpg', label:'VAULT SPIN', eyebrow:'SLOTS · IN DEVELOPMENT', alt:'Vault Spin slot game concept' },
  { image:'/games/orbit-key-art.jpg', label:'COSMIC REELS', eyebrow:'SLOTS · IN DEVELOPMENT', alt:'Cosmic Reels slot game concept' },
]

function Chapter({ id, index, kicker, title, copy, items, accent, tone }:{ id:string; index:string; kicker:string; title:string; copy:string; items:AccordionGalleryItem[]; accent:string; tone:'red'|'violet' }) {
  return <section className={`game-chapter game-chapter--${tone}`} id={id}>
    <div className="chapter-no" aria-hidden="true">{index}</div>
    <div className="chapter-inner wrap">
      <div className="chapter-heading">
        <div><p className="chapter-kicker"><span />{kicker}</p><FoldText text={title} splitBy="word" hinge={tone === 'red' ? 'top' : 'bottom'} fontSize="clamp(2.6rem, 6.2vw, 6.25rem)" /></div>
        <p className="chapter-copy">{copy}</p>
      </div>
      <AccordionGallery items={items} defaultIndex={0} accentColor={accent} overlayColor={tone === 'red' ? '#130305' : '#09051a'} expandRatio={0.48} height={350} gap={8} />
      <div className="chapter-foot"><span>01—06</span><span>HOVER / TAP TO EXPLORE</span><span>RNG STUDIOS®</span></div>
    </div>
  </section>
}

const sections = [
  { id: 'top', label: 'Home' },
  { id: 'crash', label: 'Crash' },
  { id: 'slots', label: 'Slots' },
  { id: 'about', label: 'Studio' },
]

export default function GameChapters(){
  const [activeSection, setActiveSection] = useState('top')

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
      if (visible?.target.id) setActiveSection(visible.target.id)
    }, { threshold: [0.45, 0.6, 0.8] })
    sections.forEach(({ id }) => { const section = document.getElementById(id); if (section) observer.observe(section) })
    return () => observer.disconnect()
  }, [])

  return <>
  <aside className="chapter-rail" aria-label="Page sections">
    {sections.map((section) => <a key={section.id} href={`#${section.id}`} className={activeSection === section.id ? 'is-active' : ''} aria-current={activeSection === section.id ? 'location' : undefined}><span>{section.label}</span><i /></a>)}
  </aside>
  <section className="opening" id="top"><div className="opening-grid" aria-hidden="true"/><p className="opening-kicker">INDEPENDENT GAME STUDIO · BERLIN / WORLDWIDE</p><FoldText text={'WE MAKE\nCHANCE FEEL\nELECTRIC.'} splitBy="line" trigger="mount" fontSize="clamp(2.75rem, 7.4vw, 7.5rem)" /><a href="#crash" className="opening-scroll">SCROLL TO EXPLORE <span>↓</span></a></section>
  <Chapter id="crash" index="01" kicker="CATEGORY ONE" title="CRASH GAMES" copy="Fast rounds. Clean tension. Every second is a decision. Explore our high-energy crash portfolio." items={crashGames} accent="#ff4b35" tone="red" />
  <Chapter id="slots" index="02" kicker="CATEGORY TWO" title="SLOT GAMES" copy="Three reel worlds have live demos ready to play — Jade Garden, Pista Spin and Aniwilder. Three more are spinning into shape in the lab." items={slotGames} accent="#b89cff" tone="violet" />
  <section className="closing" id="about"><p>BUILD THE NEXT HIT WITH US.</p><FoldText text="LET'S PLAY." splitBy="word" fontSize="clamp(3.2rem, 8vw, 7.5rem)" color="#08080a"/><a href="mailto:hello@rngstudios.com">START A CONVERSATION ↗</a></section>
  </>
}
