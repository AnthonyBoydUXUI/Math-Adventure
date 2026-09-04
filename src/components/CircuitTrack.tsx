import { useMemo } from 'react'
import { firstTopicId } from '../data/curriculum.ts'
import { circuitPits, linkedWorld, worldForModule, type AdventureWorld } from '../data/worlds.ts'
import { compositeMastery, emptyStats } from '../engine/mastery.ts'
import { nightHex, sectorCode } from '../engine/render/palette.ts'
import { cn } from '../lib/cn.ts'
import { resumeAudio } from '../lib/sfx.ts'
import { usePlayerStore } from '../store.ts'

const FULL_W = 330
const COMPACT_W = 330
const COMPACT_H = 168

export function CircuitTrack({ compact }: { compact?: boolean }) {
  const parent = usePlayerStore((s) => s.parent)
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
    <div className="panel overflow-hidden rounded-sm bg-[#05070b]">
      <div className="flex items-center justify-between px-4 py-2">
        <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-ink">
          {compact ? 'Near' : 'Map'}
        </p>
      </div>
      <div className="relative">
        <svg
          viewBox={`0 0 ${layout.w} ${layout.h}`}
          className="block w-full"
          style={{ minHeight: compact ? 168 : 520 }}
        >
          <path d={d} fill="none" stroke="#10141c" strokeWidth="36" strokeLinecap="square" strokeLinejoin="miter" />
          <path d={d} fill="none" stroke="#2a3140" strokeWidth="24" strokeLinecap="square" strokeLinejoin="miter" />
          <path d={d} fill="none" stroke="#7eb6d6" strokeWidth="1.25" strokeDasharray="5 9" opacity="0.55" />
          {layout.pits.map((pit) => {
            const active = pit.world.id === current.id
            const mastery =
              pit.world.skillIds.reduce((n, id) => n + compositeMastery(stats[id] ?? emptyStats()), 0) /
              Math.max(1, pit.world.skillIds.length)
            const r = active ? 18 : 14
            return (
              <g key={pit.world.id}>
                <rect
                  x={pit.x - r}
                  y={pit.y - r}
                  width={r * 2}
                  height={r * 2}
                  fill={nightHex(pit.world.color)}
                  stroke={active ? '#7eb6d6' : '#8aa0b4'}
                  strokeWidth={active ? 1.6 : 1}
                />
                <text
                  x={pit.x}
                  y={pit.y + 4}
                  textAnchor="middle"
                  fontSize="10"
                  fontWeight="600"
                  fill="#e8eef8"
                  letterSpacing="1.4"
                >
                  {sectorCode(pit.world.name)}
                </text>
                <text x={pit.x} y={pit.y + 36} textAnchor="middle" fontSize="9" fontWeight="600" fill="#c5d0de">
                  {pit.world.name}
                </text>
                <text x={pit.x} y={pit.y + 48} textAnchor="middle" fontSize="8" fill="#7eb6d6">
                  {Math.round(mastery)} mastery
                </text>
                <rect
                  x={pit.x - 28}
                  y={pit.y - 28}
                  width="56"
                  height="56"
                  fill="transparent"
                  className="cursor-pointer"
                  onClick={() => driveTo(pit.world)}
                />
              </g>
            )
          })}
          {here ? (
            <polygon
              points={`${here.x},${here.y - 30} ${here.x + 7},${here.y - 18} ${here.x - 7},${here.y - 18}`}
              fill="#7eb6d6"
            />
          ) : null}
        </svg>
      </div>
      <p className="px-4 pb-3 text-center text-xs font-medium text-ink">{current.carry}</p>
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
    return `M ${first.x} ${first.y} L ${last.x} ${last.y}`
  }
  const first = pits[0]!
  let d = `M ${first.x} ${first.y}`
  for (let i = 1; i < pits.length; i += 1) {
    const pit = pits[i]!
    d += ` L ${pit.x} ${pit.y}`
  }
  return d
}

export function HandoffCard() {
  const parent = usePlayerStore((s) => s.parent)
  const current = worldForModule(parent.moduleId)
  const prev = linkedWorld(current, 'prev')
  const next = linkedWorld(current, 'next')

  return (
    <div className="panel rounded-sm p-4">
      <p className="font-display text-xl font-semibold">{current.name}</p>
      <div className="mt-3 grid grid-cols-3 gap-2 text-center text-[11px] font-semibold">
        <div className={cn('rounded-sm border border-white/10 bg-mist/60 p-2', !prev && 'opacity-40')}>
          <p className="text-ink">Previous</p>
          <p>{prev?.name ?? 'Grid'}</p>
        </div>
        <div className="border border-gold/50 bg-[#0e1a3a] p-2 text-gold">
          <p className="text-gold/70">Now</p>
          <p>{current.name}</p>
        </div>
        <div className={cn('rounded-sm border border-white/10 bg-mist/60 p-2', !next && 'opacity-40')}>
          <p className="text-ink">Next</p>
          <p>{next?.name ?? 'Peak'}</p>
        </div>
      </div>
    </div>
  )
}
