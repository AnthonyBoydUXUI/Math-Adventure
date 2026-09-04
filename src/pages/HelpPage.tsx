import { useState } from 'react'
import { MediaCapture } from '../components/MediaCapture.tsx'
import { Scoreboard } from '../components/Scoreboard.tsx'
import { questionById } from '../data/questions.ts'
import { buildHomeworkPlan, homeworkFeedback } from '../engine/homework.ts'
import { usePlayerStore } from '../store.ts'
import { VisualMath } from '../components/VisualMath.tsx'

export function HelpPage() {
  const setParent = usePlayerStore((s) => s.setParent)
  const [raw, setRaw] = useState('')
  const [photo, setPhoto] = useState<string>()
  const [plan, setPlan] = useState<ReturnType<typeof buildHomeworkPlan>>()
  const [attempt, setAttempt] = useState('')
  const [feedback, setFeedback] = useState<string>()
  const [step, setStep] = useState(0)

  const related = plan ? questionById(plan.relatedIds[0] ?? '') : undefined

  return (
    <div className="px-4 pb-8">
      <h1 className="font-display text-4xl font-semibold tracking-tight">Assist</h1>
      <p className="mt-1 font-bold text-navy/65">
        Type, paste, or photograph a worksheet. We name the concept and coach — we don’t dump the answer.
      </p>
      <textarea
        value={raw}
        onChange={(e) => setRaw(e.target.value)}
        rows={4}
        placeholder="Paste the problem, or describe this week’s class page…"
        className="mt-4 w-full rounded-2xl border border-white/10 bg-white px-3 py-3 font-bold outline-none"
      />
      <MediaCapture
        capture
        className="press mt-2 inline-flex min-h-11 items-center rounded-2xl border border-white/10 bg-white px-3 text-sm font-extrabold"
        label="Photograph the page"
        onPhoto={(url) => {
          setPhoto(url)
          setParent({ pagePhoto: url, pageNote: raw })
        }}
      />
      {photo ? <img src={photo} alt="Uploaded work" className="mt-3 max-h-48 rounded-2xl border border-white/10 object-cover" /> : null}
      <button
        type="button"
        className="press mt-4 w-full rounded-xl bg-sky py-3 font-semibold text-chrome"
        onClick={() => {
          const next = buildHomeworkPlan(raw || 'multi-step word problem from a photo')
          setPlan(next)
          setStep(0)
          setFeedback(undefined)
          setAttempt('')
          setParent({ pageNote: raw })
        }}
      >
        Coach me
      </button>

      {plan ? (
        <div className="mt-5 space-y-3 panel rounded-2xl p-4">
          <p className="text-xs font-extrabold uppercase tracking-widest text-sky">Identified</p>
          <h2 className="font-display text-2xl font-extrabold">{plan.concept}</h2>
          <Scoreboard kind={plan.scoreboard} mastery={40} />
          <ol className="space-y-2">
            {[plan.asking, plan.known[0], plan.move, 'Your attempt', 'CHECK'].map((label, i) => (
              <li key={label} className={i === step ? 'rounded-2xl bg-gold/40 p-3 font-extrabold' : 'p-3 font-bold text-navy/55'}>
                {i + 1}. {label}
              </li>
            ))}
          </ol>
          {step < 3 ? (
            <button
              type="button"
              className="press w-full rounded-xl bg-sky py-3 font-semibold text-chrome"
              onClick={() => setStep((s) => s + 1)}
            >
              Next prompt
            </button>
          ) : (
            <>
              <input
                value={attempt}
                onChange={(e) => setAttempt(e.target.value)}
                placeholder="Enter your attempt (not a guess-only)"
                className="w-full rounded-2xl border border-white/10 bg-cream px-3 py-3 font-extrabold"
              />
              <button
                type="button"
                className="press w-full rounded-xl bg-leaf py-3 font-semibold text-chrome"
                onClick={() => {
                  const fb = homeworkFeedback(plan, attempt)
                  setFeedback(fb.line)
                  setStep(4)
                }}
              >
                Check my work
              </button>
            </>
          )}
          {feedback ? <p className="rounded-2xl bg-mist p-3 font-bold">{feedback}</p> : null}
          {step >= 2 ? <p className="text-sm font-bold text-navy/55">Hint if needed: {plan.hints[0]}</p> : null}
          {related?.visual ? <VisualMath visual={related.visual} /> : null}
        </div>
      ) : null}
    </div>
  )
}
