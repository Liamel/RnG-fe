import { useEffect, useRef } from 'react'

/** Fixed background layers and the scroll progress bar. */
export default function Atmosphere() {
  const progress = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - innerHeight
      if (progress.current) progress.current.style.width = (max > 0 ? (scrollY / max) * 100 : 0) + '%'
    }
    addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => removeEventListener('scroll', onScroll)
  }, [])
  return (
    <>
      <div className="bg-glow" aria-hidden="true" /><div className="bg-grid" aria-hidden="true" /><div className="dust" aria-hidden="true" />
      <div className="orbs" aria-hidden="true"><i /><i /><i /></div>
      <div className="progress" aria-hidden="true" ref={progress} />
    </>
  )
}
