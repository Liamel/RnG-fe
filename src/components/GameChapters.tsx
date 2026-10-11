import { useEffect, useState } from 'react'
import AccordionGallery, { type AccordionGalleryItem } from './AccordionGallery'
import FoldText from './FoldText'
import { SkaldMark } from './Brand'
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

const liveTitles = ['ARKNOID', 'SPIDEY', 'JADE GARDEN', 'PISTA SPIN', 'ANIWILDER']

function Marquee() {
  // two identical runs so the -50% translate loops seamlessly
  const run = liveTitles.flatMap((title) => [title, 'mark'])
  return <div className="marquee" aria-hidden="true">
    <div className="marquee-track">
      {[...run, ...run].map((item, index) => item === 'mark'
        ? <SkaldMark key={index} className="marquee-mark" />
        : <span key={index}>{item}</span>)}
    </div>
  </div>
}

function Chapter({ id, index, kicker, title, copy, items, flip = false }:{ id:string; index:string; kicker:string; title:string; copy:string; items:AccordionGalleryItem[]; flip?:boolean }) {
  return <section className={`chapter${flip ? ' chapter--flip' : ''}`} id={id}>
    <div className="chapter-beam" aria-hidden="true" />
    <div className="chapter-no" aria-hidden="true">{index}</div>
    <div className="chapter-inner wrap">
      <div className="chapter-heading">
        <div>
          <p className="eyebrow">{kicker}</p>
          <FoldText text={title} splitBy="word" hinge={flip ? 'bottom' : 'top'} fontSize="clamp(2.4rem, 6vw, 5.75rem)" color="var(--white)" />
        </div>
        <p className="chapter-copy">{copy}</p>
      </div>
      <AccordionGallery items={items} defaultIndex={0} accentColor="#ff2424" overlayColor="#100a08" expandRatio={0.48} height={380} gap={10} radius={14} />
      <div className="chapter-foot"><span>{String(items.length).padStart(2, '0')} TITLES</span><span>HOVER / TAP TO EXPLORE</span><span>SKALD GAMING</span></div>
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

  <section className="hero" id="top">
    <img className="hero-art" src="/brand/hero.jpg" alt="" />
    <div className="hero-shade" aria-hidden="true" />
    <div className="hero-inner wrap">
      <p className="eyebrow">Independent game studio</p>
      <h1 className="hero-title">
        <FoldText text={'WE MAKE\nCHANCE FEEL\nELECTRIC.'} splitBy="line" trigger="mount" fontSize="clamp(2rem, 6.4vw, 6.75rem)" color="var(--white)" />
      </h1>
      <p className="hero-sub">Crash and slot games with fast rounds, clean tension and worlds worth coming back to.</p>
      <div className="hero-ctas">
        <a className="btn btn-red" href="#crash">Explore games</a>
        <a className="btn btn-ghost" href="https://arknoid-fe.vercel.app/" target="_blank" rel="noopener noreferrer">Play Arknoid <span aria-hidden="true">↗</span></a>
      </div>
    </div>
    <a href="#crash" className="hero-scroll" aria-label="Scroll to games"><span>SCROLL</span><i /></a>
  </section>

  <Marquee />

  <Chapter id="crash" index="01" kicker="Category 01 — Crash" title="CRASH GAMES" copy="Fast rounds. Clean tension. Every second is a decision. Explore our high-energy crash portfolio." items={crashGames} />
  <Chapter id="slots" index="02" kicker="Category 02 — Slots" title="SLOT GAMES" copy="Three reel worlds have live demos ready to play — Jade Garden, Pista Spin and Aniwilder. Three more are spinning into shape in the lab." items={slotGames} flip />

  <section className="closing" id="about">
    <SkaldMark className="closing-mark" />
    <div className="closing-inner wrap">
      <p className="closing-kicker">Build the next hit with us.</p>
      <FoldText text="LET'S PLAY." splitBy="word" fontSize="clamp(3.2rem, 11vw, 10rem)" color="var(--black)" />
      <a className="btn btn-black closing-cta" href="mailto:hello@skaldgaming.com">Start a conversation <span aria-hidden="true">↗</span></a>
    </div>
  </section>
  </>
}
