import { useEffect, useRef } from 'react'

/** Fixed background glow and the scroll progress bar. */
export default function Atmosphere() {
  const progress = useRef<HTMLDivElement>(null)
  useEffect(() => {
    // one update per frame, and scaleX instead of width so the bar never triggers layout
    let raf = 0
    const update = () => {
      raf = 0
      const max = document.documentElement.scrollHeight - innerHeight
      if (progress.current) progress.current.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update) }
    addEventListener('scroll', onScroll, { passive: true })
    update()
    return () => { removeEventListener('scroll', onScroll); cancelAnimationFrame(raf) }
  }, [])
  return (
    <>
      <div className="bg-glow" aria-hidden="true" />
      <div className="progress" aria-hidden="true" ref={progress} />
    </>
  )
}
