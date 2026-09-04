import { Link } from 'react-router-dom'
import { CircuitTrack, HandoffCard } from '../components/CircuitTrack.tsx'
import { LiveDay } from '../components/LiveWorld.tsx'
import { TestReadinessCard } from '../components/TestReadinessCard.tsx'
import { WindowBox } from '../components/WindowBox.tsx'
import { SKILLS } from '../data/curriculum.ts'
import { worldForModule } from '../data/worlds.ts'
import { compositeMastery, emptyStats } from '../engine/mastery.ts'
import { usePlayerStore } from '../store.ts'

export function MorePage() {
  return (
    <div className="px-4 pb-8">
      <h1 className="type-pack text-5xl">More</h1>
      <div className="mt-4 grid gap-3">
        <Link to="/coach" className="panel press rounded-sm p-5">
          <p className="font-display text-2xl font-semibold">Scores</p>
        </Link>
        <Link to="/map" className="panel press rounded-sm p-5">
          <p className="font-display text-2xl font-semibold">Map</p>
        </Link>
        <Link to="/parent" className="panel press rounded-sm p-5">
          <p className="font-display text-2xl font-semibold">Parent</p>
        </Link>
        <Link to="/account" className="panel press rounded-sm p-5">
          <p className="font-display text-2xl font-semibold">Account</p>
        </Link>
        <Link to="/watch" className="panel press rounded-sm p-5">
          <p className="font-display text-2xl font-semibold">Watch</p>
        </Link>
        <Link to="/privacy-center" className="panel press rounded-sm p-5">
          <p className="font-display text-2xl font-semibold">Privacy</p>
        </Link>
      </div>
      <nav className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-sm font-semibold text-sky" aria-label="Legal">
        <Link to="/privacy">Privacy Policy</Link>
        <Link to="/terms">Terms of Use</Link>
        <Link to="/support">Support</Link>
      </nav>
    </div>
  )
}

export function MapPage() {
  const stats = usePlayerStore((s) => s.stats)
  const parent = usePlayerStore((s) => s.parent)
  const world = worldForModule(parent.moduleId)
  const tracks = [
    { id: 'classroom', title: 'Classroom' },
    { id: 'foundation', title: 'Foundation' },
    { id: 'next', title: 'Next' },
  ] as const

  return (
    <div className="px-4 pb-8">
      <h1 className="type-pack text-5xl">Map</h1>
      <WindowBox className="mt-3" stamp={world.district} series="Live">
        <LiveDay />
      </WindowBox>
      <div className="mt-3">
        <HandoffCard />
      </div>
      <div className="mt-3">
        <CircuitTrack />
      </div>
      {tracks.map((t) => (
        <section key={t.id} className="mt-5">
          <h2 className="font-display text-2xl font-semibold">{t.title}</h2>
          <div className="mt-2 grid gap-2">
            {SKILLS.filter((s) => s.track === t.id).map((s) => {
              const m = compositeMastery(stats[s.id] ?? emptyStats())
              return (
                <div key={s.id} className="panel rounded-sm p-3">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold">{s.name}</p>
                    <p className="font-display text-xl font-semibold">{Math.round(m)}</p>
                  </div>
                  <div className="mt-1 h-1 overflow-hidden bg-mist">
                    <div
                      className={t.id === 'classroom' ? 'h-full bg-sky' : t.id === 'foundation' ? 'h-full bg-leaf' : 'h-full bg-violet'}
                      style={{ width: `${m}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      ))}
    </div>
  )
}

export function CoachPage() {
  const { stats, attempts, mission } = usePlayerStore()
  const focus = stats[mission.focusSkillId]
  const mix = attempts.reduce<Record<string, number>>((acc, a) => {
    acc[a.diagnosis] = (acc[a.diagnosis] ?? 0) + 1
    return acc
  }, {})

  return (
    <div className="px-4 pb-8">
      <h1 className="type-pack text-5xl">Scores</h1>
      <div className="mt-4">
        <TestReadinessCard />
      </div>
      {focus ? (
        <div className="panel mt-4 rounded-sm p-4">
          <p className="text-xs font-medium uppercase tracking-widest text-ink">Focus</p>
          {Object.entries(focus)
            .filter(([k]) => !['attempts', 'correct', 'lastSeen'].includes(k))
            .map(([k, v]) => (
              <div key={k} className="mt-2">
                <div className="flex justify-between text-sm font-semibold">
                  <span>{k}</span>
                  <span>{Math.round(Number(v))}</span>
                </div>
                <div className="h-1 bg-mist">
                  <div className="h-full bg-sky" style={{ width: `${Number(v)}%` }} />
                </div>
              </div>
            ))}
        </div>
      ) : null}
      <h2 className="mt-5 font-display text-2xl font-semibold">Misses</h2>
      <div className="mt-2 space-y-2">
        {Object.keys(mix).length === 0 ? (
          <p className="font-medium text-ink">Play first.</p>
        ) : (
          Object.entries(mix).map(([k, n]) => (
            <p key={k} className="panel rounded-xl px-3 py-2 font-semibold">
              {k.replaceAll('_', ' ')} · {n}
            </p>
          ))
        )}
      </div>
    </div>
  )
}
