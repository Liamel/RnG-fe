import { useId } from 'react'

// Logo artwork is cropped from /assets/logo.webp (2000×673, transparent) via the viewBox.
// The mark and the wordmark are clipped into two layers so light mode can turn the white wordmark dark
// while the red mark keeps its colour (see .logo-wordmark in light.css).
export function Logo() {
  const id = 'skald-logo-' + useId().replace(/[^a-zA-Z0-9]/g, '')
  return (
    <svg className="brand-logo" viewBox="127 57 1745 557" role="img" aria-label="Skald Gaming">
      <defs>
        <clipPath id={`${id}-m`}><rect width="540" height="673" /></clipPath>
        <clipPath id={`${id}-w`}><rect x="540" width="1460" height="673" /></clipPath>
      </defs>
      <image href="/assets/logo.webp" width="2000" height="673" clipPath={`url(#${id}-m)`} />
      <image className="logo-wordmark" href="/assets/logo.webp" width="2000" height="673" clipPath={`url(#${id}-w)`} />
    </svg>
  )
}

/** The red Skald skull mark on its own. */
export function Mark({ className = 'mark' }: { className?: string }) {
  return (
    <svg className={className} viewBox="127 57 340 557" aria-hidden="true">
      <image href="/assets/logo.webp" width="2000" height="673" />
    </svg>
  )
}
