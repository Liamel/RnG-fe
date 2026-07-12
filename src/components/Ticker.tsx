import './Ticker.css'

// bust threshold: rounds that crashed near 1.00x render red
const rounds = [
  '2.41x',
  '1.03x',
  '6.80x',
  '1.55x',
  '1.13x',
  '12.4x',
  '3.02x',
  '1.00x',
  '1.97x',
  '48.5x',
  '1.22x',
  '2.10x',
]

const isBust = (value: string) => parseFloat(value) < 1.3

function Ticker() {
  return (
    <div className="ticker" aria-label="Last rounds multipliers">
      <span className="ticker-label">LAST ROUNDS</span>
      <div className="ticker-viewport">
        <div className="ticker-track">
          {[0, 1].map((copy) => (
            <span className="ticker-group" key={copy} aria-hidden={copy === 1}>
              {rounds.map((value, i) => (
                <span
                  key={i}
                  className={isBust(value) ? 'ticker-bust' : 'ticker-win'}
                >
                  {value}
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Ticker
