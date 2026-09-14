import { useMemo, useState } from 'react'
import { MediaCapture } from '../components/MediaCapture.tsx'
import { RivePlay } from '../components/RivePlay.tsx'
import { SchoolWeekDesk } from '../components/SchoolWeekDesk.tsx'
import { Scoreboard } from '../components/Scoreboard.tsx'
import { VisualMath } from '../components/VisualMath.tsx'
import { questionById } from '../data/questions.ts'
import { buildHomeworkPlan, homeworkFeedback, type TinyStep } from '../engine/homework.ts'
import { usePlayerStore } from '../store.ts'
import { cn } from '../lib/cn.ts'

export function HelpPage() {
  const setParent = usePlayerStore((s) => s.setParent)
  const schoolWeek = usePlayerStore((s) => s.parent.schoolWeek)
  const [raw, setRaw] = useState('')
  const [plan, setPlan] = useState<ReturnType<typeof buildHomeworkPlan>>()
  const [attempt, setAttempt] = useState('')
  const [work, setWork] = useState('')
  const [feedback, setFeedback] = useState<string>()
  const [step, setStep] = useState(0)
  const [mood, setMood] = useState<'idle' | 'talk' | 'correct' | 'miss'>('idle')

  const related = plan ? questionById(plan.relatedIds[0] ?? '') : undefined
  const steps: TinyStep[] = plan?.steps ?? []
  const current = steps[step]
  const onLast = plan ? step >= steps.length - 1 : false

  const pageCount = schoolWeek?.pages.length ?? 0
  const pageHint = useMemo(() => {
    if (!pageCount) return 'Paste a problem, or add class pages above.'
    return `${pageCount} class page${pageCount === 1 ? '' : 's'} on this device. Describe the problem you’re on.`
  }, [pageCount])

  return (
    <div className="px-4 pb-8">
      <h1 className="type-pack text-5xl">Coach</h1>
      <p className="mt-1 text-sm font-semibold text-ink">
        Tiny steps. Your pages. Fifteen minutes a day on what school is asking this week.
      </p>

      <div className="mt-4">
        <RivePlay mood={mood} caption={mood === 'correct' ? 'Nice' : 'Tap when a step clicks'} />
      </div>

      <div className="mt-4">
        <SchoolWeekDesk />
      </div>

      <h2 className="mt-6 font-display text-2xl font-semibold">Walk me through one</h2>
      <p className="mt-1 text-sm font-medium text-ink">{pageHint}</p>
      <textarea
        value={raw}
        onChange={(e) => setRaw(e.target.value)}
        rows={4}
        placeholder="Paste the problem, or tell me what’s on the page…"
        className="mt-3 w-full rounded-sm border border-white/10 bg-paper px-3 py-3 font-semibold outline-none"
      />
      <MediaCapture
        capture
        className="press mt-2 inline-flex min-h-11 items-center rounded-sm border border-white/10 bg-paper px-3 text-sm font-semibold"
        label="Photo this problem"
        onPhoto={(url) => {
          setParent({ pagePhoto: url, pageNote: raw })
        }}
      />
      <button
        type="button"
        className="press mt-4 w-full bg-[#0e1a3a] py-3 font-semibold uppercase tracking-[0.12em] text-bone"
        onClick={() => {
          const next = buildHomeworkPlan(raw || schoolWeek?.note || 'multi-step word problem from a photo')
          setPlan(next)
          setStep(0)
          setFeedback(undefined)
          setAttempt('')
          setWork('')
          setMood('talk')
          setParent({ pageNote: raw || schoolWeek?.note })
        }}
      >
        Start tiny steps
      </button>

      {plan && current ? (
        <div className="mt-5 space-y-3 panel rounded-sm p-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-sky">
            {plan.concept} · step {step + 1} of {steps.length}
          </p>
          <h2 className="font-display text-3xl font-semibold">{current.title}</h2>
          <p className="text-lg font-semibold">{current.say}</p>
          <p className="rounded-sm bg-mist p-3 font-medium">{current.do}</p>
          {current.example ? (
            <p className="font-display text-xl font-semibold text-gold">{current.example}</p>
          ) : null}
          <Scoreboard kind={plan.scoreboard} mastery={40} />
          <label className="block text-xs font-semibold uppercase tracking-widest text-ink">Show your work</label>
          <textarea
            value={work}
            onChange={(e) => setWork(e.target.value)}
            rows={3}
            placeholder="Write the tiny version, then your numbers…"
            className="w-full rounded-sm border border-white/10 bg-paper px-3 py-3 font-semibold outline-none"
          />
          {!onLast ? (
            <button
              type="button"
              className="press w-full bg-[#0e1a3a] py-3 font-semibold uppercase tracking-[0.12em] text-bone"
              onClick={() => {
                setStep((s) => s + 1)
                setMood('talk')
              }}
            >
              Next tiny step
            </button>
          ) : (
            <>
              <input
                value={attempt}
                onChange={(e) => setAttempt(e.target.value)}
                placeholder="Your answer after the work"
                className="w-full rounded-sm border border-white/10 bg-paper px-3 py-3 font-semibold"
              />
              <button
                type="button"
                className="press w-full rounded-xl bg-leaf py-3 font-semibold text-chrome"
                onClick={() => {
                  const fb = homeworkFeedback(plan, attempt)
                  setFeedback(fb.line)
                  setMood(fb.verdict === 'correct' ? 'correct' : fb.verdict === 'retry' ? 'miss' : 'talk')
                }}
              >
                Check my work
              </button>
            </>
          )}
          {feedback ? <p className="rounded-sm bg-mist p-3 font-bold">{feedback}</p> : null}
          <ol className="space-y-1 text-sm font-medium text-ink">
            {steps.map((s, i) => (
              <li key={s.title} className={cn(i === step ? 'font-semibold text-navy' : 'text-ink')}>
                {i + 1}. {s.title}
              </li>
            ))}
          </ol>
          {related?.visual ? <VisualMath visual={related.visual} /> : null}
        </div>
      ) : null}
    </div>
  )
}
