import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { DayClock } from '../components/DayClock.tsx'
import { ProblemStage } from '../components/ProblemStage.tsx'
import { TestReadinessCard } from '../components/TestReadinessCard.tsx'
import { RaceCar } from '../components/RaceCar.tsx'
import { firstTopicId, skillById } from '../data/curriculum.ts'
import { DIAGNOSIS_COPY } from '../engine/diagnosis.ts'
import { compositeMastery, emptyStats } from '../engine/mastery.ts'
import { questionById } from '../data/questions.ts'
import { linkedWorld, worldForModule } from '../data/worlds.ts'
import { usePlayerStore } from '../store.ts'
import { DIMENSIONS } from '../types.ts'

export function TrainPage() {
  const navigate = useNavigate()
  const { mission, session, resumeOrStart, completeRecap, bookmark } = usePlayerStore()

  if (!session.active && !session.completed) {
    return (
      <div className="px-5 py-8">
        <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-ink">Session</p>
        <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight">15-minute run</h1>
        <p className="mt-2 font-medium text-ink">{mission.title}</p>
        <p className="mt-1 text-sm font-medium text-ink">Ignition 3 · Build 4 · Lab 4 · Boss 3 · Debrief 1</p>
        <p className="mt-3 text-sm font-medium text-navy">{bookmark.label}</p>
        <p className="mt-2">
          <DayClock />
        </p>
        <button
          type="button"
          className="press mt-6 min-h-11 w-full rounded-xl bg-sky py-4 font-semibold text-chrome"
          onClick={() => resumeOrStart(false)}
        >
          Start today’s 15
        </button>
      </div>
    )
  }

  const phase = mission.phases[session.phaseIndex]
  if (!phase || phase.phase === 'recap') {
    return <Recap onDone={() => { completeRecap(); navigate('/') }} onKeep={() => resumeOrStart(true)} />
  }

  const q = questionById(phase.questionIds[session.itemIndex])
  if (!q) {
    return <Recap onDone={() => { completeRecap(); navigate('/') }} onKeep={() => resumeOrStart(true)} />
  }

  const totalQ = mission.phases.reduce((n, p) => n + p.questionIds.length, 0)
  const doneQ = mission.phases.slice(0, session.phaseIndex).reduce((n, p) => n + p.questionIds.length, 0) + session.itemIndex
  const minutesLeft = mission.phases.slice(session.phaseIndex).reduce((n, p) => n + p.minutes, 0)

  return (
    <div className="pb-6">
      <div className="mx-4 mb-3 flex items-center justify-between rounded-xl border border-white/10 bg-paper px-3 py-2 text-xs font-semibold">
        <span>{phase.label}</span>
        <span className="text-ink">
          {doneQ + 1}/{totalQ} · ~{minutesLeft} min remaining
        </span>
      </div>
      <div className="mx-4 mb-3">
        <DayClock compact />
      </div>
      <p className="mx-4 mb-3 font-medium text-ink">{phase.coachLine}</p>
      <ProblemStage question={q} phaseLabel={`${phase.label} · ${skillById(q.skillId)?.name}`} />
    </div>
  )
}

function Recap({ onDone, onKeep }: { onDone: () => void; onKeep: () => void }) {
  const { attempts, mission, stats, cosmetics, session, parent, driveTo } = usePlayerStore()
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
  const world = worldForModule(parent.moduleId)
  const next = linkedWorld(world, 'next')

  return (
    <div className="px-4 pb-8">
      <p className="text-center text-[11px] font-medium uppercase tracking-[0.22em] text-ink">Debrief</p>
      <h1 className="text-center font-display text-4xl font-semibold tracking-tight">Session complete</h1>
      <p className="mt-2 text-center">
        <DayClock compact />
      </p>
      <p className="mt-1 text-center font-medium text-ink">
        {correct} locked in · {today.length} plays
      </p>
      <div className="mt-4 grid grid-cols-2 gap-2">
        {DIMENSIONS.map((d) => (
          <div key={d} className="panel rounded-xl p-3">
            <p className="text-[10px] font-medium uppercase tracking-widest text-ink">{d}</p>
            <p className="font-display text-2xl font-semibold">{Math.round(focus[d])}</p>
            <div className="mt-1 h-1 overflow-hidden rounded-full bg-mist">
              <div className="h-full bg-sky" style={{ width: `${focus[d]}%` }} />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 space-y-2">
        {Object.entries(diagnoses).map(([k, n]) => (
          <p key={k} className="rounded-xl bg-paper px-3 py-2 text-sm font-medium">
            <span className="font-semibold">{DIAGNOSIS_COPY[k as keyof typeof DIAGNOSIS_COPY]?.title}</span>
            <span className="text-ink"> · {n}</span>
          </p>
        ))}
      </div>
      <p className="mt-4 text-center text-sm font-medium text-ink">
        Next: {skillById(mission.foundationSkillId)?.name} under the hood, {skillById(mission.nextSkillId)?.name} on the peak.
      </p>
      <p className="mt-1 text-center text-xs font-medium text-ink">
        Classroom mastery {Math.round(compositeMastery(focus))}
      </p>
      <div className="mt-4">
        <TestReadinessCard />
      </div>
      {next ? (
        <div className="panel mt-4 rounded-2xl p-4">
          <div className="flex items-center gap-3">
            <RaceCar className="h-16 w-9" paint={cosmetics.paint} wheels={cosmetics.wheels} wing={cosmetics.wing} />
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-ink">Next sector</p>
              <p className="font-display text-xl font-semibold">{next.name}</p>
              <p className="text-sm font-medium text-ink">{world.handoff}</p>
            </div>
          </div>
          {next.moduleId ? (
            <button
              type="button"
              className="press mt-3 w-full rounded-xl bg-sky py-3 font-semibold text-chrome"
              onClick={() => {
                driveTo(next.moduleId!, firstTopicId(next.moduleId!) ?? parent.topicId)
                onDone()
              }}
            >
              Drive to {next.name}
            </button>
          ) : (
            <p className="mt-3 text-center text-sm font-medium text-gold">{next.adventure}</p>
          )}
        </div>
      ) : null}
      <button
        type="button"
        className="press mt-5 w-full rounded-xl border border-white/15 py-4 font-semibold"
        onClick={onDone}
      >
        End session
      </button>
      <button type="button" className="mt-2 w-full py-3 text-sm font-medium text-ink" onClick={onKeep}>
        Continue (optional)
      </button>
    </div>
  )
}
