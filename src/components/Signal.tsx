import type { ReactNode } from 'react'
import { toRunes } from '../lib/runes'

/** Fixed CRT layer: scanlines + vignette, and animated film grain. */
export function CrtOverlay() {
  return <><div className="crt" aria-hidden="true" /><div className="noise" aria-hidden="true" /></>
}

/** Decorative runic transliteration of `text`. */
export function Runes({ text, className = '' }: { text: string; className?: string }) {
  return <span className={`rune ${className}`.trim()} aria-hidden="true">{toRunes(text)}</span>
}

/** Text that occasionally tears into red/blue slices (driven by useGlitch). */
export function Glitch({ children }: { children: string }) {
  return <span className="glitch" data-text={children}>{children}</span>
}

/** Endless scrolling ticker; items alternate with red runes. */
export function Ticker({ items }: { items: string[] }) {
  const runes = ['ᚨ', 'ᛉ', 'ᚺ', 'ᚲ', 'ᛇ', 'ᛞ', 'ᛟ', 'ᚠ']
  const list = (hidden?: boolean): ReactNode => (
    <ul aria-hidden={hidden || undefined}>
      {items.flatMap((t, i) => [<li key={t}>{t}</li>, <li key={t + '-r'} className="r">{runes[i % runes.length]}</li>])}
    </ul>
  )
  return <div className="ticker"><div className="track">{list()}{list(true)}</div></div>
}
