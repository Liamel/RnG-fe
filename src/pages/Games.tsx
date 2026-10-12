import { useEffect, useState } from 'react'
import { useLocation } from 'react-router'
import CtaBox from '../components/CtaBox'
import { GameCard } from '../components/GameArt'
import HiddenRune from '../components/HiddenRune'
import { Glitch, Runes } from '../components/Signal'
import { GAMES, type GameType } from '../data/games'

const FILTERS: [GameType | 'all', string][] = [['all', 'All'], ['slots', 'Video Slots'], ['holdwin', 'Hold & Win'], ['crash', 'Crash'], ['table', 'Table']]
// hide format filters that currently have no games
const filters = FILTERS.filter(([f]) => f === 'all' || GAMES.some((g) => g.type === f))

export default function Games() {
  const { hash } = useLocation()
  const [current, setCurrent] = useState<string>('all')
  const [q, setQ] = useState('')

  // /games#slots preselects that filter
  useEffect(() => {
    const f = hash.slice(1)
    if (filters.some(([k]) => k === f)) setCurrent(f)
  }, [hash])

  const query = q.trim().toLowerCase()
  const matches = (g: typeof GAMES[number]) => (current === 'all' || g.type === current) && (!query || g.title.toLowerCase().includes(query))
  const shown = GAMES.filter(matches).length

  return (
    <>
      <section className="page-hero">
        <div className="wrap row">
          <div>
            <span className="idx">S / 002 · Games portfolio</span>
            <h1><Glitch>Every world.</Glitch><br /><span className="r">One signature.</span></h1>
            <Runes text="Every world one signature" className="runes-line" />
          </div>
          <p className="lead">Filter by format, open any title for its maths and specs, and request a demo in one click.</p>
        </div>
        <HiddenRune page="games" style={{ right: '4%', bottom: 22 }} />
      </section>

      <section style={{ paddingTop: 60 }}>
        <div className="wrap">
          <div className="toolbar">
            <div className="filters" role="tablist" aria-label="Filter games">
              {filters.map(([f, label]) => (
                <button key={f} className={`filter${current === f ? ' active' : ''}`} data-filter={f} onClick={() => setCurrent(f)}>{label}</button>
              ))}
            </div>
            <label className="search">
              <span>⌕</span>
              <input id="game-search" type="search" placeholder="Search titles" aria-label="Search games" value={q} onChange={(e) => setQ(e.target.value)} />
              <span className="idx">{String(shown).padStart(2, '0')}</span>
            </label>
          </div>
          <div className="games-grid">
            {GAMES.map((g) => <GameCard key={g.id} game={g} hidden={!matches(g)} />)}
          </div>
          <p className="empty" style={{ display: shown ? 'none' : 'block' }}>No titles match. Try another search.</p>
        </div>
      </section>

      <section style={{ paddingTop: 0 }}>
        <div className="wrap cells c4">
          <div className="cell reveal"><span className="n">01</span><h3>Monthly drops</h3><p>Two to three new releases a month, with early access for partners.</p></div>
          <div className="cell reveal d1"><span className="n">02</span><h3>Tournaments</h3><p>Network and operator-level leaderboards on every title.</p></div>
          <div className="cell reveal d2"><span className="n">03</span><h3>Jackpots</h3><p>Fixed, mystery and progressive jackpots on selected games.</p></div>
          <div className="cell reveal d3"><span className="n">04</span><h3>Free rounds</h3><p>Run campaigns via API or back office, with no dev work needed.</p></div>
        </div>
      </section>

      <CtaBox label="Demo access" title={<>Play them all<br /><span className="r">before you sign.</span></>}
        lead="Partner portal with demo links, marketing kits and certificates for every title." to="/contact" cta="Request access" />
    </>
  )
}
