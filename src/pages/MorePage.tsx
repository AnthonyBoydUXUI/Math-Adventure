import { Link } from 'react-router-dom'
import { CircuitTrack, HandoffCard } from '../components/CircuitTrack.tsx'
import { nightHex } from '../engine/render/palette.ts'
import { TestReadinessCard } from '../components/TestReadinessCard.tsx'
import { MODULES, SKILLS } from '../data/curriculum.ts'
import { WORLDS } from '../data/worlds.ts'
import { compositeMastery, emptyStats } from '../engine/mastery.ts'
import { usePlayerStore } from '../store.ts'

export function MorePage() {
  return (
    <div className="px-4 pb-8">
      <h1 className="type-pack text-5xl">System</h1>
      <div className="mt-4 grid gap-3">
        <Link to="/coach" className="panel press rounded-sm p-5">
          <p className="text-xs font-medium uppercase tracking-widest text-ink">Telemetry</p>
          <p className="font-display text-2xl font-semibold">Dimension desk</p>
        </Link>
        <Link to="/map" className="panel press rounded-sm p-5">
          <p className="text-xs font-medium uppercase tracking-widest text-ink">Worlds</p>
          <p className="font-display text-2xl font-semibold">Subject circuit</p>
        </Link>
        <Link to="/parent" className="panel press rounded-sm p-5">
          <p className="text-xs font-medium uppercase tracking-widest text-ink">Adults</p>
          <p className="font-display text-2xl font-semibold">Parent desk</p>
        </Link>
        <Link to="/account" className="panel press rounded-sm p-5">
          <p className="text-xs font-medium uppercase tracking-widest text-ink">Backup</p>
          <p className="font-display text-2xl font-semibold">Account + sync</p>
        </Link>
        <Link to="/watch" className="panel press rounded-sm p-5">
          <p className="text-xs font-medium uppercase tracking-widest text-ink">Wearable</p>
          <p className="font-display text-2xl font-semibold">Watch glance</p>
        </Link>
        <Link to="/privacy-center" className="panel press rounded-sm p-5">
          <p className="text-xs font-medium uppercase tracking-widest text-ink">Data rights</p>
          <p className="font-display text-2xl font-semibold">Privacy Center</p>
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
  const tracks = [
    { id: 'classroom', title: 'Classroom', sub: 'Grade 7 course topics' },
    { id: 'foundation', title: 'Foundation', sub: 'Precision, not remediation theater' },
    { id: 'next', title: 'Next Level', sub: '8th + Algebra I peek' },
  ] as const

  return (
    <div className="px-4 pb-8">
      <h1 className="type-pack text-5xl">Subject circuit</h1>
      <p className="mt-1 font-medium text-ink">
        Each subject is its own world. The Harbor RS carries one idea into the next so the math actually connects.
      </p>
      <div className="mt-3">
        <HandoffCard />
      </div>
      <div className="mt-3">
        <CircuitTrack />
      </div>
      <div className="mt-3 space-y-2">
        {WORLDS.filter((w) => w.track === 'classroom').map((w) => (
          <div key={w.id} className="overflow-hidden rounded-sm p-3 text-white" style={{ background: nightHex(w.color, 0.5, 0.2) }}>
            <p className="font-semibold">{w.name}</p>
            <p className="text-sm font-medium text-white/90">{w.adventure}</p>
            <p className="mt-1 text-sm font-medium text-white/80">{w.bridgeLine}</p>
            <p className="mt-1 text-xs font-medium text-white/70">
              Carry: {w.carry} → {w.handoff}
            </p>
          </div>
        ))}
      </div>
      {tracks.map((t) => (
        <section key={t.id} className="mt-5">
          <h2 className="font-display text-2xl font-semibold">{t.title}</h2>
          <p className="text-sm font-medium text-ink">{t.sub}</p>
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
                  <p className="mt-1 text-xs font-medium text-ink">{s.blurb}</p>
                </div>
              )
            })}
          </div>
        </section>
      ))}
      <p className="mt-6 text-xs font-medium text-ink">
        Classroom items are original practice on typical Grade 7 topics — not copied pages or publisher banks, and not an official course partnership.
      </p>
      <p className="text-xs font-medium text-ink">{MODULES.length} modules on the classroom spine.</p>
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
      <h1 className="type-pack text-5xl">Telemetry</h1>
      <p className="mt-1 font-medium text-ink">
        A 440 overall is a prior, not a personality. Geometry can be strong while stats is noisy. Test Lab is where that split becomes a plan.
      </p>
      <div className="mt-4">
        <TestReadinessCard />
      </div>
      {focus ? (
        <div className="panel mt-4 rounded-sm p-4">
          <p className="text-xs font-medium uppercase tracking-widest text-ink">Focus dimensions</p>
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
      <h2 className="mt-5 font-display text-2xl font-semibold">What the misses actually were</h2>
      <div className="mt-2 space-y-2">
        {Object.keys(mix).length === 0 ? (
          <p className="font-medium text-ink">Run a session and this fills in — slips vs gaps vs format vs nerves.</p>
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
