import { useEffect, useRef } from 'react'

/** Counts up from 0 to `to` (eased) the first time it scrolls into view.
    Frames write straight to the DOM so the count-up never re-renders React. */
export default function Counter({ to, suffix = '' }: { to: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const end = parseFloat(to), dec = (to.split('.')[1] || '').length
    const fmt = (v: number) => v.toLocaleString('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec })
    let raf = 0
    el.textContent = '0'
    const io = new IntersectionObserver(([en]) => {
      if (!en.isIntersecting) return
      io.disconnect()
      el.innerHTML = `<span></span><span class="r">${suffix}</span>`
      const num = el.firstChild as HTMLSpanElement
      const t0 = performance.now(), dur = 1600
      const tick = (t: number) => {
        const p = Math.min((t - t0) / dur, 1)
        num.textContent = fmt(end * (1 - Math.pow(1 - p, 3)))
        if (p < 1) raf = requestAnimationFrame(tick)
      }
      raf = requestAnimationFrame(tick)
    }, { threshold: .5 })
    io.observe(el)
    return () => { io.disconnect(); cancelAnimationFrame(raf) }
  }, [to, suffix])

  return <span className="big" ref={ref} />
}
