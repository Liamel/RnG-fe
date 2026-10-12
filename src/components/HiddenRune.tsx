import { useLayoutEffect, useRef, useState, type CSSProperties } from 'react'
import { RUNES, centerOf, findRune, useQuest, type PageKey } from '../lib/quest'

/** The page's hidden rune. Render it inside its host element; it positions itself absolutely within it. */
export default function HiddenRune({ page, style }: { page: PageKey; style: CSSProperties }) {
  const S = useQuest()
  const ref = useRef<HTMLButtonElement>(null)
  const [got, setGot] = useState(false)
  const g = RUNES[page]
  const found = S.runes.includes(g)

  useLayoutEffect(() => {
    const host = ref.current?.parentElement
    if (host && getComputedStyle(host).position === 'static') host.style.position = 'relative'
  }, [found])

  if (found && !got) return null
  return (
    <button
      ref={ref}
      className={`hidden-rune${got ? ' got' : ''}`}
      aria-label="Hidden rune"
      style={style}
      onClick={(e) => {
        e.stopPropagation()
        if (got) return
        const [x, y] = centerOf(e.currentTarget)
        setGot(true)
        setTimeout(() => setGot(false), 600)
        findRune(page, x, y)
      }}
    >
      {g}
    </button>
  )
}
