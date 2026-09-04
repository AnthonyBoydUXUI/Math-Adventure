import { motion } from 'framer-motion'
import { Play } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { CircuitTrack, HandoffCard } from '../components/CircuitTrack.tsx'
import { DayClock } from '../components/DayClock.tsx'
import { TestReadinessCard } from '../components/TestReadinessCard.tsx'
import { WeekStrip } from '../components/WeekStrip.tsx'
import { RaceCar } from '../components/RaceCar.tsx'
import { WorldScene } from '../components/WorldScene.tsx'
import { firstTopicId, moduleById, skillById } from '../data/curriculum.ts'
import { classroomChain, linkedWorld, worldForModule } from '../data/worlds.ts'
import { compositeMastery, emptyStats } from '../engine/mastery.ts'
import { cn } from '../lib/cn.ts'
import { dayKey } from '../lib/clock.ts'
import { resumeAudio } from '../lib/sfx.ts'
import { usePlayerStore } from '../store.ts'
import type { Phase } from '../types.ts'

const PHASE_META: Record<Phase, { tone: string }> = {
  warmup: { tone: 'Ignition' },
  builder: { tone: 'Build' },
  lab: { tone: 'Transfer' },
  boss: { tone: 'Boss' },
  recap: { tone: 'Debrief' },
}

export function HomePage() {
  const navigate = useNavigate()
  const { mission, parent, stats, cosmetics, resumeOrStart, achievements, session, bookmark, practiceDays } =
    usePlayerStore()
  const mod = moduleById(parent.moduleId)
  const focus = skillById(mission.focusSkillId)
  const mastery = compositeMastery(stats[mission.focusSkillId] ?? emptyStats())
  const nodes = mission.phases.filter((p) => p.phase !== 'recap')
  const world = worldForModule(parent.moduleId)
  const next = linkedWorld(world, 'next')
  const chain = classroomChain()

  function startSession() {
    resumeAudio()
    resumeOrStart(false)
    navigate('/train')
  }

  const cta = session.active
    ? 'Continue where you left off'
    : session.completed
      ? 'Open today’s next step'
      : 'Start today’s 15'

  return (
    <div className="px-4 pb-8">
      <section className="relative min-h-[240px] overflow-hidden rounded-2xl text-white">
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(180deg, ${world.color} 0%, ${world.color}99 38%, #080a0e 100%)`,
          }}
        />
        <WorldScene moduleId={parent.moduleId} />
        <div className="cover-shine pointer-events-none absolute inset-0" />
        <div className="relative flex min-h-[240px] flex-col justify-end px-5 pb-5 pt-8">
          <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-white/70">
            Now playing · Module {mod?.number} · {new Date().getFullYear()}
          </p>
          <h1 className="mt-1 font-display text-[32px] font-semibold leading-none tracking-tight">{world.name}</h1>
          <p className="mt-2 max-w-[16rem] text-sm font-medium text-white/80">{focus?.name}</p>
          <div className="mt-3 h-1 w-36 overflow-hidden rounded-full bg-black/30">
            <div className="h-full bg-sky" style={{ width: `${mastery}%` }} />
          </div>
          <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.16em] text-white/55">
            Mastery {Math.round(mastery)}
          </p>
          <button
            type="button"
            className="press mt-4 inline-flex w-fit items-center gap-2 rounded-full bg-sky px-5 py-2.5 text-sm font-semibold text-chrome"
            onClick={startSession}
          >
            <Play className="h-4 w-4 fill-chrome" />
            {cta}
          </button>
        </div>
        <div className="absolute right-3 top-6 w-14 opacity-90">
          <RaceCar paint={cosmetics.paint} wheels={cosmetics.wheels} wing={cosmetics.wing} />
        </div>
      </section>

      <div className="mt-5 md:grid md:grid-cols-2 md:gap-4">
        <WeekStrip practiced={practiceDays} inProgressKey={session.active ? dayKey() : undefined} />
        <div className="panel mt-4 rounded-2xl p-4 md:mt-0">
        <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-ink">Where you left off</p>
        <p className="mt-1 font-display text-xl font-semibold">{bookmark.label}</p>
        {bookmark.nextLabel ? <p className="mt-1 text-sm font-medium text-ink">Forward: {bookmark.nextLabel}</p> : null}
        <p className="mt-2">
          <DayClock />
        </p>
        </div>
      </div>

      <p className="mt-5 text-[11px] font-medium uppercase tracking-[0.22em] text-ink">Library</p>
      <div className="mt-2 flex gap-2 overflow-x-auto pb-2">
        {chain.map((w) => (
          <button
            key={w.id}
            type="button"
            className={cn(
              'relative h-[132px] w-[108px] shrink-0 overflow-hidden rounded-xl text-left',
              w.id === world.id && 'ring-1 ring-sky',
            )}
            style={{ background: w.color }}
            onClick={() => {
              const moduleId = w.moduleId ?? parent.moduleId
              usePlayerStore.getState().driveTo(moduleId, firstTopicId(moduleId) ?? parent.topicId)
            }}
          >
            <div className="cover-shine absolute inset-0" />
            <div className="absolute inset-x-0 bottom-0 bg-black/55 px-2 py-2">
              <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-white/55">{w.district}</p>
              <p className="text-sm font-semibold leading-tight text-white">{w.name}</p>
            </div>
          </button>
        ))}
      </div>

      <div className="mt-4">
        <HandoffCard />
      </div>

      <p className="mt-5 text-[11px] font-medium uppercase tracking-[0.22em] text-ink">Today’s 15</p>
      <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
        {nodes.map((node, i) => (
          <motion.button
            key={node.phase}
            type="button"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className={cn(
              'panel relative h-[118px] w-[132px] shrink-0 rounded-xl p-3 text-left',
              session.active && session.phaseIndex === i && 'ring-1 ring-sky',
              session.active && session.phaseIndex > i && 'opacity-60',
            )}
            onClick={startSession}
          >
            <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-sky">
              {String(i + 1).padStart(2, '0')} · {node.minutes} min
            </p>
            <p className="mt-2 font-display text-lg font-semibold">{PHASE_META[node.phase].tone}</p>
            <p className="mt-1 text-xs font-medium text-ink">{node.label}</p>
          </motion.button>
        ))}
        <div className="flex h-[118px] w-[120px] shrink-0 flex-col justify-end rounded-xl border border-dashed border-white/15 p-3">
          <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-ink">Queued</p>
          <p className="mt-1 font-display text-lg font-semibold">{next?.name ?? 'Sky Peak'}</p>
        </div>
      </div>

      <div className="mt-4">
        <CircuitTrack compact />
      </div>

      <div className="mt-4">
        <TestReadinessCard compact />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <Link to="/lab" className="panel press rounded-xl p-4">
          <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-ink">Formats</p>
          <p className="mt-1 font-display text-lg font-semibold">Test Lab</p>
        </Link>
        <Link to="/help" className="panel press rounded-xl p-4">
          <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-ink">Homework</p>
          <p className="mt-1 font-display text-lg font-semibold">Assist</p>
        </Link>
      </div>

      <button
        type="button"
        className="press mt-4 w-full rounded-xl bg-sky py-3.5 font-display text-lg font-semibold text-chrome"
        onClick={startSession}
      >
        {cta}
      </button>
      <p className="mt-2 text-center text-xs font-medium text-ink">
        {achievements.length} trophies · 7th–8th grade track
      </p>
    </div>
  )
}
