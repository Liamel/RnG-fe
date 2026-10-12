import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router'
import { reduced } from '../lib/quest'

const BOOTED = 'skald-booted'

/** Console boot sequence: CRT power-on, logo, load bar, "Press start". Once per browser session; any key or click starts. */
export function BootScreen() {
  const [phase, setPhase] = useState<'on' | 'ready' | 'exit' | 'done'>(() => {
    try { if (reduced || sessionStorage.getItem(BOOTED)) return 'done' } catch { /* storage unavailable */ }
    return 'on'
  })
  const live = phase === 'on' || phase === 'ready'

  const start = useCallback(() => {
    try { sessionStorage.setItem(BOOTED, '1') } catch { /* storage unavailable */ }
    setPhase('exit')
    setTimeout(() => setPhase('done'), 620)
  }, [])

  useEffect(() => {
    if (!live) return
    document.body.style.overflow = 'hidden'
    const ready = setTimeout(() => setPhase((p) => (p === 'on' ? 'ready' : p)), 2300)
    const auto = setTimeout(start, 7500) // never hold the site hostage
    // capture + stop: the key that presses start must not also switch pages or count toward the quest
    const onKey = (e: KeyboardEvent) => { e.stopImmediatePropagation(); start() }
    addEventListener('keydown', onKey, true)
    return () => { document.body.style.overflow = ''; clearTimeout(ready); clearTimeout(auto); removeEventListener('keydown', onKey, true) }
  }, [live, start])

  if (phase === 'done') return null
  return (
    <div className={`boot ${phase}`} onClick={live ? start : undefined} role="dialog" aria-label="Skald Entertainment System">
      <div className="boot-line" />
      <div className="boot-core">
        <img className="boot-mark" src="/assets/skald-mark.svg" alt="" />
        <div className="boot-word">Skald</div>
        <div className="boot-sub">Skald Entertainment System</div>
        <div className="boot-load"><i /></div>
        <div className="boot-runes rune" aria-hidden="true">ᛊᚲᚨᛚᛞ᛫ᛖᚾᛏᛖᚱᛏᚨᛁᚾᛗᛖᚾᛏ᛫ᛊᛃᛊᛏᛖᛗ</div>
        <span className="boot-start">Press start</span>
      </div>
      <div className="boot-foot"><span>© {new Date().getFullYear()} Skald Gaming</span><span>B2B · Regulated markets · 18+</span></div>
      <button className="boot-skip" onClick={(e) => { e.stopPropagation(); start() }}>Skip ▸▸</button>
    </div>
  )
}

/** Quick CRT "channel switch" flash on every page change. */
export function ChannelSwitch() {
  const { pathname } = useLocation()
  const ref = useRef<HTMLDivElement>(null)
  const first = useRef(true)
  useLayoutEffect(() => {
    if (first.current) { first.current = false; return }
    const el = ref.current
    if (!el || reduced) return
    el.classList.remove('on'); void el.offsetWidth; el.classList.add('on')
  }, [pathname])
  return <div className="channel-switch" ref={ref} aria-hidden="true" />
}

/** Controller-style button prompts (desktop). */
export function PromptBar() {
  return (
    <div className="prompts" aria-hidden="true">
      <span><kbd>Q</kbd><kbd>E</kbd>Switch</span>
      <span><kbd>↵</kbd>Select</span>
      <span><kbd>Esc</kbd>Back</span>
    </div>
  )
}
