import type { CSSProperties } from 'react'
import { typeLabel, type Game } from '../data/games'
import { useGameOverlays } from '../lib/overlays'

// Set `img` on a game in data/games.ts to show real artwork instead of the generated art
export function GameArt({ game: g, name = true }: { game: Game; name?: boolean }) {
  return (
    <div className="art" style={{ '--c1': g.c1, '--c2': g.c2, '--c3': g.c3 } as CSSProperties}>
      {g.img ? <img src={g.img} alt={g.title} loading="lazy" decoding="async" /> : <><span className="glyph">{g.glyph}</span>{name && <span className="name">{g.title}</span>}</>}
    </div>
  )
}

export function GameTitle({ game: g }: { game: Game }) {
  return g.logo ? <img className="game-logo" src={g.logo} alt={g.title} decoding="async" /> : <>{g.title}<span className="dot">.</span></>
}

export function Vol({ n }: { n: number }) {
  return <>{Array.from({ length: 5 }, (_, i) => <i key={i} className={i < n ? 'on' : ''} />)}</>
}

export function DemoButton({ game: g }: { game: Game }) {
  const { openDemo } = useGameOverlays()
  if (!g.demo) return null
  return (
    <button className="btn btn-line" onClick={(e) => { e.stopPropagation(); openDemo(g.id) }}>
      Play demo <span className="ar">▶</span>
    </button>
  )
}

export function GameCard({ game: g, hidden }: { game: Game; hidden?: boolean }) {
  const { openGame } = useGameOverlays()
  return (
    <article
      className="game-card reveal in"
      data-id={g.id}
      data-type={g.type}
      tabIndex={0}
      aria-label={g.title}
      style={hidden ? { display: 'none' } : undefined}
      onClick={() => openGame(g.id)}
      onKeyDown={(e) => { if (e.key === 'Enter') openGame(g.id) }}
    >
      {g.tag ? <span className={`tag ${g.tag}`}>{g.tag === 'hot' ? 'Hot' : 'New'}</span> : <span className="tag">{typeLabel[g.type]}</span>}
      {g.demo && <span className="tag play">▶ Playable</span>}
      <GameArt game={g} name={false} />
      <div className="game-info">
        <h3>{g.title}</h3>
        <div className="meta">
          <span>{typeLabel[g.type]} · RTP {g.rtp}</span>
          <span className="vol" title={`Volatility ${g.vol}/5`}><Vol n={g.vol} /></span>
        </div>
      </div>
    </article>
  )
}
