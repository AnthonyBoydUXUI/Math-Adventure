import { Camera, PenLine } from 'lucide-react'
import { MediaCapture } from './MediaCapture.tsx'
import { DIAGNOSIS_COPY } from '../engine/diagnosis.ts'
import { compositeMastery, emptyStats } from '../engine/mastery.ts'
import { formatAnswer } from '../lib/answers.ts'
import { cn } from '../lib/cn.ts'
import { usePlayerStore } from '../store.ts'
import type { Question } from '../types.ts'
import { HINT_SPARK_COST } from '../engine/scoring.ts'
import { Scoreboard } from './Scoreboard.tsx'
import { VisualMath } from './VisualMath.tsx'
import { VoiceTutor } from './VoiceTutor.tsx'

export function ProblemStage({ question, phaseLabel }: { question: Question; phaseLabel: string }) {
  const session = usePlayerStore((s) => s.session)
  const stats = usePlayerStore((s) => s.stats)
  const parent = usePlayerStore((s) => s.parent)
  const setDraft = usePlayerStore((s) => s.setDraft)
  const submitDraft = usePlayerStore((s) => s.submitDraft)
  const lockIn = usePlayerStore((s) => s.lockIn)
  const nextItem = usePlayerStore((s) => s.nextItem)
  const useHint = usePlayerStore((s) => s.useHint)
  const markPaper = usePlayerStore((s) => s.markPaper)
  const setPhoto = usePlayerStore((s) => s.setPhoto)
  const setConfidence = usePlayerStore((s) => s.setConfidence)
  const acceptPaperGate = usePlayerStore((s) => s.acceptPaperGate)
  const skipPaperGate = usePlayerStore((s) => s.skipPaperGate)
  const mastery = compositeMastery(stats[question.skillId] ?? emptyStats())

  if (session.paperGate) {
    return (
      <div className="paper-card mx-4 rounded-sm border border-white/10 p-6 text-center">
        <PenLine className="mx-auto mb-3 h-10 w-10 text-sky" />
        <p className="font-display text-3xl font-semibold">Paper</p>
        <p className="mt-2 font-medium text-ink">Write it, then come back.</p>
        <div className="mt-5 flex flex-col gap-2">
          <button
            type="button"
            className="press bg-[#0e1a3a] py-3 font-semibold uppercase tracking-[0.12em] text-bone"
            onClick={acceptPaperGate}
          >
            Paper’s out
          </button>
          <button type="button" className="text-sm font-medium text-ink" onClick={skipPaperGate}>
            I’ll try it on-screen (not ideal)
          </button>
        </div>
      </div>
    )
  }

  if (session.awaitingLock) {
    return (
      <div className="panel mx-4 space-y-3 rounded-sm p-5">
        <p className="font-display text-4xl font-semibold">{session.draft}</p>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            className="press bg-[#0e1a3a] py-3 font-semibold uppercase tracking-[0.12em] text-bone"
            onClick={() => lockIn(true)}
          >
            Keep it
          </button>
          <button
            type="button"
            className="press rounded-xl border border-white/15 py-3 font-semibold"
            onClick={() => {
              usePlayerStore.setState((s) => ({
                session: { ...s.session, awaitingLock: false, changed: true },
              }))
            }}
          >
            Change
          </button>
        </div>
      </div>
    )
  }

  if (session.lastResult) {
    const copy = DIAGNOSIS_COPY[session.lastResult.diagnosis]
    return (
      <div className="panel mx-4 space-y-3 rounded-sm p-5">
        <p
          className={cn(
            'inline-block rounded-sm border px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em]',
            session.lastResult.correct ? 'border-leaf/40 bg-leaf/15 text-leaf' : 'border-gold/40 bg-gold/15 text-gold',
          )}
        >
          {session.lastResult.correct ? 'Locked' : 'Not yet'}
        </p>
        <h2 className="font-display text-2xl font-semibold">{copy.title}</h2>
        <p className="font-medium text-ink">{copy.line}</p>
        {!session.lastResult.correct ? (
          <p className="rounded-xl bg-mist px-3 py-2 text-sm font-medium">
            Target look: <span className="font-semibold">{formatAnswer(question.answer)}</span>
            <span className="block text-ink">{question.why}</span>
          </p>
        ) : (
          <p className="text-sm font-medium text-ink">{question.anotherWay}</p>
        )}
        <p className="text-xs font-medium uppercase tracking-widest text-ink">Sure?</p>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              className={cn(
                'h-10 flex-1 rounded-lg border border-white/10 font-semibold',
                session.confidence === n ? 'border-sky/50 bg-sky/15 text-sky' : 'bg-paper',
              )}
              onClick={() => setConfidence(n)}
            >
              {n}
            </button>
          ))}
        </div>
        <button
          type="button"
          className="press w-full bg-[#0e1a3a] py-3 font-semibold uppercase tracking-[0.12em] text-bone"
          onClick={nextItem}
        >
          Next
        </button>
      </div>
    )
  }

  return (
    <div className="mx-4 space-y-3">
      {parent.pressureLab && phaseLabel.toLowerCase().includes('lab') ? (
        <p className="text-center text-[11px] font-semibold uppercase tracking-[0.16em] text-gold">Clock on</p>
      ) : null}
      <div className="panel rounded-sm p-4">
        <p className="font-display text-2xl font-semibold leading-tight">{question.prompt}</p>
        {question.stem ? <p className="mt-2 font-medium text-ink">{question.stem}</p> : null}
        {question.visual ? (
          <div className="mt-3">
            <VisualMath visual={question.visual} />
          </div>
        ) : null}
        {session.hints > 0 ? (
          <div className="mt-3">
            <Scoreboard kind={question.scoreboard} mastery={mastery} compact />
          </div>
        ) : null}
        {question.answer.type === 'choice' ? (
          <div className="mt-4 grid gap-2">
            {question.answer.choices.map((choice, i) => {
              const letter = String.fromCharCode(97 + i)
              return (
                <button
                  key={choice}
                  type="button"
                  className={cn(
                    'press rounded-xl border border-white/10 px-3 py-3 text-left font-semibold',
                    session.draft === letter ? 'border-sky/50 bg-sky/15' : 'bg-paper',
                  )}
                  onClick={() => setDraft(letter)}
                >
                  <span className="mr-2 text-ink">{letter.toUpperCase()}</span>
                  {choice}
                </button>
              )
            })}
          </div>
        ) : (
          <input
            value={session.draft}
            onChange={(e) => setDraft(e.target.value)}
            inputMode="text"
            placeholder="Answer"
            className="mt-4 w-full rounded-xl border border-white/10 bg-chrome px-4 py-3 font-display text-2xl font-semibold outline-none"
          />
        )}
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            className="rounded-sm border border-white/15 px-3 py-1 text-xs font-medium"
            onClick={useHint}
          >
            {session.hints ? `Another look · ${HINT_SPARK_COST} SPK` : 'Hint (free)'}
          </button>
          <button
            type="button"
            className={cn(
              'rounded-sm border border-white/15 px-3 py-1 text-xs font-medium',
              session.paper && 'border-leaf/40 bg-leaf/15 text-leaf',
            )}
            onClick={markPaper}
          >
            I wrote it
          </button>
          <MediaCapture
            capture
            onPhoto={setPhoto}
            className="flex min-h-11 items-center gap-1 rounded-sm border border-white/15 px-3 text-xs font-medium"
            label={
              <>
                <Camera className="h-3.5 w-3.5" />
                Photo
              </>
            }
          />
        </div>
        {session.hints > 0 ? (
          <p className="mt-2 rounded-xl bg-mist px-3 py-2 text-sm font-bold">{question.hints[Math.min(session.hints, question.hints.length) - 1]}</p>
        ) : null}
        {session.photo ? (
          <img src={session.photo} alt="Written work" className="mt-2 max-h-40 rounded-xl border-2 border-navy object-cover" />
        ) : null}
        <button
          type="button"
          className="press mt-4 w-full bg-[#0e1a3a] py-3 font-semibold uppercase tracking-[0.12em] text-bone disabled:opacity-40"
          disabled={!session.draft.trim()}
          onClick={submitDraft}
        >
          Check
        </button>
      </div>
      <VoiceTutor question={question} onAnswer={setDraft} />
    </div>
  )
}
