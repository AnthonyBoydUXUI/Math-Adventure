import { ACHIEVEMENTS, COSMETICS } from '../data/meta.ts'
import { cn } from '../lib/cn.ts'
import { usePlayerStore } from '../store.ts'
import { Aero } from '../components/Aero.tsx'

export function LockerPage() {
  const { cosmetics, achievements, equip } = usePlayerStore()
  const figures = COSMETICS.filter((c) => c.slot === 'figure')

  return (
    <div className="px-4 pb-8">
      <h1 className="font-display text-4xl font-extrabold">Locker</h1>
      <p className="mt-1 font-bold text-navy/65">Collectible forms. Cosmetics celebrate habits, not grinding.</p>

      <div className="mt-4 flex justify-center rounded-[28px] border-2 border-navy bg-white py-4">
        <Aero className="h-44" goggles={cosmetics.goggles} hoodie={cosmetics.hoodie} kicks={cosmetics.kicks} mood="cheer" />
      </div>

      {(['goggles', 'hoodie', 'kicks'] as const).map((slot) => (
        <section key={slot} className="mt-4">
          <h2 className="text-xs font-extrabold uppercase tracking-widest text-navy/45">{slot}</h2>
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
                    'rounded-2xl border-2 border-navy p-3 text-left',
                    cosmetics[slot] === c.id ? 'bg-gold' : 'bg-white',
                    !on && 'opacity-40',
                  )}
                >
                  <p className="font-extrabold">{c.name}</p>
                  <p className="text-xs font-bold text-navy/50">{on ? c.subtitle : 'Locked'}</p>
                </button>
              )
            })}
          </div>
        </section>
      ))}

      <h2 className="mt-6 font-display text-2xl font-extrabold">Figure cases</h2>
      <div className="mt-2 space-y-3">
        {figures.map((fig) => {
          const on = cosmetics.unlocked.includes(fig.id)
          return (
            <article
              key={fig.id}
              className={cn(
                'grid grid-cols-[120px_1fr] overflow-hidden rounded-[24px] border-2 border-navy bg-white',
                !on && 'opacity-50',
              )}
            >
              <div className="figure-window flex items-center justify-center border-r-2 border-navy p-2">
                <Aero className="h-28" mood={on ? 'lockin' : 'think'} />
              </div>
              <div className="p-3">
                <p className="text-[10px] font-extrabold tracking-[0.2em] text-navy/40">AERO SERIES</p>
                <h3 className="font-display text-xl font-extrabold leading-tight">{fig.name}</h3>
                <p className="text-xs font-extrabold uppercase text-sky">{fig.subtitle}</p>
                <p className="mt-2 text-xs font-bold text-navy/50">{on ? 'Unlocked' : `Earn ${fig.unlock}`}</p>
              </div>
            </article>
          )
        })}
      </div>

      <h2 className="mt-6 font-display text-2xl font-extrabold">Achievements</h2>
      <div className="mt-2 grid gap-2">
        {ACHIEVEMENTS.map((a) => (
          <div
            key={a.id}
            className={cn(
              'rounded-2xl border-2 border-navy p-3',
              achievements.includes(a.id) ? 'bg-leaf text-white' : 'bg-white',
            )}
          >
            <p className="font-extrabold">{a.name}</p>
            <p className={cn('text-sm font-bold', achievements.includes(a.id) ? 'text-white/80' : 'text-navy/55')}>
              {a.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
