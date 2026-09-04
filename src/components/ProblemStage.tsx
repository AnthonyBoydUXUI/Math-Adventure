import { Camera, PenLine } from 'lucide-react'
import { DIAGNOSIS_COPY } from '../engine/diagnosis.ts'
import { compositeMastery, emptyStats } from '../engine/mastery.ts'
import { formatAnswer } from '../lib/answers.ts'
import { cn } from '../lib/cn.ts'
import { usePlayerStore } from '../store.ts'
import type { Question } from '../types.ts'
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
      <div className="paper-card mx-4 rounded-[28px] border-2 border-navy p-6 text-center shadow-[0_8px_0_#141628]">
        <PenLine className="mx-auto mb-3 h-10 w-10" />
        <p className="font-display text-3xl font-extrabold">Grab your paper.</p>
        <p className="mt-2 font-bold text-navy/70">Write this one down first. Tech is the scoreboard, not the work.</p>
        <div className="mt-5 flex flex-col gap-2">
          <button
            type="button"
            className="press rounded-2xl border-2 border-navy bg-orange py-3 font-extrabold text-white"
            onClick={acceptPaperGate}
          >
            Paper’s out
          </button>
          <button type="button" className="text-sm font-extrabold text-navy/50" onClick={skipPaperGate}>
            I’ll try it on-screen (not ideal)
          </button>
        </div>
      </div>
    )
  }

  if (session.awaitingLock) {
    return (
      <div className="mx-4 space-y-3 rounded-[28px] border-2 border-navy bg-white p-5 shadow-[0_8px_0_#141628]">
        <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-navy/45">Lock it in?</p>
        <p className="font-display text-4xl font-extrabold">{session.draft}</p>
        <p className="font-bold text-navy/70">First instinct is often the math you actually know.</p>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            className="press rounded-2xl border-2 border-navy bg-leaf py-3 font-extrabold text-white"
            onClick={() => lockIn(true)}
          >
            Keep it
          </button>
          <button
            type="button"
            className="press rounded-2xl border-2 border-navy bg-mist py-3 font-extrabold"
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
      <div className="mx-4 space-y-3 rounded-[28px] border-2 border-navy bg-white p-5 shadow-[0_8px_0_#141628]">
        <p
          className={cn(
            'inline-block rounded-full border-2 border-navy px-3 py-1 text-xs font-extrabold uppercase',
            session.lastResult.correct ? 'bg-leaf text-white' : 'bg-gold',
          )}
        >
          {session.lastResult.correct ? 'Yes' : 'Not yet'}
        </p>
        <h2 className="font-display text-2xl font-extrabold">{copy.title}</h2>
        <p className="font-bold text-navy/70">{copy.line}</p>
        {!session.lastResult.correct ? (
          <p className="rounded-2xl bg-mist px-3 py-2 text-sm font-bold">
            Target look: <span className="font-extrabold">{formatAnswer(question.answer)}</span>
            <span className="block text-navy/60">{question.why}</span>
          </p>
        ) : (
          <p className="text-sm font-bold text-navy/70">{question.anotherWay}</p>
        )}
        <p className="text-xs font-extrabold uppercase tracking-widest text-navy/40">How sure were you?</p>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              className={cn(
                'h-10 flex-1 rounded-xl border-2 border-navy font-extrabold',
                session.confidence === n ? 'bg-violet text-white' : 'bg-white',
              )}
              onClick={() => setConfidence(n)}
            >
              {n}
            </button>
          ))}
        </div>
        <button
          type="button"
          className="press w-full rounded-2xl border-2 border-navy bg-navy py-3 font-extrabold text-white"
          onClick={nextItem}
        >
          Next
        </button>
      </div>
    )
  }

  return (
    <div className="mx-4 space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-navy/45">{phaseLabel}</p>
        {parent.pressureLab && phaseLabel.toLowerCase().includes('lab') ? (
          <span className="rounded-full bg-goggle px-2 py-0.5 text-[10px] font-extrabold uppercase text-white">
            Lock-in clock
          </span>
        ) : null}
      </div>
      {question.format !== 'word' ? (
        <p className="rounded-2xl bg-violet px-3 py-1 text-center text-xs font-extrabold uppercase tracking-widest text-white">
          Same math, different look · {question.format}
        </p>
      ) : null}
      <div className="rounded-[28px] border-2 border-navy bg-white p-4 shadow-[0_8px_0_#141628]">
        <p className="font-display text-2xl font-extrabold leading-tight">{question.prompt}</p>
        {question.stem ? <p className="mt-2 font-bold text-navy/60">{question.stem}</p> : null}
        {question.visual ? (
          <div className="mt-3">
            <VisualMath visual={question.visual} />
          </div>
        ) : null}
        <div className="mt-3">
          <Scoreboard kind={question.scoreboard} mastery={mastery} compact />
        </div>
        {question.answer.type === 'choice' ? (
          <div className="mt-4 grid gap-2">
            {question.answer.choices.map((choice, i) => {
              const letter = String.fromCharCode(97 + i)
              return (
                <button
                  key={choice}
                  type="button"
                  className={cn(
                    'press rounded-2xl border-2 border-navy px-3 py-3 text-left font-extrabold',
                    session.draft === letter ? 'bg-gold' : 'bg-cream',
                  )}
                  onClick={() => setDraft(letter)}
                >
                  <span className="mr-2 text-navy/40">{letter.toUpperCase()}</span>
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
            className="mt-4 w-full rounded-2xl border-2 border-navy bg-cream px-4 py-3 font-display text-2xl font-extrabold outline-none"
          />
        )}
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            className="rounded-full border-2 border-navy px-3 py-1 text-xs font-extrabold"
            onClick={useHint}
          >
            Hint {session.hints ? `(${session.hints})` : ''}
          </button>
          <button
            type="button"
            className={cn(
              'rounded-full border-2 border-navy px-3 py-1 text-xs font-extrabold',
              session.paper && 'bg-leaf text-white',
            )}
            onClick={markPaper}
          >
            I wrote it
          </button>
          <label className="flex cursor-pointer items-center gap-1 rounded-full border-2 border-navy px-3 py-1 text-xs font-extrabold">
            <Camera className="h-3.5 w-3.5" />
            Photo
            <input
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (!file) return
                const reader = new FileReader()
                reader.onload = () => setPhoto(String(reader.result))
                reader.readAsDataURL(file)
              }}
            />
          </label>
        </div>
        {session.hints > 0 ? (
          <p className="mt-2 rounded-xl bg-mist px-3 py-2 text-sm font-bold">{question.hints[Math.min(session.hints, question.hints.length) - 1]}</p>
        ) : null}
        {session.photo ? (
          <img src={session.photo} alt="Written work" className="mt-2 max-h-40 rounded-xl border-2 border-navy object-cover" />
        ) : null}
        <button
          type="button"
          className="press mt-4 w-full rounded-2xl border-2 border-navy bg-navy py-3 font-extrabold text-white disabled:opacity-40"
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
