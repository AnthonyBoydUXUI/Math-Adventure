import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { Aero } from '../components/Aero.tsx'
import { CircuitTrack, HandoffCard } from '../components/CircuitTrack.tsx'
import { RaceCar } from '../components/RaceCar.tsx'
import { WorldScene } from '../components/WorldScene.tsx'
import { firstTopicId, moduleById, skillById } from '../data/curriculum.ts'
import { questionById } from '../data/questions.ts'
import { classroomChain, linkedWorld, worldForModule } from '../data/worlds.ts'
import { compositeMastery, emptyStats } from '../engine/mastery.ts'
import { cn } from '../lib/cn.ts'
import { resumeAudio } from '../lib/sfx.ts'
import { usePlayerStore } from '../store.ts'
import type { Phase } from '../types.ts'

const PHASE_META: Record<Phase, { color: string; icon: string }> = {
  warmup: { color: 'bg-gold', icon: '☀' },
  builder: { color: 'bg-pink', icon: '♖' },
  lab: { color: 'bg-violet', icon: '⚗' },
  boss: { color: 'bg-orange', icon: '♛' },
  recap: { color: 'bg-leaf', icon: '★' },
}

export function HomePage() {
  const navigate = useNavigate()
  const { mission, parent, stats, cosmetics, startFlight, session, achievements } = usePlayerStore()
  const mod = moduleById(parent.moduleId)
  const focus = skillById(mission.focusSkillId)
  const mastery = compositeMastery(stats[mission.focusSkillId] ?? emptyStats())
  const stars = mastery >= 70 ? 3 : mastery >= 55 ? 2 : 1

  const nodes = mission.phases.filter((p) => p.phase !== 'recap')

  const world = worldForModule(parent.moduleId)
  const prev = linkedWorld(world, 'prev')
  const next = linkedWorld(world, 'next')
  const chain = classroomChain()

  return (
    <div className="px-4 pb-8">
      <section
        className="relative overflow-hidden rounded-[28px] px-5 py-4 text-white shadow-[0_8px_0_#141628]"
        style={{ background: world.color }}
      >
        <WorldScene moduleId={parent.moduleId} />
        <p className="relative text-[11px] font-extrabold uppercase tracking-[0.22em] text-white/80">
          {world.district} · Module {mod?.number}
        </p>
        <h1 className="relative font-display text-3xl font-extrabold leading-tight">{world.name}</h1>
        <p className="relative text-sm font-bold text-white/85">{focus?.name}</p>
        <p className="relative mt-1 text-xs font-bold text-white/75">{world.bridgeLine}</p>
        <div className="relative mt-2 flex gap-1">
          {[1, 2, 3].map((n) => (
            <span key={n} className={cn('text-lg', n <= stars ? 'text-gold' : 'text-white/30')}>
              ★
            </span>
          ))}
        </div>
        <div className="absolute -right-3 -top-2 w-24 opacity-90 aero-bob">
          <Aero goggles={cosmetics.goggles} hoodie={cosmetics.hoodie} kicks={cosmetics.kicks} mood="lockin" />
        </div>
        <div className="absolute bottom-2 left-3 w-12">
          <RaceCar paint={cosmetics.paint} wheels={cosmetics.wheels} wing={cosmetics.wing} />
        </div>
      </section>

      <div className="mt-3">
        <HandoffCard />
      </div>

      <div className="mt-3">
        <CircuitTrack compact />
      </div>

      <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
        {chain.map((w) => (
          <button
            key={w.id}
            type="button"
            className={cn(
              'shrink-0 rounded-full border-2 border-navy px-3 py-1 text-xs font-extrabold',
              w.id === world.id ? 'text-white' : 'bg-white text-navy/60',
            )}
            style={w.id === world.id ? { background: w.color } : undefined}
            onClick={() => {
              const moduleId = w.moduleId ?? parent.moduleId
              usePlayerStore.getState().driveTo(moduleId, firstTopicId(moduleId) ?? parent.topicId)
            }}
          >
            {w.icon} {w.name}
          </button>
        ))}
      </div>
      {prev || next ? (
        <p className="mt-2 text-center text-[11px] font-bold text-navy/50">
          {prev ? `${prev.name} → ` : ''}
          <span className="font-extrabold text-navy">{world.name}</span>
          {next ? ` → ${next.name}` : ''}
        </p>
      ) : null}

      <div className="relative mx-auto mt-2 max-w-xs py-4">
        <div className="absolute left-1/2 top-4 bottom-4 w-1.5 -translate-x-1/2 rounded-full bg-navy/10" />
        {nodes.map((node, i) => {
          const meta = PHASE_META[node.phase]
          const q = questionById(node.questionIds[0])
          const offset = i % 2 === 0 ? 'ml-auto mr-6' : 'mr-auto ml-6'
          const done = session.completed && !session.active
          return (
            <div key={node.phase} className={cn('relative mb-8 flex w-36 flex-col items-center', offset)}>
              {i === 0 ? (
                <div className="mb-3 flex h-14 w-16 items-end justify-center rounded-xl border-2 border-navy bg-amber-800 shadow-[0_4px_0_#141628]">
                  <div className="mb-1 h-8 w-10 rounded-sm bg-amber-500" />
                </div>
              ) : null}
              <motion.button
                type="button"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: i === 1 && !session.active ? 1.1 : 1, opacity: 1 }}
                transition={{ delay: i * 0.08 }}
                className={cn(
                  'path-dot flex h-[74px] w-[74px] items-center justify-center rounded-full border-4 border-navy text-3xl text-white',
                  meta.color,
                  i === 1 && !session.active && 'path-dot-active scale-110',
                  done && 'opacity-80',
                )}
                onClick={() => {
                  resumeAudio()
                  startFlight(false)
                  navigate('/train')
                }}
              >
                {meta.icon}
              </motion.button>
              <p className="mt-2 text-center text-xs font-extrabold uppercase tracking-wide text-navy/55">
                {node.label} · {node.minutes} min
              </p>
              {q ? <p className="text-center text-[11px] font-bold text-navy/45">{q.theme}</p> : null}
            </div>
          )
        })}
        <div className="mx-auto flex w-28 flex-col items-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-dashed border-navy/20 bg-white text-2xl text-navy/25">
            {next?.icon ?? '♛'}
          </div>
          <p className="mt-2 text-[11px] font-extrabold uppercase text-navy/35">{next?.name ?? 'Next peak'}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Link to="/lab" className="rounded-2xl border-2 border-navy bg-violet p-3 text-white press">
          <p className="text-[10px] font-extrabold uppercase tracking-widest text-white/70">Claim</p>
          <p className="font-display text-lg font-extrabold">Test Lab</p>
        </Link>
        <Link to="/help" className="rounded-2xl border-2 border-navy bg-sky p-3 text-white press">
          <p className="text-[10px] font-extrabold uppercase tracking-widest text-white/70">Today</p>
          <p className="font-display text-lg font-extrabold">Help me</p>
        </Link>
      </div>

      <button
        type="button"
        className="press mt-4 w-full rounded-[28px] border-2 border-navy bg-leaf py-4 font-display text-xl font-extrabold text-white"
        onClick={() => {
          resumeAudio()
          startFlight(false)
          navigate('/train')
        }}
      >
        Jump into today’s 15
      </button>
      <p className="mt-2 text-center text-xs font-bold text-navy/45">
        {achievements.length} achievements · mastery is not a calendar
      </p>
    </div>
  )
}
