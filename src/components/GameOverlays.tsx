import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { Link, useLocation } from 'react-router'
import { findGame, typeLabel } from '../data/games'
import { OverlaysContext } from '../lib/overlays'
import { trackGame, unlock } from '../lib/quest'
import { GameArt, GameTitle } from './GameArt'

/** Game details modal + live demo player, shared by every page. */
export function GameOverlays({ children }: { children: ReactNode }) {
  const [modalId, setModalId] = useState<string | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [demoId, setDemoId] = useState<string | null>(null)
  const [demoOpen, setDemoOpen] = useState(false)
  const [demoLoaded, setDemoLoaded] = useState(false)
  const closeRef = useRef<HTMLButtonElement>(null)
  const { pathname } = useLocation()

  const openGame = useCallback((id: string) => {
    if (!findGame(id)) return
    trackGame(id)
    setModalId(id)
    setModalOpen(true)
  }, [])
  const openDemo = useCallback((id: string) => {
    if (!findGame(id)?.demo) return
    setModalOpen(false)
    setDemoId(id)
    setDemoLoaded(false)
    setDemoOpen(true)
    unlock('demo')
  }, [])
  const ctx = useMemo(() => ({ openGame, openDemo }), [openGame, openDemo])

  // a link inside the modal navigates away: close everything
  useEffect(() => { setModalOpen(false); setDemoOpen(false) }, [pathname])

  // only touch the scroll lock when an overlay opens or closes (the boot screen holds it on first load)
  const locked = useRef(false)
  useEffect(() => {
    const lock = modalOpen || demoOpen
    if (lock === locked.current) return
    locked.current = lock
    document.body.style.overflow = lock ? 'hidden' : ''
  }, [modalOpen, demoOpen])
  useEffect(() => { if (modalOpen) closeRef.current?.focus() }, [modalOpen, modalId])
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { setModalOpen(false); setDemoOpen(false) } }
    addEventListener('keydown', onKey)
    return () => removeEventListener('keydown', onKey)
  }, [])

  const g = findGame(modalId)
  const d = findGame(demoId)

  return (
    <OverlaysContext value={ctx}>
      {children}

      <div className={`modal${modalOpen ? ' open' : ''}`} role="dialog" aria-modal="true" aria-label="Game details">
        <div className="modal-backdrop" onClick={() => setModalOpen(false)} />
        <div className="modal-card">
          <button ref={closeRef} className="modal-close" aria-label="Close" onClick={() => setModalOpen(false)}>✕</button>
          <div className="modal-art">{g && <GameArt game={g} />}</div>
          <div className="modal-body">
            {g && <>
              <span className="label">{typeLabel[g.type]}</span>
              <h3><GameTitle game={g} /></h3>
              <p>{g.desc}</p>
              <div className="specs">
                <div><small>RTP</small><b>{g.rtp}</b></div>
                <div><small>Max win</small><b>{g.max}</b></div>
                <div><small>Volatility</small><b>{g.vol}/5</b></div>
                <div style={{ gridColumn: 'span 2' }}><small>Format</small><b>{g.grid}</b></div>
                <div><small>Platform</small><b>HTML5</b></div>
              </div>
              <div className="hero-cta" style={{ marginTop: 'auto' }}>
                {g.demo
                  ? <button className="btn btn-red" onClick={() => openDemo(g.id)}>Play demo <span className="ar">▶</span></button>
                  : <Link className="btn btn-red" to={`/contact?game=${g.id}`}>Request demo <span className="ar">↗</span></Link>}
                <Link className="link" to="/integration">Integrate <span className="ar">↗</span></Link>
              </div>
            </>}
          </div>
        </div>
      </div>

      {d && (
        <div className={`demo${demoOpen ? ' open' : ''}${d.demoProtected ? ' protected' : ''}`} role="dialog" aria-modal="true" aria-label="Game demo">
          <div className="demo-backdrop" onClick={() => setDemoOpen(false)} />
          <div className="demo-shell">
            <div className="demo-bar">
              <span className="demo-title">{d.logo ? <img src={d.logo} alt={d.title} /> : d.title}</span>
              <span className="label">Live demo</span>
              <span className="demo-hint">Password screen not letting you in? Some browsers block sign-in inside embedded games.</span>
              <a className="demo-ext link" href={d.demo} target="_blank" rel="noopener">Open in new tab <span className="ar">↗</span></a>
              <button className="demo-close" aria-label="Close demo" onClick={() => setDemoOpen(false)}>✕</button>
            </div>
            <div className="demo-frame">
              {demoOpen && <iframe src={d.demo} title={`${d.title} demo`} allow="autoplay; fullscreen" allowFullScreen onLoad={() => setDemoLoaded(true)} />}
              {demoOpen && !demoLoaded && (
                <div className="now-loading" aria-live="polite"><span className="nl-rune rune" aria-hidden="true">ᛊ</span><span>Now loading</span></div>
              )}
            </div>
          </div>
        </div>
      )}
    </OverlaysContext>
  )
}
