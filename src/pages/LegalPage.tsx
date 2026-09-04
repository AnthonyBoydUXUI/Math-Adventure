import { Link } from 'react-router-dom'
import {
  APP_NAME,
  LAST_UPDATED,
  PRIVACY_INTRO,
  PRIVACY_SECTIONS,
  SUPPORT_INTRO,
  SUPPORT_ISSUES_URL,
  SUPPORT_SECTIONS,
  TERMS_INTRO,
  TERMS_SECTIONS,
  type LegalSection,
} from '../content/legal.ts'

export type LegalKind = 'privacy' | 'terms' | 'support'

const COPY: Record<LegalKind, { title: string; intro: string; sections: LegalSection[] }> = {
  privacy: { title: 'Privacy Policy', intro: PRIVACY_INTRO, sections: PRIVACY_SECTIONS },
  terms: { title: 'Terms of Use', intro: TERMS_INTRO, sections: TERMS_SECTIONS },
  support: { title: 'Support', intro: SUPPORT_INTRO, sections: SUPPORT_SECTIONS },
}

export function LegalPage({ kind }: { kind: LegalKind }) {
  const doc = COPY[kind]
  return (
    <article className="px-4 pb-8">
      <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-ink">{APP_NAME}</p>
      <h1 className="mt-1 font-display text-4xl font-semibold tracking-tight">{doc.title}</h1>
      <p className="mt-1 text-xs font-medium text-ink">Updated {LAST_UPDATED}</p>
      <p className="mt-4 text-sm font-medium text-navy">{doc.intro}</p>
      {doc.sections.map((section) => (
        <section key={section.heading} className="mt-6">
          <h2 className="font-display text-xl font-semibold">{section.heading}</h2>
          {section.paragraphs.map((p) => (
            <p key={p.slice(0, 48)} className="mt-2 text-sm font-medium leading-relaxed text-ink">
              {p}
            </p>
          ))}
        </section>
      ))}
      {kind === 'support' ? (
        <a
          className="press mt-6 inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-sky font-semibold text-chrome"
          href={SUPPORT_ISSUES_URL}
          target="_blank"
          rel="noreferrer"
        >
          Open a support issue
        </a>
      ) : null}
      <nav className="mt-6 flex flex-wrap gap-x-4 gap-y-2 text-sm font-semibold text-sky" aria-label="Legal">
        <Link to="/privacy">Privacy</Link>
        <Link to="/terms">Terms</Link>
        <Link to="/support">Support</Link>
        <Link to="/privacy-center">Privacy Center</Link>
        <a href={kind === 'privacy' ? '/privacy.html' : kind === 'terms' ? '/terms.html' : '/support.html'}>
          Browser copy
        </a>
      </nav>
    </article>
  )
}
