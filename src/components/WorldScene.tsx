import { worldForModule, type AdventureWorld } from '../data/worlds.ts'
import { cn } from '../lib/cn.ts'

export function WorldScene({
  moduleId,
  className,
}: {
  moduleId: string
  className?: string
}) {
  const world = worldForModule(moduleId)
  return (
    <div className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)} aria-hidden>
      <div className="cloud cloud-a" style={{ background: world.accent }} />
      <div className="cloud cloud-b" style={{ background: '#fff' }} />
      {world.id === 'courtcrate' || world.id === 'market' ? <BounceBall /> : null}
      {world.id === 'gallery' || world.id === 'plaza' ? <PaintDrip color={world.color} /> : null}
      {world.id === 'arcade' ? <SpinRing /> : null}
    </div>
  )
}

export function WorldChip({ world, active }: { world: AdventureWorld; active?: boolean }) {
  return (
    <div
      className={cn(
        'flex items-center gap-2 rounded-2xl border-2 border-navy px-3 py-2',
        active ? 'text-white' : 'bg-white',
      )}
      style={active ? { background: world.color } : undefined}
    >
      <span className="text-lg">{world.icon}</span>
      <div>
        <p className="text-[10px] font-extrabold uppercase tracking-widest opacity-70">{world.district}</p>
        <p className="font-extrabold leading-tight">{world.name}</p>
      </div>
    </div>
  )
}

function BounceBall() {
  return <div className="bounce-ball" />
}

function PaintDrip({ color }: { color: string }) {
  return <div className="paint-drip" style={{ background: color }} />
}

function SpinRing() {
  return <div className="spin-ring" />
}
