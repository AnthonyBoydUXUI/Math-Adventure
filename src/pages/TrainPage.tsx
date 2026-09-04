import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { ProblemStage } from '../components/ProblemStage.tsx'
import { Aero } from '../components/Aero.tsx'
import { skillById } from '../data/curriculum.ts'
import { DIAGNOSIS_COPY } from '../engine/diagnosis.ts'
import { compositeMastery, emptyStats } from '../engine/mastery.ts'
import { questionById } from '../data/questions.ts'
import { usePlayerStore } from '../store.ts'
import { DIMENSIONS } from '../types.ts'

export function TrainPage() {
  const navigate = useNavigate()
  const { mission, session, startFlight, completeRecap, cosmetics } = usePlayerStore()

  if (!session.active && !session.completed) {
    return (
      <div className="px-5 py-8 text-center">
        <Aero className="mx-auto h-40" mood="lockin" goggles={cosmetics.goggles} hoodie={cosmetics.hoodie} kicks={cosmetics.kicks} />
        <h1 className="font-display text-4xl font-extrabold">15-minute flight</h1>
        <p className="mt-2 font-bold text-navy/65">{mission.title}</p>
        <p className="mt-1 text-sm font-bold text-navy/50">Warm-up 3 · Builder 4 · Lab 4 · Boss 3 · Recap 1</p>
        <button
          type="button"
          className="press mt-6 w-full rounded-2xl border-2 border-navy bg-pink py-4 font-extrabold text-white"
          onClick={() => startFlight(false)}
        >
          Start today’s mission
        </button>
      </div>
    )
  }

  const phase = mission.phases[session.phaseIndex]
  if (!phase || phase.phase === 'recap') {
    return <Recap onDone={() => { completeRecap(); navigate('/') }} onKeep={() => startFlight(true)} />
  }

  const q = questionById(phase.questionIds[session.itemIndex])
  if (!q) {
    return <Recap onDone={() => { completeRecap(); navigate('/') }} onKeep={() => startFlight(true)} />
  }

  const totalQ = mission.phases.reduce((n, p) => n + p.questionIds.length, 0)
  const doneQ = mission.phases.slice(0, session.phaseIndex).reduce((n, p) => n + p.questionIds.length, 0) + session.itemIndex
  const minutesLeft = mission.phases.slice(session.phaseIndex).reduce((n, p) => n + p.minutes, 0)

  return (
    <div className="pb-6">
      <div className="mx-4 mb-3 flex items-center justify-between rounded-2xl border-2 border-navy bg-white px-3 py-2 text-xs font-extrabold">
        <span>{phase.label}</span>
        <span className="text-navy/45">
          {doneQ + 1}/{totalQ} · ~{minutesLeft} min in this flight
        </span>
      </div>
      <p className="mx-4 mb-3 font-bold text-navy/60">{phase.coachLine}</p>
      <ProblemStage question={q} phaseLabel={`${phase.label} · ${skillById(q.skillId)?.name}`} />
    </div>
  )
}

function Recap({ onDone, onKeep }: { onDone: () => void; onKeep: () => void }) {
  const { attempts, mission, stats, cosmetics, session } = usePlayerStore()
  const today = useMemo(
    () => attempts.filter((a) => a.at >= (session.startedAt || 0)),
    [attempts, session.startedAt],
  )
  const correct = today.filter((a) => a.correct).length
  const diagnoses = today.reduce<Record<string, number>>((acc, a) => {
    acc[a.diagnosis] = (acc[a.diagnosis] ?? 0) + 1
    return acc
  }, {})
  const focus = stats[mission.focusSkillId] ?? emptyStats()

  return (
    <div className="px-4 pb-8">
      <Aero className="mx-auto h-36" mood="cheer" goggles={cosmetics.goggles} hoodie={cosmetics.hoodie} kicks={cosmetics.kicks} />
      <h1 className="text-center font-display text-4xl font-extrabold">Flight complete.</h1>
      <p className="mt-1 text-center font-bold text-navy/60">
        {correct} locked in · {today.length} plays · leave on a win
      </p>
      <div className="mt-4 grid grid-cols-2 gap-2">
        {DIMENSIONS.map((d) => (
          <div key={d} className="rounded-2xl border-2 border-navy bg-white p-3">
            <p className="text-[10px] font-extrabold uppercase tracking-widest text-navy/40">{d}</p>
            <p className="font-display text-2xl font-extrabold">{Math.round(focus[d])}</p>
            <div className="mt-1 h-2 overflow-hidden rounded-full bg-mist">
              <div className="h-full bg-orange" style={{ width: `${focus[d]}%` }} />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 space-y-2">
        {Object.entries(diagnoses).map(([k, n]) => (
          <p key={k} className="rounded-2xl bg-white px-3 py-2 text-sm font-bold">
            <span className="font-extrabold">{DIAGNOSIS_COPY[k as keyof typeof DIAGNOSIS_COPY]?.title}</span>
            <span className="text-navy/50"> · {n}</span>
          </p>
        ))}
      </div>
      <p className="mt-4 text-center text-sm font-bold text-navy/55">
        Tomorrow: {skillById(mission.foundationSkillId)?.name} under the hood, {skillById(mission.nextSkillId)?.name} on the peak.
      </p>
      <p className="mt-1 text-center text-xs font-bold text-navy/40">
        Classroom mastery {Math.round(compositeMastery(focus))} — not a grade-level label.
      </p>
      <button
        type="button"
        className="press mt-5 w-full rounded-2xl border-2 border-navy bg-leaf py-4 font-extrabold text-white"
        onClick={onDone}
      >
        Done for today
      </button>
      <button type="button" className="mt-2 w-full py-3 text-sm font-extrabold text-navy/55" onClick={onKeep}>
        Keep playing (optional)
      </button>
    </div>
  )
}
