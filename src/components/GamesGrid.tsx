import './GamesGrid.css'

type Game = {
  title: string
  blurb: string
  status: 'live' | 'soon'
  statusLabel: string
  art: 'red' | 'dark'
  artLabel: string
}

const games: Game[] = [
  {
    title: 'ARKNOID',
    blurb: 'Multiplayer crash · RTP 96% · Max win 10,000x',
    status: 'live',
    statusLabel: 'LIVE',
    art: 'red',
    artLabel: '[ arknoid key art ]',
  },
  {
    title: '???????',
    blurb: 'In development · Q1 2027',
    status: 'soon',
    statusLabel: 'SOON',
    art: 'dark',
    artLabel: '[ next title key art ]',
  },
  {
    title: '???????',
    blurb: 'In development · 2027',
    status: 'soon',
    statusLabel: 'SOON',
    art: 'dark',
    artLabel: '[ next title key art ]',
  },
]

function GamesGrid() {
  return (
    <section className="games" id="games">
      <div className="wrap">
        <div className="games-head">
          <h2 className="games-title">OUR GAMES</h2>
          <a className="games-all" href="#games">
            ALL TITLES →
          </a>
        </div>
        <div className="games-grid">
          {games.map((game, i) => (
            <article className={`game-card bevel${game.status === 'soon' ? ' game-card-soon' : ''}`} key={i}>
              <div className={`game-art ${game.art === 'red' ? 'stripes-red' : 'stripes-dark'}`}>
                {game.artLabel}
              </div>
              <div className="game-body">
                <div className="game-row">
                  <h3 className="game-name">{game.title}</h3>
                  <span className={`game-badge game-badge-${game.status}`}>
                    {game.statusLabel}
                  </span>
                </div>
                <p className="game-blurb">{game.blurb}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default GamesGrid
