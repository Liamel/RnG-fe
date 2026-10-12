import { useEffect, useRef, useState } from 'react'

/** Counts up from 0 to `to` (eased) the first time it scrolls into view. */
export default function Counter({ to, suffix = '' }: { to: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const [value, setValue] = useState<string | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const end = parseFloat(to), dec = (to.split('.')[1] || '').length
    let raf = 0
    const io = new IntersectionObserver(([en]) => {
      if (!en.isIntersecting) return
      io.disconnect()
      const t0 = performance.now(), dur = 1600
      const tick = (t: number) => {
        const p = Math.min((t - t0) / dur, 1), v = end * (1 - Math.pow(1 - p, 3))
        setValue(v.toLocaleString('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec }))
        if (p < 1) raf = requestAnimationFrame(tick)
      }
      raf = requestAnimationFrame(tick)
    }, { threshold: .5 })
    io.observe(el)
    return () => { io.disconnect(); cancelAnimationFrame(raf) }
  }, [to])

  return <span className="big" ref={ref}>{value === null ? '0' : <>{value}<span className="r">{suffix}</span></>}</span>
}
