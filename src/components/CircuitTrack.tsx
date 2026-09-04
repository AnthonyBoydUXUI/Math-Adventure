import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { firstTopicId } from '../data/curriculum.ts'
import { circuitPits, linkedWorld, worldForModule, type AdventureWorld } from '../data/worlds.ts'
import { cn } from '../lib/cn.ts'
import { resumeAudio } from '../lib/sfx.ts'
import { usePlayerStore } from '../store.ts'
import { RaceCar } from './RaceCar.tsx'

const FULL_W = 330
const COMPACT_W = 330
const COMPACT_H = 168

export function CircuitTrack({ compact }: { compact?: boolean }) {
  const parent = usePlayerStore((s) => s.parent)
  const cosmetics = usePlayerStore((s) => s.cosmetics)
  const stats = usePlayerStore((s) => s.stats)
  const current = worldForModule(parent.moduleId)
  const layout = useMemo(() => layoutPits(compact, current.id), [compact, current.id])
  const here = layout.pits.find((p) => p.world.id === current.id) ?? layout.pits[0]
  const d = pathFor(layout.pits, compact)

  function driveTo(world: AdventureWorld) {
    if (!world.moduleId) return
    resumeAudio()
    const topic = firstTopicId(world.moduleId)
    usePlayerStore.getState().driveTo(world.moduleId, topic ?? parent.topicId)
  }

  return (
    <div className="overflow-hidden rounded-[28px] border-2 border-navy bg-[#2a2d33] shadow-[0_8px_0_#141628]">
      <div className="flex items-center justify-between px-4 py-2">
        <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-white/70">
          {compact ? 'Nearby pits' : 'Subject circuit'}
        </p>
        <p className="text-[11px] font-extrabold text-[#f5d000]">Tap a pit · RS rolls there</p>
      </div>
      <div className="relative">
        <svg
          viewBox={`0 0 ${layout.w} ${layout.h}`}
          className="block w-full"
          style={{ minHeight: compact ? 168 : 520 }}
        >
          <path d={d} fill="none" stroke="#141414" strokeWidth="38" strokeLinecap="round" strokeLinejoin="round" />
          <path d={d} fill="none" stroke="#3f4450" strokeWidth="28" strokeLinecap="round" strokeLinejoin="round" />
          <path d={d} fill="none" stroke="#f5d000" strokeWidth="3" strokeDasharray="10 12" opacity="0.85" />
          {layout.pits.map((pit) => {
            const active = pit.world.id === current.id
            const mastery =
              pit.world.skillIds.reduce((n, id) => n + (stats[id]?.accuracy ?? 50), 0) /
              Math.max(1, pit.world.skillIds.length)
            return (
              <g key={pit.world.id}>
                <circle
                  cx={pit.x}
                  cy={pit.y}
                  r={active ? 28 : 22}
                  fill={pit.world.color}
                  stroke="#f5d000"
                  strokeWidth={active ? 4 : 2}
                />
                <text x={pit.x} y={pit.y + 5} textAnchor="middle" fontSize="16">
                  {pit.world.icon}
                </text>
                <text x={pit.x} y={pit.y + 42} textAnchor="middle" fontSize="9" fontWeight="800" fill="#fff">
                  {pit.world.name}
                </text>
                <text x={pit.x} y={pit.y + 54} textAnchor="middle" fontSize="8" fill="#f5d000">
                  {Math.round(mastery)} tank
                </text>
                <circle
                  cx={pit.x}
                  cy={pit.y}
                  r="34"
                  fill="transparent"
                  className="cursor-pointer"
                  onClick={() => driveTo(pit.world)}
                />
              </g>
            )
          })}
        </svg>
        {here ? (
          <motion.div
            className="pointer-events-none absolute"
            animate={{
              left: `${(here.x / layout.w) * 100}%`,
              top: `${(here.y / layout.h) * 100}%`,
            }}
            transition={{ type: 'spring', stiffness: 80, damping: 18 }}
            style={{ translate: '-50% -72%' }}
          >
            <RaceCar
              className={compact ? 'h-[58px] w-[32px]' : 'h-[72px] w-[40px]'}
              paint={cosmetics.paint}
              wheels={cosmetics.wheels}
              wing={cosmetics.wing}
            />
          </motion.div>
        ) : null}
      </div>
      <p className="px-4 pb-3 text-center text-xs font-bold text-white/70">
        Tank: {current.carry} → {current.handoff}
      </p>
    </div>
  )
}

function layoutPits(compact: boolean | undefined, currentId: string) {
  const all = circuitPits()
  if (!compact) {
    const lastY = all[all.length - 1]?.y ?? 56
    return { pits: all, w: FULL_W, h: Math.max(520, lastY + 90) }
  }
  const idx = Math.max(0, all.findIndex((p) => p.world.id === currentId))
  const start = Math.max(0, Math.min(idx - 1, all.length - 4))
  const slice = all.slice(start, start + 4)
  return {
    pits: slice.map((p, i) => ({ world: p.world, x: 42 + i * 82, y: 78 })),
    w: COMPACT_W,
    h: COMPACT_H,
  }
}

function pathFor(pits: { x: number; y: number }[], compact?: boolean) {
  if (!pits.length) return ''
  if (compact && pits.length >= 2) {
    const first = pits[0]!
    const last = pits[pits.length - 1]!
    const mid = (first.x + last.x) / 2
    return `M ${first.x} ${first.y} Q ${mid} 36 ${last.x} ${last.y}`
  }
  const first = pits[0]!
  let d = `M ${first.x} ${first.y}`
  for (let i = 1; i < pits.length; i += 1) {
    const prev = pits[i - 1]!
    const pit = pits[i]!
    const cx = (prev.x + pit.x) / 2
    d += ` Q ${cx} ${(prev.y + pit.y) / 2} ${pit.x} ${pit.y}`
  }
  return d
}

export function HandoffCard() {
  const parent = usePlayerStore((s) => s.parent)
  const current = worldForModule(parent.moduleId)
  const prev = linkedWorld(current, 'prev')
  const next = linkedWorld(current, 'next')

  return (
    <div className="rounded-[24px] border-2 border-navy bg-white p-4">
      <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-navy/40">How the adventures connect</p>
      <p className="mt-1 font-display text-xl font-extrabold">{current.adventure}</p>
      <div className="mt-3 grid grid-cols-3 gap-2 text-center text-[11px] font-extrabold">
        <div className={cn('rounded-2xl border-2 border-navy p-2', prev ? 'bg-mist' : 'opacity-40')}>
          <p className="text-navy/40">Last pit</p>
          <p>{prev?.name ?? 'Grid'}</p>
        </div>
        <div className="rounded-2xl border-2 border-navy bg-gold p-2">
          <p className="text-navy/50">Now</p>
          <p>{current.name}</p>
        </div>
        <div className={cn('rounded-2xl border-2 border-navy p-2', next ? 'bg-mist' : 'opacity-40')}>
          <p className="text-navy/40">Next pit</p>
          <p>{next?.name ?? 'Peak'}</p>
        </div>
      </div>
      <p className="mt-3 text-sm font-bold text-navy/70">
        In the tank: {current.carry}. {current.handoff}
      </p>
    </div>
  )
}
