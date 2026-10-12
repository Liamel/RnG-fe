import { useEffect } from 'react'
import { reduced } from './quest'

/** Every few seconds, tears a random `.glitch` headline into red/blue slices for a split second. */
export function useGlitch(key: string) {
  useEffect(() => {
    if (reduced) return
    const timer = setInterval(() => {
      const all = document.querySelectorAll('.glitch')
      const el = all[Math.floor(Math.random() * all.length)]
      if (!el) return
      el.classList.add('glitching')
      setTimeout(() => el.classList.remove('glitching'), 90 + Math.random() * 140)
    }, 2800)
    return () => clearInterval(timer)
  }, [key])
}
