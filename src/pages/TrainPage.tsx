import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { ProblemStage } from '../components/ProblemStage.tsx'
import { SheetArt, SignalBust } from '../components/SheetArt.tsx'
import { firstTopicId } from '../data/curriculum.ts'
import { questionById } from '../data/questions.ts'
import { compositeMastery, emptyStats } from '../engine/mastery.ts'
import { nextCurriculumStep } from '../engine/progress.ts'
import { buildTestReport } from '../engine/testReady.ts'
import { SIGNAL_SHEETS, worldMap } from '../data/sheets.ts'
import { linkedWorld, worldForModule } from '../data/worlds.ts'
import { usePlayerStore } from '../store.ts'

export function TrainPage() {
  const navigate = useNavigate()
  const { mission, session, resumeOrStart, parent } = usePlayerStore()
  const world = worldForModule(parent.moduleId)

  if (!session.active && !session.completed) {
    return (
      <div className="px-5 py-8 text-center">
        <SignalBust className="mx-auto h-48 max-w-xs" />
        <h1 className="type-pack mt-2 text-5xl">15</h1>
        <p className="mt-2 text-sm font-semibold text-ink">{world.adventure}</p>
        <button
          type="button"
          className="press mt-6 min-h-11 w-full bg-[#0e1a3a] py-4 font-semibold uppercase tracking-[0.12em] text-bone"
          onClick={() => resumeOrStart(false)}
        >
          Start
        </button>
      </div>
    )
  }

  const phase = mission.phases[session.phaseIndex]
  if (!phase || phase.phase === 'recap') {
    return <Recap onLeave={() => navigate('/')} onKeep={() => resumeOrStart(true)} />
  }

  const q = questionById(phase.questionIds[session.itemIndex])
  if (!q) {
    return <Recap onLeave={() => navigate('/')} onKeep={() => resumeOrStart(true)} />
  }

  const totalQ = mission.phases.reduce((n, p) => n + p.questionIds.length, 0)
  const doneQ =
    mission.phases.slice(0, session.phaseIndex).reduce((n, p) => n + p.questionIds.length, 0) + session.itemIndex

  return (
    <div className="pb-6">
      <div className="mx-4 mb-3 overflow-hidden rounded-sm border border-white/10">
        <SheetArt src={worldMap(world.id)} alt={`${world.district} map`} cover className="h-24" />
      </div>
      <div className="mx-4 mb-3 h-1.5 overflow-hidden bg-mist">
        <div className="h-full bg-gold" style={{ width: `${((doneQ + 1) / Math.max(1, totalQ)) * 100}%` }} />
      </div>
      <p className="mx-4 mb-2 text-center text-xs font-semibold uppercase tracking-[0.14em] text-ink">
        {world.name} · {phase.label}
      </p>
      <p className="mx-4 mb-3 text-center text-sm font-semibold">{world.beats[phase.phase]}</p>
      <ProblemStage question={q} phaseLabel={phase.label} />
    </div>
  )
}

function Recap({ onLeave, onKeep }: { onLeave: () => void; onKeep: () => void }) {
  const { attempts, mission, stats, session, parent, driveTo, completeRecap } = usePlayerStore()
  const today = useMemo(
    () => attempts.filter((a) => a.at >= (session.startedAt || 0)),
    [attempts, session.startedAt],
  )
  const correct = today.filter((a) => a.correct).length
  const focus = stats[mission.focusSkillId] ?? emptyStats()
  const world = worldForModule(parent.moduleId)
  const next = linkedWorld(world, 'next')
  const report = buildTestReport(attempts)
  const step = nextCurriculumStep(parent.moduleId, parent.topicId, compositeMastery(focus))
  function finish(choice?: 'advance' | 'deepen') {
    completeRecap(choice)
    onLeave()
  }

  return (
    <div className="px-4 pb-8 text-center">
      <SheetArt src={SIGNAL_SHEETS.hero} alt="Signal and the Harbor RS" className="mx-auto max-w-sm" />
      <h1 className="type-pack text-5xl">Done</h1>
      <p className="mt-1 text-sm font-semibold text-ink">{world.adventure}</p>
      <p className="mt-2 font-display text-4xl font-semibold">
        {correct}
        <span className="text-lg text-ink"> / {today.length}</span>
      </p>
      {session.readinessAtStart != null && report.sampleSize ? (
        <p className="mt-1 text-sm font-semibold">
          {session.readinessAtStart} → {report.readiness}
        </p>
      ) : null}
      {step.reason === 'advance' ? (
        <div className="mt-4 grid grid-cols-2 gap-2">
          <button
            type="button"
            className="press bg-[#0e1a3a] py-3 text-sm font-semibold uppercase tracking-[0.1em] text-bone"
            onClick={() => finish('advance')}
          >
            Advance
          </button>
          <button
            type="button"
            className="press border border-white/15 py-3 text-sm font-semibold uppercase tracking-[0.1em]"
            onClick={() => finish('deepen')}
          >
            Stay
          </button>
        </div>
      ) : null}
      {next?.moduleId ? (
        <button
          type="button"
          className="press mt-3 w-full bg-[#0e1a3a] py-3 font-semibold uppercase tracking-[0.12em] text-bone"
          onClick={() => {
            completeRecap()
            driveTo(next.moduleId!, firstTopicId(next.moduleId!) ?? parent.topicId)
            onLeave()
          }}
        >
          {next.name}
        </button>
      ) : null}
      <button
        type="button"
        className="press mt-3 w-full rounded-sm border border-white/15 py-4 font-semibold"
        onClick={() => finish()}
      >
        Home
      </button>
      <button type="button" className="mt-2 w-full py-3 text-sm font-medium text-ink" onClick={onKeep}>
        Keep going
      </button>
    </div>
  )
}
