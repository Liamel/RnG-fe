import { useEffect, useRef, useState, type ReactNode } from 'react'
import { addXP, burst, centerOf, flash, questState, reduced, takeSpin, unlock, useQuest } from '../lib/quest'
import { Mark } from './Logo'

// the <Mark> as an HTML string, since the reels are animated outside React
const markHTML = (cls: string) =>
  `<svg class="${cls}" viewBox="127 57 340 557" aria-hidden="true"><image href="/assets/logo.webp" width="2000" height="673"/></svg>`

const SYMS = [
  { k: 'skull', w: 1, html: markHTML('sym-mark') },
  { k: 'seven', w: 2, html: '7' },
  { k: 'othala', w: 3, html: 'ᛟ' },
  { k: 'thurs', w: 4, html: 'ᚦ' },
  { k: 'algiz', w: 4, html: 'ᛉ' },
]
type Sym = typeof SYMS[number]
const PAY: Record<string, number> = { skull: 300, seven: 150, othala: 100, thurs: 60, algiz: 60 }
const total = SYMS.reduce((a, s) => a + s.w, 0)
const pick = () => { let r = Math.random() * total; return SYMS.find((s) => (r -= s.w) < 0) || SYMS[SYMS.length - 1] }
// reel strips are animated directly on the DOM (outside React's render) for smooth, exact timing
const symHTML = (s: Sym) => `<div class="sym" data-k="${s.k}">${s.html}</div>`
const OUT = 'Out of spins. Find a hidden rune for a bonus spin, or come back tomorrow.'

/** "Spin the Saga" — XP-only mini slot (home). */
export default function SlotMachine() {
  const left = useQuest().spins.left
  const [spinning, setSpinning] = useState(false)
  const [msg, setMsg] = useState<ReactNode>('Pull the lever, skald.')
  // win/mega classes are toggled on the DOM: the slot's className must stay static for the .reveal → .in animation
  const slot = useRef<HTMLDivElement>(null)
  const reelsBox = useRef<HTMLDivElement>(null)
  const reels = useRef<HTMLDivElement[]>([])

  useEffect(() => {
    reels.current.forEach((r, i) => (r.querySelector('.strip')!.innerHTML = symHTML(SYMS[[2, 0, 2][i]])))
  }, [])
  useEffect(() => { if (!spinning && left <= 0) setMsg(OUT) }, [spinning, left])

  const settle = (res: Sym[]) => {
    setSpinning(false)
    const [a, b, c] = res.map((s) => s.k)
    const [x, y] = centerOf(reelsBox.current!)
    unlock('spin')
    if (a === b && b === c) {
      const won = PAY[a], mega = a === 'skull'
      reels.current.forEach((r) => r.classList.add('hit'))
      slot.current!.classList.add(mega ? 'mega' : 'win')
      setMsg(<><b>{mega ? 'MEGA WIN' : 'BIG WIN'}</b> · three {mega ? 'Skald skulls' : 'of a kind'} · +{won} XP</>)
      burst(x, y, mega ? 90 : 45)
      if (mega) flash()
      addXP(won, x, y - 60)
      unlock('bigwin')
    } else if (a === b || b === c || a === c) {
      const k = a === b || a === c ? a : b
      reels.current.forEach((r) => (r.querySelector<HTMLElement>('.sym')!.dataset.k === k && r.classList.add('hit')))
      setMsg('Pair · +15 XP. So close.')
      addXP(15, x, y - 60)
    } else {
      setMsg(questState().spins.left ? 'No match. The saga continues…' : '')
    }
  }

  const spin = () => {
    if (spinning || !takeSpin()) return
    setSpinning(true)
    slot.current!.classList.remove('win', 'mega')
    reels.current.forEach((r) => r.classList.remove('hit'))
    setMsg('Spinning…')

    // ~1 in 5 spins lands a triple; otherwise independent reels (pairs are common)
    const first = pick()
    const result = Math.random() < .2 ? [first, first, first] : [first, pick(), pick()]
    const h = reels.current[0].clientHeight

    reels.current.forEach((reel, i) => {
      const strip = reel.querySelector<HTMLElement>('.strip')!
      const n = 14 + i * 6
      const filler = Array.from({ length: n }, () => symHTML(pick())).join('')
      strip.style.transition = 'none'
      strip.style.transform = 'translateY(0)'
      strip.innerHTML = strip.innerHTML + filler + symHTML(result[i])
      void strip.offsetHeight
      const dur = reduced ? 0 : 1100 + i * 450
      strip.style.transition = `transform ${dur}ms cubic-bezier(.15,.75,.2,1.04)`
      strip.style.transform = `translateY(${-(n + 1) * h}px)`
      setTimeout(() => {
        strip.style.transition = 'none'
        strip.style.transform = 'translateY(0)'
        strip.innerHTML = symHTML(result[i])
        reel.classList.add('stop')
        setTimeout(() => reel.classList.remove('stop'), 300)
        if (i === reels.current.length - 1) settle(result)
      }, dur + 30)
    })
  }

  return (
    <div className="slot reveal d2" data-slot ref={slot}>
      <div className="slot-top"><span className="idx">Skald / Saga reels</span><span className="idx">{left} spin{left === 1 ? '' : 's'} left</span></div>
      <div className="reels" ref={reelsBox}>
        {[0, 1, 2].map((i) => (
          <div key={i} className="reel" ref={(el) => { if (el) reels.current[i] = el }}><div className="strip" /></div>
        ))}
        <i className="payline" aria-hidden="true" />
      </div>
      <p className="slot-msg" aria-live="polite">{msg}</p>
      <div className="slot-foot">
        <button className="btn btn-red spin-btn" disabled={spinning || left <= 0} onClick={spin}>Spin <span className="ar">↻</span></button>
        <ul className="paytable">
          <li><b className="pt-mark"><Mark className="sym-mark" /></b>×3 <em>300</em></li>
          <li><b>7</b>×3 <em>150</em></li>
          <li><b>ᛟ</b>×3 <em>100</em></li>
          <li><b>ᚦ ᛉ</b>×3 <em>60</em></li>
          <li>Pair <em>15</em></li>
        </ul>
      </div>
    </div>
  )
}
