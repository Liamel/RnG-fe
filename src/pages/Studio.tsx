import CtaBox from '../components/CtaBox'
import HiddenRune from '../components/HiddenRune'
import { Glitch, Runes } from '../components/Signal'

export default function Studio() {
  return (
    <>
      <section className="page-hero">
        <div className="wrap row">
          <div>
            <span className="idx">S / 003 · The studio</span>
            <h1><Glitch>We are</Glitch><br /><span className="r">Skald.</span></h1>
            <Runes text="We are Skald" className="runes-line" />
          </div>
          <p className="lead">A skald was the storyteller who made legends last. We're a crew of artists, mathematicians and engineers doing the same for casino games.</p>
        </div>
      </section>

      <section>
        <div className="wrap">
          <span className="label reveal">Manifesto</span>
          <p className="manifesto reveal d1" style={{ marginTop: 24 }}>
            <span className="dim">The market is full of</span> games that look the same. <span className="dim">We build</span> worlds you recognise <span className="dim">in a single frame,</span> <span className="r">and maths that earns the second spin.</span>
          </p>
        </div>
      </section>

      <section style={{ paddingTop: 0 }}>
        <div className="wrap split">
          <div className="visual reveal">
            <img src="/assets/skald-scene.webp" alt="Glowing red Skald skull emblem in a dark stone hall" loading="lazy" width="1672" height="941" />
            <span className="idx cap">Skald HQ / Production floor</span>
          </div>
          <div className="cells" style={{ gridTemplateColumns: '1fr' }}>
            <div className="cell reveal"><span className="n">01 / Craft</span><h3 style={{ marginTop: 18 }}>Everything in-house</h3><p>Art, animation, sound and maths are made under one roof. We'd rather ship fewer games than forgettable ones.</p></div>
            <div className="cell reveal d1"><span className="n">02 / Honesty</span><h3 style={{ marginTop: 18 }}>Fair by design</h3><p>Certified RNG, transparent RTP and per-market compliance. Player trust is the only asset that compounds.</p></div>
            <div className="cell reveal d2"><span className="n">03 / Partnership</span><h3 style={{ marginTop: 18 }}>Beyond launch day</h3><p>Shared data, co-built features and a team that answers. We grow when our partners grow.</p></div>
          </div>
        </div>
      </section>

      <section>
        <div className="wrap">
          <div className="sec-head">
            <div><span className="label reveal">Timeline</span><h2 className="reveal d1">The story<br /><span className="r">so far.</span></h2></div>
          </div>
          <div className="timeline">
            <div className="tl reveal"><span className="idx">Chapter 01</span><h3>First frame</h3><p>A small team of game designers and maths veterans founds Skald with one rule: every game needs a point of view.</p></div>
            <div className="tl reveal"><span className="idx">Chapter 02</span><h3>Signature launch</h3><p>Our first flagship goes live and becomes a top performer for launch partners within weeks.</p></div>
            <div className="tl reveal"><span className="idx">Chapter 03</span><h3>Certified &amp; scaling</h3><p>Our game server is certified for multiple regulated markets, and the crash and table teams open.</p></div>
            <div className="tl reveal"><span className="idx">Chapter 04</span><h3>Your chapter</h3><p>40+ titles, a monthly release cadence and new markets every quarter. The next one could be yours.</p></div>
            <HiddenRune page="studio" style={{ right: 11, top: -27 }} />
          </div>
        </div>
      </section>

      <section style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="sec-head"><div><span className="label reveal">Leadership</span><h2 className="reveal d1">The <span className="r">crew.</span></h2></div></div>
          {/* Placeholder team: replace names, roles and add photos */}
          <div className="team">
            <div className="member reveal"><div className="avatar">EH</div><h4>Erik Halvorsen</h4><span>Chief Executive</span></div>
            <div className="member reveal d1"><div className="avatar">AL</div><h4>Astrid Lund</h4><span>Creative Director</span></div>
            <div className="member reveal d2"><div className="avatar">BS</div><h4>Bjorn Sandvik</h4><span>Head of Maths</span></div>
            <div className="member reveal d3"><div className="avatar">SD</div><h4>Sigrid Dahl</h4><span>CTO</span></div>
          </div>
        </div>
      </section>

      <CtaBox label="Careers" title={<>Build worlds<br /><span className="r">with us.</span></>}
        lead="Artists, game designers, mathematicians and engineers who want their work recognised." to="/contact" cta="Join the crew" />
    </>
  )
}
