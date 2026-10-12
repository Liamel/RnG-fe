import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { useLocation } from 'react-router'
import { ACH, RANKS, RUNE_ORDER, burst, flash, onFx, rankOf, reset, unlock, useQuest } from '../lib/quest'
import { Mark } from './Logo'

interface Toast { id: number; g: string; title: string; desc: string; xp: number; big?: boolean; out?: boolean }
interface Particle { id: number; x: number; y: number; dx: number; dy: number; r: number; white: boolean }
interface Float { id: number; text: string; x: number; y: number }

let uid = 0
const restart = (el: HTMLElement | null, cls: string) => {
  if (!el) return
  el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls)
}

/** Skald Quest HUD, toasts and reward effects, plus the site-wide quest triggers. */
export default function QuestLayer() {
  const S = useQuest()
  const [open, setOpen] = useState(false)
  const [peek, setPeek] = useState(false)
  const [bump, setBump] = useState(0)
  const [toasts, setToasts] = useState<Toast[]>([])
  const [particles, setParticles] = useState<Particle[]>([])
  const [floats, setFloats] = useState<Float[]>([])
  const hud = useRef<HTMLDivElement>(null)
  const flashEl = useRef<HTMLDivElement>(null)
  const { pathname } = useLocation()

  // ---------- effects ----------
  useEffect(() => {
    let peekTimer: ReturnType<typeof setTimeout>
    return onFx((fx) => {
      if (fx.type === 'toast') {
        const t = { ...fx, id: ++uid }
        setToasts((ts) => [...ts, t])
        setTimeout(() => setToasts((ts) => ts.map((x) => (x.id === t.id ? { ...x, out: true } : x))), fx.big ? 4200 : 3200)
        setTimeout(() => setToasts((ts) => ts.filter((x) => x.id !== t.id)), fx.big ? 4800 : 3800)
      } else if (fx.type === 'float') {
        const f = { ...fx, id: ++uid }
        setFloats((fs) => [...fs, f])
        setTimeout(() => setFloats((fs) => fs.filter((x) => x.id !== f.id)), 1400)
      } else if (fx.type === 'burst') {
        const ps = Array.from({ length: fx.n }, () => {
          const a = Math.random() * Math.PI * 2, d = 80 + Math.random() * 220
          return { id: ++uid, x: fx.x, y: fx.y, dx: Math.cos(a) * d, dy: Math.sin(a) * d, r: Math.random() * 720 - 360, white: Math.random() <= .3 }
        })
        const ids = new Set(ps.map((p) => p.id))
        setParticles((cur) => [...cur, ...ps])
        setTimeout(() => setParticles((cur) => cur.filter((p) => !ids.has(p.id))), 1100)
      } else if (fx.type === 'flash') {
        restart(flashEl.current, 'on')
      } else if (fx.type === 'bump') {
        setBump((b) => b + 1)
        setPeek(true)
        clearTimeout(peekTimer)
        peekTimer = setTimeout(() => setPeek(false), 2800)
      }
    })
  }, [])

  // 'bump' stays in className (so re-renders keep it); restart its animation on every XP gain
  useEffect(() => { if (bump) restart(hud.current, 'bump') }, [bump])

  // ---------- site-wide triggers ----------
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => { if (!hud.current?.contains(e.target as Node)) setOpen(false) }
    // secret: type S-K-A-L-D anywhere
    let typed = ''
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as Element).closest?.('input, textarea, select')) return
      typed = (typed + e.key.toUpperCase()).slice(-5)
      if (typed === 'SKALD') {
        restart(document.body, 'berserk')
        flash()
        burst(innerWidth / 2, innerHeight / 2, 70)
        unlock('berserk')
        setTimeout(() => document.body.classList.remove('berserk'), 900)
      }
    }
    document.addEventListener('click', onDocClick)
    addEventListener('keydown', onKey)
    return () => { document.removeEventListener('click', onDocClick); removeEventListener('keydown', onKey) }
  }, [])

  // deep diver: scroll to the very bottom of a page
  useEffect(() => {
    let done = false
    const onScroll = () => {
      if (done) return
      if (innerHeight + scrollY >= document.documentElement.scrollHeight - 40) { done = true; unlock('deep') }
    }
    addEventListener('scroll', onScroll, { passive: true })
    return () => removeEventListener('scroll', onScroll)
  }, [pathname])

  // ---------- HUD ----------
  const r = rankOf(S.xp), cur = RANKS[r], next = RANKS[r + 1]
  const pct = next ? ((S.xp - cur.xp) / (next.xp - cur.xp)) * 100 : 100
  const runes = <>{RUNE_ORDER.map((g) => <b key={g} data-g={g} className={S.runes.includes(g) ? 'on' : ''}>{g}</b>)}</>

  return (
    <>
      <div className={`quest${open ? ' open' : ''}${peek ? ' peek' : ''}${bump ? ' bump' : ''}`} data-quest ref={hud}>
        <button className="quest-pill" aria-expanded={open} aria-label="Open Skald Quest progress" style={{ '--pct': pct + '%' } as CSSProperties} onClick={() => setOpen(!open)}>
          <Mark className="q-mark" />
          <span className="q-main"><span className="q-rank">{cur.name}</span><span className="q-bar"><i style={{ width: pct + '%' }} /></span></span>
          <span className="q-xp">{S.xp} XP</span>
          <span className="q-runes" aria-hidden="true">{runes}</span>
        </button>
        <div className="quest-panel" role="dialog" aria-label="Skald Quest">
          <div className="qp-head">
            <span className="label">Memory card · Slot 1</span>
            <h4 className="qp-rank">Rank {r + 1} · {cur.name}</h4>
            <p className="qp-next">{next ? `${next.xp - S.xp} XP to ${next.name}` : 'Highest rank reached. You are a true Skald.'}</p>
            <div className="q-bar big"><i style={{ width: pct + '%' }} /></div>
          </div>
          <div className="qp-runes">
            <span className="idx">Hidden runes · one on every page</span>
            <div>{runes}</div>
          </div>
          <ul className="qp-list">
            {Object.entries(ACH).map(([id, a]) => {
              const done = S.ach.includes(id), hidden = 'secret' in a && !done
              return (
                <li key={id} className={done ? 'done' : ''}>
                  <span className="g">{hidden ? '?' : a.g}</span>
                  <span><b>{hidden ? 'Secret achievement' : a.t}</b><small>{hidden ? 'Keep exploring…' : a.d}</small></span>
                  <em>{done ? '✓' : '+' + a.xp}</em>
                </li>
              )
            })}
          </ul>
          <div className="qp-foot"><span className="idx">Saved to memory card (this browser)</span><button className="qp-reset idx" onClick={reset}>Reset</button></div>
        </div>
      </div>

      <div className="toasts" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className={`toast${t.big ? ' big' : ''}${t.out ? ' out' : ''}`}>
            <span className="tg">{t.g}</span><span><b>{t.title}</b><small>{t.desc}</small></span>{t.xp ? <em>+{t.xp} XP</em> : null}
          </div>
        ))}
      </div>
      <div className="flash" aria-hidden="true" ref={flashEl} />

      {floats.map((f) => <span key={f.id} className="xp-float" style={{ left: f.x, top: f.y }}>{f.text}</span>)}
      {particles.map((p) => (
        <i key={p.id} className="shardp" style={{ left: p.x, top: p.y, '--dx': p.dx + 'px', '--dy': p.dy + 'px', '--r': p.r + 'deg', background: p.white ? '#fff' : '#ff2d46' } as CSSProperties} />
      ))}
    </>
  )
}
