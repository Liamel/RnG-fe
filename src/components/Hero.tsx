import './Hero.css'

function Hero() {
  return (
    <section className="hero scanlines" id="top">
      <div className="hero-inner wrap">
        <div className="hero-copy">
          <p className="hero-eyebrow">EST. 2026 — REAL-TIME MULTIPLAYER GAME STUDIO</p>
          <h1 className="hero-title">
            RANDOM
            <br />
            BY NAME.
            <br />
            <span className="hero-red">RANDOM</span>
            <br />
            <span className="hero-red">BY NATURE.</span>
          </h1>
          <p className="hero-sub">
            R&amp;G Studios builds certified real-time cash-out games.
            Server-authoritative math, provably fair rounds, arcade souls.
          </p>
          <div className="hero-ctas">
            <a className="hero-btn hero-btn-red" href="#games">
              PLAY ARKNOID
            </a>
            <a className="hero-btn hero-btn-dark" href="#games">
              GAME CATALOG
            </a>
          </div>
        </div>

        <div className="hero-capture stripes-panel">
          <span className="hero-capture-label">[ arknoid gameplay capture ]</span>
          <span className="hero-capture-live">LIVE 24.87x</span>
        </div>
      </div>
    </section>
  )
}

export default Hero
