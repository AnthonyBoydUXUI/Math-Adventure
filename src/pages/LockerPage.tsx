import { WindowBox } from '../components/WindowBox.tsx'
import { WorldScene } from '../components/WorldScene.tsx'
import { ACHIEVEMENTS, COSMETICS } from '../data/meta.ts'
import { cn } from '../lib/cn.ts'
import { usePlayerStore } from '../store.ts'

export function LockerPage() {
  const { cosmetics, achievements, equip, parent } = usePlayerStore()

  return (
    <div className="px-4 pb-8">
      <h1 className="type-pack text-5xl">Garage</h1>
      <p className="mt-1 font-medium text-ink">Loadout for the Harbor RS. Unlocks track habits, not grind.</p>

      <WindowBox className="mt-4" stamp="Harbor RS" series="Flight series" title="Vehicle loadout">
        <WorldScene
          embed
          moduleId={parent.moduleId}
          paint={cosmetics.paint}
          wheels={cosmetics.wheels}
          wing={cosmetics.wing}
          className="h-64"
        />
      </WindowBox>

      {(['paint', 'wheels', 'wing'] as const).map((slot) => (
        <section key={slot} className="mt-4">
          <h2 className="text-xs font-medium uppercase tracking-[0.18em] text-ink">{slot}</h2>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {COSMETICS.filter((c) => c.slot === slot).map((c) => {
              const on = cosmetics.unlocked.includes(c.id)
              return (
                <button
                  key={c.id}
                  type="button"
                  disabled={!on}
                  onClick={() => equip(slot, c.id)}
                  className={cn(
                    'rounded-sm border border-white/10 p-3 text-left',
                    cosmetics[slot] === c.id ? 'border-sky/50 bg-sky/10' : 'bg-paper',
                    !on && 'opacity-35',
                  )}
                >
                  <p className="font-semibold">{c.name}</p>
                  <p className="text-xs font-medium text-ink">{on ? c.subtitle : 'Locked'}</p>
                </button>
              )
            })}
          </div>
        </section>
      ))}

      <h2 className="mt-6 font-display text-2xl font-semibold">Habits unlocked</h2>
      <div className="mt-2 grid gap-2">
        {ACHIEVEMENTS.map((a) => (
          <div
            key={a.id}
            className={cn(
              'rounded-sm border border-white/10 p-3',
              achievements.includes(a.id) ? 'border-gold/40 bg-gold/10' : 'bg-paper',
            )}
          >
            <p className="font-semibold">{a.name}</p>
            <p className={cn('text-sm font-medium', achievements.includes(a.id) ? 'text-gold' : 'text-ink')}>
              {a.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
