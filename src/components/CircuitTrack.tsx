import { firstTopicId } from '../data/curriculum.ts'
import { worldThumb } from '../data/sheets.ts'
import { circuitPits, linkedWorld, worldForModule, WORLDS, type AdventureWorld } from '../data/worlds.ts'
import { compositeMastery, emptyStats } from '../engine/mastery.ts'
import { cn } from '../lib/cn.ts'
import { resumeAudio } from '../lib/sfx.ts'
import { usePlayerStore } from '../store.ts'
import { SheetArt } from './SheetArt.tsx'

export function CircuitTrack({ compact }: { compact?: boolean }) {
  const parent = usePlayerStore((s) => s.parent)
  const stats = usePlayerStore((s) => s.stats)
  const current = worldForModule(parent.moduleId)
  const worlds = compact
    ? nearbyWorlds(current.id)
    : WORLDS

  function driveTo(world: AdventureWorld) {
    if (!world.moduleId) return
    resumeAudio()
    const topic = firstTopicId(world.moduleId)
    usePlayerStore.getState().driveTo(world.moduleId, topic ?? parent.topicId)
  }

  return (
    <div className="grid gap-3">
      {worlds.map((world) => {
        const active = world.id === current.id
        const mastery =
          world.skillIds.reduce((n, id) => n + compositeMastery(stats[id] ?? emptyStats()), 0) /
          Math.max(1, world.skillIds.length)
        const canDrive = Boolean(world.moduleId)
        return (
          <button
            key={world.id}
            type="button"
            disabled={!canDrive}
            onClick={() => driveTo(world)}
            className={cn(
              'overflow-hidden rounded-sm border-2 bg-[#05070b] text-left',
              active ? 'border-gold' : 'border-white/10',
              !canDrive && 'opacity-80',
            )}
          >
            <SheetArt src={worldThumb(world.id)} alt={`${world.district} map`} cover className="aspect-square" />
            <div className="px-3 py-2">
              <p className="font-semibold text-white">{world.name}</p>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/55">{world.district}</p>
              <p className="mt-1 text-xs font-medium text-ink">{Math.round(mastery)} mastery</p>
            </div>
          </button>
        )
      })}
    </div>
  )
}

function nearbyWorlds(currentId: string) {
  const all = circuitPits().map((p) => p.world)
  const idx = Math.max(0, all.findIndex((w) => w.id === currentId))
  const start = Math.max(0, Math.min(idx - 1, all.length - 4))
  return all.slice(start, start + 4)
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
