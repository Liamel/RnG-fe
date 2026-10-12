import type { ReactNode } from 'react'
import { Link } from 'react-router'

/** The glass call-to-action box that closes every page. */
export default function CtaBox({ label, title, lead, to, cta }: { label: string; title: ReactNode; lead?: string; to: string; cta: string }) {
  return (
    <section className="final">
      <div className="wrap">
        <div className="cta-box reveal">
          <div className="orbit" />
          <div>
            <span className="label">{label}</span>
            <h2>{title}</h2>
            {lead && <p className="lead">{lead}</p>}
          </div>
          <Link className="btn btn-red" to={to}>{cta} <span className="ar">↗</span></Link>
        </div>
      </div>
    </section>
  )
}
