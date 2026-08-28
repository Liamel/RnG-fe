import { useEffect, useMemo, useRef, type CSSProperties } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './FoldText.css'

gsap.registerPlugin(ScrollTrigger)

type FoldTextProps = {
  text: string
  splitBy?: 'char' | 'word' | 'line'
  hinge?: 'top' | 'bottom' | 'left' | 'right'
  trigger?: 'mount' | 'scroll'
  duration?: number
  stagger?: number
  fontSize?: string | number
  fontWeight?: string | number
  color?: string
  className?: string
}

const hinges = {
  top: { origin: '50% 0%', rotateX: -92, rotateY: 0 },
  bottom: { origin: '50% 100%', rotateX: 92, rotateY: 0 },
  left: { origin: '0% 50%', rotateX: 0, rotateY: 92 },
  right: { origin: '100% 50%', rotateX: 0, rotateY: -92 },
}

function FoldText({ text, splitBy = 'char', hinge = 'top', trigger = 'scroll', duration = 1.5,
  stagger = 0.035, fontSize = 80, fontWeight = 800, color = '#f7f2e8', className = '' }: FoldTextProps) {
  const rootRef = useRef<HTMLSpanElement>(null)
  const config = hinges[hinge]
  const pieces = useMemo(() => {
    if (splitBy === 'line') return text.split('\n')
    if (splitBy === 'word') return text.split(/(\s+)/)
    return Array.from(text)
  }, [splitBy, text])

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const nodes = root.querySelectorAll('.fold-text-piece')
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const context = gsap.context(() => {
      const tween = gsap.fromTo(nodes, {
        opacity: 0,
        rotateX: reduced ? 0 : config.rotateX,
        rotateY: reduced ? 0 : config.rotateY,
        transformOrigin: config.origin,
        '--fold-crease': reduced ? 0 : 0.58,
      }, {
        opacity: 1, rotateX: 0, rotateY: 0, '--fold-crease': 0,
        duration: reduced ? 0.2 : duration, stagger: reduced ? 0.01 : stagger, ease: 'power3.out',
        paused: trigger === 'scroll',
      })
      if (trigger === 'scroll') ScrollTrigger.create({ trigger: root, start: 'top 84%', once: true, onEnter: () => tween.play() })
    }, root)
    return () => context.revert()
  }, [config, duration, stagger, text, trigger])

  const style = { '--fold-text-font-size': typeof fontSize === 'number' ? `${fontSize}px` : fontSize,
    '--fold-text-font-weight': fontWeight, '--fold-text-color': color } as CSSProperties

  return <span ref={rootRef} className={`fold-text ${className}`} style={style}>
    <span className="fold-text-sr-only">{text}</span>
    <span className="fold-text-visual" aria-hidden="true">
      {pieces.map((piece, index) => piece.trim() === ''
        ? <span className="fold-text-space" key={index}>&nbsp;</span>
        : <span className={`fold-text-segment ${splitBy === 'line' ? 'fold-text-line' : ''}`} key={index}>
            <span className="fold-text-piece" data-fold-hinge={hinge}>{piece}</span>
          </span>)}
    </span>
  </span>
}

export default FoldText
