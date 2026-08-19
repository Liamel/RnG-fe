import { useCallback, useEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type MouseEvent } from 'react'
import { gsap } from 'gsap'
import './AccordionGallery.css'

export type AccordionGalleryItem = {
  image?: string
  embedUrl?: string
  label?: string
  link?: string
  alt?: string
  eyebrow?: string
}

type AccordionGalleryProps = {
  items: AccordionGalleryItem[]
  defaultIndex?: number
  accentColor?: string
  overlayColor?: string
  textColor?: string
  height?: number
  gap?: number
  radius?: number
  expandRatio?: number
  duration?: number
  ease?: string
  parallax?: number
  tilt?: number
  stagger?: number
  trigger?: 'hover' | 'click'
  showLabels?: boolean
  grayscale?: boolean
  className?: string
}

type GalleryStyle = CSSProperties & Record<`--ag-${string}`, string>

function AccordionGallery({
  items, defaultIndex = 2, accentColor = '#ff4038', overlayColor = '#060010', textColor = '#ffffff',
  height = 500, gap = 10, radius = 4, expandRatio = 0.52, duration = 0.6, ease = 'power3.out',
  parallax = 0.5, tilt = 6, stagger = 0.06, trigger = 'hover', showLabels = true, grayscale = true,
  className = '',
}: AccordionGalleryProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const panelRefs = useRef<Array<HTMLAnchorElement | null>>([])
  const mediaRefs = useRef<Array<HTMLSpanElement | null>>([])
  const barRefs = useRef<Array<HTMLSpanElement | null>>([])
  const textRefs = useRef<Array<HTMLSpanElement | null>>([])
  const timelineRef = useRef<gsap.core.Timeline | null>(null)
  const firstRunRef = useRef(true)
  const mediaSizeRef = useRef(320)
  const count = items.length
  const [active, setActive] = useState(Math.min(Math.max(defaultIndex, 0), count - 1))
  const [engagedEmbed, setEngagedEmbed] = useState<number | null>(null)
  const prefersReduced = typeof window !== 'undefined' && window.matchMedia
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false

  const applyLayout = useCallback((animate: boolean) => {
    if (!panelRefs.current.length) return
    const ratio = Math.min(Math.max(expandRatio, 0.2), 0.9)
    const grow = count > 1 ? (ratio * (count - 1)) / (1 - ratio) : 1
    const seconds = animate && !prefersReduced ? duration : 0
    timelineRef.current?.kill()
    const timeline = gsap.timeline()

    panelRefs.current.forEach((panel, index) => {
      if (!panel) return
      const isActive = index === active
      const rotation = isActive ? 0 : index < active ? tilt : -tilt
      const media = mediaRefs.current[index]
      const bar = barRefs.current[index]
      const text = textRefs.current[index]
      const isEmbed = Boolean(items[index]?.embedUrl)
      timeline.to(panel, { flexGrow: isActive ? grow : 1, rotateY: rotation, duration: seconds, ease }, 0)
      if (media) {
        const shift = Math.max(-1.5, Math.min(1.5, active - index)) * parallax * mediaSizeRef.current * 0.06
        timeline.to(media, {
          xPercent: isEmbed ? 0 : -50,
          yPercent: isEmbed ? 0 : -50,
          x: isEmbed ? 0 : isActive ? 0 : shift,
          y: 0,
          '--ag-gray': grayscale ? (isActive ? 0 : 1) : 0, '--ag-dim': isActive ? 0 : 0.42,
          duration: seconds, ease,
        }, 0)
      }
      if (showLabels && bar && text) {
        timeline.to([bar, text], isActive
          ? { opacity: 1, x: 0, duration: seconds, ease, stagger: prefersReduced ? 0 : stagger }
          : { opacity: 0, x: -14, duration: seconds * 0.6, ease }, 0)
      }
    })
    timelineRef.current = timeline
  }, [active, count, duration, ease, expandRatio, grayscale, items, parallax, prefersReduced, showLabels, stagger, tilt])

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const measure = () => {
      const usable = Math.max(root.getBoundingClientRect().width - gap * (count - 1), 120)
      const size = Math.max(140, usable * Math.min(Math.max(expandRatio, 0.2), 0.9) * 1.22)
      mediaSizeRef.current = size
      root.style.setProperty('--ag-media-size', `${size}px`)
      applyLayout(!firstRunRef.current)
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(root)
    return () => observer.disconnect()
  }, [applyLayout, count, expandRatio, gap])

  useEffect(() => { applyLayout(!firstRunRef.current); firstRunRef.current = false }, [applyLayout])
  useEffect(() => () => { timelineRef.current?.kill() }, [])

  const handleClick = (index: number, event: MouseEvent<HTMLAnchorElement>) => {
    if (index !== active || items[index]?.embedUrl) event.preventDefault()
    setActive(index)
    setEngagedEmbed(items[index]?.embedUrl ? index : null)
  }
  const handleKeyDown = (index: number, event: KeyboardEvent<HTMLAnchorElement>) => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      event.preventDefault()
      const next = (index + 1) % count
      setActive(next)
      setEngagedEmbed(items[next]?.embedUrl ? next : null)
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      event.preventDefault()
      const previous = (index - 1 + count) % count
      setActive(previous)
      setEngagedEmbed(items[previous]?.embedUrl ? previous : null)
    }
  }
  const style: GalleryStyle = {
    '--ag-accent': accentColor, '--ag-overlay': overlayColor, '--ag-text': textColor,
    '--ag-gap': `${gap}px`, '--ag-radius': `${radius}px`, height: `${height}px`,
  }

  return (
    <div
      ref={rootRef}
      className={`accordion-gallery${className ? ` ${className}` : ''}`}
      style={style}
      role="list"
      aria-label="RnG Studios games"
      onMouseLeave={() => setEngagedEmbed(null)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setEngagedEmbed(null)
      }}
    >
      {items.map((item, index) => {
        const isActive = index === active
        return (
          <a key={item.label ?? index} ref={(element) => { panelRefs.current[index] = element }}
            className={`ag-panel${isActive ? ' ag-panel--active' : ''}`} href={item.link || '#games'}
            onClick={(event) => handleClick(index, event)} onMouseEnter={() => {
              if (trigger === 'hover') {
                setActive(index)
                setEngagedEmbed(item.embedUrl ? index : null)
              }
            }}
            onFocus={() => {
              setActive(index)
              setEngagedEmbed(item.embedUrl ? index : null)
            }} onKeyDown={(event) => handleKeyDown(index, event)}
            role="listitem" aria-current={isActive ? 'true' : undefined} aria-label={item.label}>
            <span className="ag-panel__frame">
              <span className={`ag-panel__media${item.embedUrl ? ' ag-panel__media--embed' : ''}${item.embedUrl && isActive && engagedEmbed === index ? ' ag-panel__media--live' : ''}`} ref={(element) => { mediaRefs.current[index] = element }}>
                {item.image && <img src={item.image} alt={item.alt || item.label || ''} draggable="false" />}
                {item.embedUrl && (
                  <iframe
                    src={item.embedUrl}
                    title={`${item.label || 'Game'} live demo`}
                    loading="eager"
                    allow="autoplay; fullscreen; gamepad"
                    allowFullScreen
                  />
                )}
              </span>
              <span className="ag-panel__overlay" aria-hidden="true" />
            </span>
            {showLabels && <span className="ag-panel__label" aria-hidden="true">
              <span className="ag-panel__bar" ref={(element) => { barRefs.current[index] = element }} />
              <span className="ag-panel__copy" ref={(element) => { textRefs.current[index] = element }}>
                {item.eyebrow && <span className="ag-panel__eyebrow">{item.eyebrow}</span>}
                <span className="ag-panel__text">{item.label}</span>
              </span>
            </span>}
          </a>
        )
      })}
    </div>
  )
}

export default AccordionGallery
