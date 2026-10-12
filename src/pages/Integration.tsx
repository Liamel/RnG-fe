import { useRef, useState } from 'react'
import { Link } from 'react-router'
import CtaBox from '../components/CtaBox'
import HiddenRune from '../components/HiddenRune'
import { Glitch, Runes } from '../components/Signal'

// Pre-highlighted snippets (kept as HTML so the whitespace inside <pre> is exact)
const SNIPPETS = {
  launch: `<span class="c">// Open a game session</span>
<span class="k">POST</span> <span class="p">/v1/sessions</span>
{
  <span class="s">"game_id"</span>:   <span class="s">"ragnarok-rising"</span>,
  <span class="s">"player_id"</span>: <span class="s">"pl_8f2c91"</span>,
  <span class="s">"currency"</span>:  <span class="s">"EUR"</span>,
  <span class="s">"language"</span>:  <span class="s">"en"</span>,
  <span class="s">"mode"</span>:      <span class="s">"real"</span>
}

<span class="c">// → 201 Created</span>
{ <span class="s">"launch_url"</span>: <span class="s">"https://play.skaldgaming.com/s/…"</span> }`,
  debit: `<span class="c">// Called by the Skald game server on each bet</span>
<span class="k">POST</span> <span class="p">{operator}/wallet/debit</span>
{
  <span class="s">"transaction_id"</span>: <span class="s">"tx_01HZ…"</span>,
  <span class="s">"round_id"</span>:       <span class="s">"rd_77ab…"</span>,
  <span class="s">"amount"</span>:         <span class="n">1.00</span>,
  <span class="s">"currency"</span>:       <span class="s">"EUR"</span>
}

<span class="c">// ← operator responds</span>
{ <span class="s">"balance"</span>: <span class="n">249.00</span>, <span class="s">"status"</span>: <span class="s">"OK"</span> }`,
}
type Tab = keyof typeof SNIPPETS

function CodeBlock() {
  const [tab, setTab] = useState<Tab>('launch')
  const [copied, setCopied] = useState(false)
  const pre = useRef<HTMLPreElement>(null)
  const copy = () => {
    navigator.clipboard?.writeText(pre.current!.innerText).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    })
  }
  return (
    <div className="code reveal d2">
      <div className="code-tabs">
        <button className={`code-tab${tab === 'launch' ? ' active' : ''}`} onClick={() => setTab('launch')}>POST /sessions</button>
        <button className={`code-tab${tab === 'debit' ? ' active' : ''}`} onClick={() => setTab('debit')}>wallet/debit</button>
        <button className="copy-btn" onClick={copy}>{copied ? 'Copied ✓' : 'Copy'}</button>
      </div>
      <pre ref={pre} dangerouslySetInnerHTML={{ __html: SNIPPETS[tab] }} />
    </div>
  )
}

export default function Integration() {
  return (
    <>
      <section className="page-hero">
        <div className="wrap row">
          <div>
            <span className="idx">S / 004 · Integration</span>
            <h1><Glitch>One API.</Glitch><br /><span className="r">Every world.</span></h1>
            <Runes text="One API every world" className="runes-line" />
          </div>
          <div>
            <p className="lead">Connect once to our remote game server and unlock the full Skald catalogue, from sandbox to live in as little as 14 days.</p>
            <div className="hero-cta" style={{ marginTop: 18 }}>
              <Link className="btn btn-red" to="/contact">Get sandbox keys <span className="ar">↗</span></Link>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="wrap">
          <div className="sec-head"><div><span className="label reveal">Path to launch</span><h2 className="reveal d1">Four steps.<br /><span className="r">Zero drama.</span></h2></div></div>
          <div className="cells c4">
            <div className="cell reveal"><span className="n">01 / Connect</span><h3>Sandbox</h3><p>Get credentials and docs, then implement our seamless-wallet endpoints.</p></div>
            <div className="cell reveal d1"><span className="n">02 / Test</span><h3>Validate</h3><p>Run the automated test suite on staging while our engineers review logs with you.</p></div>
            <div className="cell reveal d2"><span className="n">03 / Certify</span><h3>Comply</h3><p>We supply certificates and game reports for each target jurisdiction.</p></div>
            <div className="cell reveal d3"><span className="n">04 / Launch</span><h3>Go live</h3><p>Switch to production, add games to your lobby, and get a marketing kit and launch support.</p></div>
          </div>
        </div>
      </section>

      <section style={{ paddingTop: 0 }}>
        <div className="wrap split">
          <div className="copy">
            <span className="label reveal">Developer-first</span>
            <h2 className="reveal d1">Clean REST.<br /><span className="r">Signed &amp; fast.</span></h2>
            <p className="lead reveal d2">A compact API with idempotent transactions, HMAC-signed requests and webhooks for every event. Free rounds, jackpots and tournaments run on the same API.</p>
            <Link className="link reveal d3" to="/contact">Request full docs <span className="ar">↗</span></Link>
          </div>
          <CodeBlock />
        </div>
      </section>

      <section id="specs" style={{ paddingTop: 0 }}>
        <div className="wrap split" style={{ alignItems: 'start' }}>
          <div>
            <span className="label reveal">Tech specs</span>
            <h2 className="reveal d1" style={{ marginTop: 18 }}>Built<br /><span className="r">for scale.</span></h2>
          </div>
          <div className="spec-table reveal d1">
            <div><span>Technology</span><b>HTML5 · WebGL · Mobile-first</b></div>
            <div><span>Integration</span><b>Direct API or via aggregator</b></div>
            <div><span>Wallet</span><b>Seamless &amp; transfer</b></div>
            <div><span>Languages</span><b>30+ with RTL support</b></div>
            <div><span>Currencies</span><b>150+ fiat · major crypto</b></div>
            <div><span>Uptime SLA</span><b>99.95%</b></div>
            <div><span>Engagement</span><b>Free rounds · Jackpots · Tournaments</b></div>
            <div><span>Compliance</span><b>Per-market RTP, bet limits &amp; reality checks</b></div>
            <HiddenRune page="integration" style={{ right: 8, bottom: -27 }} />
          </div>
        </div>
      </section>

      <section style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="sec-head"><div><span className="label reveal">Certifications &amp; partners</span></div></div>
          {/* Replace with real licence / test-lab / aggregator logos */}
          <div className="logos reveal">
            <div>Licence</div><div>Test lab</div><div>Aggregator</div><div>Aggregator</div><div>Platform</div><div>Platform</div>
          </div>
        </div>
      </section>

      <CtaBox label="Start building" title={<>Sandbox keys<br /><span className="r">today.</span></>}
        lead="Tell us about your platform and our integration team will set you up within one business day." to="/contact" cta="Request sandbox" />
    </>
  )
}
