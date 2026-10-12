import { useState, type FormEvent } from 'react'
import { useSearchParams } from 'react-router'
import CtaBox from '../components/CtaBox'
import HiddenRune from '../components/HiddenRune'
import { Glitch, Runes } from '../components/Signal'
import { findGame } from '../data/games'
import { unlock } from '../lib/quest'

const REQUIRED = ['name', 'email', 'topic', 'message'] as const

export default function Contact() {
  const [params] = useSearchParams()
  const [errors, setErrors] = useState<Record<string, boolean>>({})
  const [sent, setSent] = useState(false)

  // /contact?game=<id> pre-fills a demo request; ?code=RUNEMASTER adds the Skald Quest reward code
  const g = findGame(params.get('game'))
  let message = g ? `Hi Skald team, we'd like a demo of ${g.title}.` : ''
  if (params.get('code') === 'RUNEMASTER') message = (message ? message + '\n\n' : '') + 'Rune code: RUNEMASTER (priority demo access)'

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const next: Record<string, boolean> = {}
    for (const name of REQUIRED) {
      const input = form.elements.namedItem(name) as HTMLInputElement
      next[name] = input.type === 'email' ? !/^\S+@\S+\.\S+$/.test(input.value) : input.value.trim() === ''
    }
    setErrors(next)
    if (Object.values(next).some(Boolean)) return
    // TODO: connect to your backend / CRM endpoint here
    setSent(true)
    unlock('raven')
  }
  const field = (name: string, full = false) => `field${full ? ' full' : ''}${errors[name] ? ' error' : ''}`

  return (
    <>
      <section className="page-hero">
        <div className="wrap row">
          <div>
            <span className="idx">S / 005 · Contact</span>
            <h1><Glitch>{"Let's build"}</Glitch><br /><span className="r">what's next.</span></h1>
            <Runes text="Lets build whats next" className="runes-line" />
          </div>
          <p className="lead">Demos, partnerships, integration or careers: tell us what you need and we'll reply within one business day.</p>
        </div>
      </section>

      <section style={{ paddingTop: 60 }}>
        <div className="wrap contact-grid">
          <div className="form-wrap">
            <form id="contact-form" className="form" noValidate onSubmit={submit} style={sent ? { display: 'none' } : undefined} key={params.toString()}>
              <div className={field('name')}><label htmlFor="name">Name</label><input id="name" name="name" required autoComplete="name" /><span className="err">Required</span></div>
              <div className="field"><label htmlFor="company">Company</label><input id="company" name="company" autoComplete="organization" /></div>
              <div className={field('email')}><label htmlFor="email">Work email</label><input id="email" name="email" type="email" required autoComplete="email" /><span className="err">Enter a valid email</span></div>
              <div className={field('topic')}><label htmlFor="topic">Topic</label>
                <select id="topic" name="topic" required defaultValue={g ? 'demo' : ''}>
                  <option value="">Choose…</option>
                  <option value="demo">Game demo</option>
                  <option value="partnership">Commercial partnership</option>
                  <option value="integration">Technical integration</option>
                  <option value="careers">Careers</option>
                  <option value="press">Press &amp; media</option>
                </select><span className="err">Pick a topic</span></div>
              <div className={field('message', true)}><label htmlFor="message">Message</label><textarea id="message" name="message" required placeholder="Markets, platform, timeline…" defaultValue={message} /><span className="err">Required</span></div>
              <div className="field full"><button className="btn btn-red" type="submit" style={{ justifySelf: 'start' }}>Send message <span className="ar">↗</span></button></div>
            </form>
            <div className="form-success" style={sent ? { display: 'block' } : undefined}>
              <span className="label">Message received</span>
              <h3>Signal <span className="dot">received.</span></h3>
              <p>Thanks! We'll be in touch within one business day.</p>
            </div>
          </div>

          <div className="side">
            <div className="side-item"><span className="label">Partnerships</span><a href="mailto:partners@skaldgaming.com">partners@skaldgaming.com</a></div>
            <div className="side-item"><span className="label">Integration support</span><a href="mailto:support@skaldgaming.com">support@skaldgaming.com</a></div>
            <div className="side-item"><span className="label">Careers</span><a href="mailto:jobs@skaldgaming.com">jobs@skaldgaming.com</a></div>
            {/* Placeholder address */}
            <div className="side-item"><span className="label">Headquarters</span><p>Your street address<br />City, Country</p></div>
            <div className="side-item"><span className="label">Events</span><p>Meet us at the major iGaming expos.</p></div>
            <HiddenRune page="contact" style={{ right: 16, bottom: 14 }} />
          </div>
        </div>
      </section>

      <CtaBox label="Browse first" title={<>See the<br /><span className="r">portfolio.</span></>} to="/games" cta="View games" />
    </>
  )
}
