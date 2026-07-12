import './Operators.css'

const stats = [
  { value: '96%', label: 'THEORETICAL RTP' },
  { value: '10Kx', label: 'MAX WIN' },
  { value: '<50ms', label: 'EVENT LATENCY' },
]

function Operators() {
  return (
    <section className="operators" id="tech">
      <div className="operators-inner wrap">
        <div>
          <h2 className="operators-title">
            BUILT FOR
            <br />
            OPERATORS.
          </h2>
          <p className="operators-sub">
            Server-authoritative rounds, certified RNG, one WebSocket
            integration. Your players share one round — and one adrenaline
            spike.
          </p>
        </div>
        <div className="operators-stats">
          {stats.map((stat) => (
            <div className="operators-stat" key={stat.label}>
              <div className="operators-stat-value">{stat.value}</div>
              <div className="operators-stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Operators
