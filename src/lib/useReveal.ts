import { useEffect } from 'react'

/** Adds `.in` to every `.reveal` element as it scrolls into view. Re-scans when `key` (the route) changes.
    Elements using `.reveal` must keep a static className so React never strips the added `.in`. */
export function useReveal(key: string) {
  useEffect(() => {
    const io = new IntersectionObserver((entries) => entries.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target) }
    }), { threshold: .12 })
    document.querySelectorAll('.reveal:not(.in)').forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [key])
}
