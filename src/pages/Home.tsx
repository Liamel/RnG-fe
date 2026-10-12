import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import Counter from '../components/Counter'
import Coverflow from '../components/Coverflow'
import CtaBox from '../components/CtaBox'
import HiddenRune from '../components/HiddenRune'
import { Mark } from '../components/Logo'
import { Glitch, Runes, Ticker } from '../components/Signal'
import SlotMachine from '../components/SlotMachine'
import { burst, unlock } from '../lib/quest'

function Hero() {
  const hero = useRef<HTMLElement>(null)
  const stage = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(false)

  // subtle parallax: the whole stage drifts with the pointer so rings stay locked to the skull
  useEffect(() => {
    const el = hero.current!
    if (!matchMedia('(pointer: fine)').matches) return
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5
      stage.current!.style.translate = `${-x * 24}px ${-y * 16}px`
    }
    const onLeave = () => (stage.current!.style.translate = '')
    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerleave', onLeave)
    return () => { el.removeEventListener('pointermove', onMove); el.removeEventListener('pointerleave', onLeave) }
  }, [])

  return (
    <section className="hero" ref={hero}>
      {/* Scene render with HUD rings locked to the skull's position in the image */}
      <div className={`hero-stage${active ? ' active' : ''}`} aria-hidden="true" ref={stage}>
        <img src="/assets/skald-scene.webp" alt="" width="1672" height="941" fetchPriority="high" />
        <div className="core">
          <svg className="ring" viewBox="0 0 400 400">
            <circle cx="200" cy="200" r="198" fill="none" stroke="rgba(255,255,255,.1)" />
            <circle cx="200" cy="200" r="190" fill="none" stroke="rgba(255,45,70,.6)" strokeWidth="1.5" strokeDasharray="1 9" />
            <path d="M200 2 A198 198 0 0 1 340 60" fill="none" stroke="#ff2d46" strokeWidth="2.5" />
          </svg>
          <svg className="ring r2" viewBox="0 0 400 400">
            <circle cx="200" cy="200" r="196" fill="none" stroke="rgba(255,255,255,.14)" strokeDasharray="60 20 4 20" />
            <g fill="#ff2d46"><rect x="196" y="0" width="8" height="8" transform="rotate(45 200 4)" /><rect x="196" y="392" width="8" height="8" transform="rotate(45 200 396)" /></g>
          </svg>
          <i className="shard s1" /><i className="shard s2" /><i className="shard s3" /><i className="shard s4" />
          <span className="cross" style={{ top: '30%', left: '-4%' }}>+</span><span className="cross" style={{ top: '62%', right: '-4%' }}>+</span>
        </div>
      </div>
      <div className="hero-shade" aria-hidden="true" />

      <div className="wrap hero-grid">
        <div>
          <span className="idx">S / 001 · Independent iGaming studio</span>
          <span className="label">Games with a signature</span>
          <h1>
            <span className="ln"><span><Glitch>Born</Glitch></span></span>
            <span className="ln"><span><Glitch>to stand</Glitch></span></span>
            <span className="ln"><span className="r"><Glitch>apart.</Glitch></span></span>
          </h1>
          <Runes text="Born to stand apart" className="runes-line" />
          <p className="lead">Original casino worlds with real character. Every symbol, sound and feature carries the Skald mark.</p>
          <div className="hero-cta">
            <Link className="btn btn-red" to="/games">Explore our games <span className="ar">↗</span></Link>
            <Link className="link" to="/studio">Inside the studio <span className="ar">↗</span></Link>
          </div>
        </div>

        <div className="hero-hud">
          <div className="tagline"><span className="idx">Art × Maths × Play</span><br /><span className="label plain" style={{ color: 'var(--ink)' }}>The Skald signature</span></div>
          <div className="status">
            <span className="idx">{active ? 'Skald core / online' : 'Skald core / standby'}</span>
            <button className="core-btn" onClick={(e) => {
              setActive(!active)
              if (!active) { unlock('core', e.clientX, e.clientY); burst(e.clientX, e.clientY, 24) }
            }}><i /><span>{active ? 'Core active' : 'Activate core'}</span> ↗</button>
          </div>
        </div>
      </div>

      <div className="wrap hero-bar">
        <span className="mouse idx"><i />Scroll to explore</span>
        <span className="idx">Skald / Season 01</span>
        <span className="label">New worlds in production</span>
      </div>
    </section>
  )
}

export default function Home() {
  return (
    <>
      <Hero />

      {/* STRIP */}
      <div className="strip">
        <Ticker items={['Original worlds', 'Signature characters', 'Proven maths', 'Seamless wallet API', '25+ regulated markets', 'Mobile first', 'Free rounds & tournaments']} />
        <HiddenRune page="home" style={{ right: '2%', top: '50%', transform: 'translateY(-50%)' }} />
      </div>

      {/* WORLDS */}
      <section>
        <div className="wrap">
          <div className="sec-head">
            <div>
              <span className="label reveal">Studio games</span>
              <h2 className="reveal d1">Made to<br /><span className="r">hold attention.</span></h2>
              <Runes text="The sagas" className="sec-rune reveal d2" />
            </div>
            <Link className="link reveal d2" to="/games">All games <span className="ar">↗</span></Link>
          </div>
          <Coverflow />
        </div>
      </section>

      {/* NUMBERS */}
      <section style={{ paddingTop: 0 }}>
        <div className="wrap cells c4">
          <div className="cell reveal"><span className="n">01 / Portfolio</span><Counter to="40" suffix="+" /><p>Original titles live and in production.</p></div>
          <div className="cell reveal d1"><span className="n">02 / Reach</span><Counter to="25" suffix="+" /><p>Regulated markets supported.</p></div>
          <div className="cell reveal d2"><span className="n">03 / Stability</span><Counter to="99.98" suffix="%" /><p>Platform uptime over 12 months.</p></div>
          <div className="cell reveal d3"><span className="n">04 / Speed</span><Counter to="14" suffix="d" /><p>Typical time from contract to live.</p></div>
        </div>
      </section>

      {/* SPIN THE SAGA (XP-only mini game) */}
      <section className="spin-sec">
        <div className="wrap split">
          <div className="copy">
            <span className="label reveal">Mini game · Free play</span>
            <h2 className="reveal d1">Spin<br /><span className="r">the saga.</span></h2>
            <p className="lead reveal d2">Five free spins a day. Land three of a kind to earn XP and rank up from Initiate to Skald. Find the hidden runes on every page for bonus spins.</p>
            <p className="idx reveal d3">Just for fun · no real money · no prizes</p>
          </div>
          <SlotMachine />
        </div>
      </section>

      {/* DNA */}
      <section>
        <div className="wrap split">
          <div className="visual reveal">
            <div className="beam-x b2" /><div className="beam-x" /><div className="floor" />
            <span data-mark><Mark /></span>
            <span className="idx cap">The world behind the worlds</span>
          </div>
          <div className="copy">
            <span className="label reveal">Studio DNA</span>
            <h2 className="reveal d1">Character<br />over<br /><span className="r">copies.</span></h2>
            <p className="lead reveal d2">A Skald game should be recognisable before you read its name. From the first symbol to the whole world, we design with a point of view, then back it with maths that keeps players spinning.</p>
            <Link className="btn btn-line reveal d3" to="/studio">Meet the studio <span className="ar">↗</span></Link>
          </div>
        </div>
      </section>

      {/* INTEGRATION */}
      <section>
        <div className="wrap split">
          <div className="copy">
            <span className="label reveal">Connect your next chapter</span>
            <h2 className="reveal d1">Your platform.<br /><span className="r">Our worlds.</span></h2>
            <p className="lead reveal d2">One seamless-wallet API or your aggregator of choice. Sandbox in a day, live in as little as two weeks.</p>
            <Link className="link reveal d3" to="/integration">Explore integration <span className="ar">↗</span></Link>
          </div>
          <div className="nodes reveal d2" aria-hidden="true">
            <svg className="wires" viewBox="0 0 520 400">
              <circle cx="260" cy="200" r="150" /><circle cx="260" cy="200" r="95" />
              <path d="M260 200 H180 V80 H100" /><path d="M260 200 H340 V80 H420" />
              <path d="M260 200 H180 V320 H100" /><path d="M260 200 H340 V320 H420" />
              <path className="flow" d="M100 80 H180 V200 H260" /><path className="flow" d="M260 200 H340 V320 H420" />
            </svg>
            <div className="node" style={{ left: '19.2%', top: '20%' }}>API</div>
            <div className="node" style={{ left: '80.8%', top: '20%' }}>WALLET</div>
            <div className="node n-r" style={{ left: '80.8%', top: '80%' }}>PLAYERS</div>
            <div className="node" style={{ left: '19.2%', top: '80%' }}>LOBBY</div>
            <div className="node hub" style={{ left: '50%', top: '50%' }} data-mark="hub-mark"><Mark className="hub-mark" /></div>
          </div>
        </div>
      </section>

      {/* FINAL CTA (glass) */}
      <CtaBox label="New possibilities" title={<>Your next hit<br /><span className="r">starts here.</span></>}
        lead="Demo access to the full catalogue, roadmap and integration kit within 24 hours." to="/contact" cta="Make contact" />
    </>
  )
}
