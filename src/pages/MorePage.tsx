import { Link } from 'react-router-dom'
import { MODULES, SKILLS } from '../data/curriculum.ts'
import { compositeMastery, emptyStats } from '../engine/mastery.ts'
import { usePlayerStore } from '../store.ts'

export function MorePage() {
  return (
    <div className="px-4 pb-8">
      <h1 className="font-display text-4xl font-extrabold">More</h1>
      <div className="mt-4 grid gap-3">
        <Link to="/coach" className="rounded-[24px] border-2 border-navy bg-navy p-5 text-white press">
          <p className="text-xs font-extrabold uppercase tracking-widest text-white/50">Personal math coach</p>
          <p className="font-display text-2xl font-extrabold">Dimension desk</p>
        </Link>
        <Link to="/map" className="rounded-[24px] border-2 border-navy bg-orange p-5 text-white press">
          <p className="text-xs font-extrabold uppercase tracking-widest text-white/70">Mastery, not calendar</p>
          <p className="font-display text-2xl font-extrabold">Three-track map</p>
        </Link>
        <Link to="/parent" className="rounded-[24px] border-2 border-navy bg-white p-5 press">
          <p className="text-xs font-extrabold uppercase tracking-widest text-navy/40">Grown-ups</p>
          <p className="font-display text-2xl font-extrabold">Parent desk</p>
        </Link>
      </div>
    </div>
  )
}

export function MapPage() {
  const stats = usePlayerStore((s) => s.stats)
  const tracks = [
    { id: 'classroom', title: 'Classroom', sub: 'Reveal Course 2' },
    { id: 'foundation', title: 'Foundation', sub: 'Precision, not remediation theater' },
    { id: 'next', title: 'Next Level', sub: '8th + Algebra I peek' },
  ] as const

  return (
    <div className="px-4 pb-8">
      <h1 className="font-display text-4xl font-extrabold">Skill tree</h1>
      <p className="mt-1 font-bold text-navy/60">Three tracks at once. Unlock with mastery.</p>
      {tracks.map((t) => (
        <section key={t.id} className="mt-5">
          <h2 className="font-display text-2xl font-extrabold">{t.title}</h2>
          <p className="text-sm font-bold text-navy/50">{t.sub}</p>
          <div className="mt-2 grid gap-2">
            {SKILLS.filter((s) => s.track === t.id).map((s) => {
              const m = compositeMastery(stats[s.id] ?? emptyStats())
              return (
                <div key={s.id} className="rounded-2xl border-2 border-navy bg-white p-3">
                  <div className="flex items-center justify-between">
                    <p className="font-extrabold">{s.name}</p>
                    <p className="font-display text-xl font-extrabold">{Math.round(m)}</p>
                  </div>
                  <div className="mt-1 h-2 overflow-hidden rounded-full bg-mist">
                    <div
                      className={t.id === 'classroom' ? 'h-full bg-pink' : t.id === 'foundation' ? 'h-full bg-sky' : 'h-full bg-violet'}
                      style={{ width: `${m}%` }}
                    />
                  </div>
                  <p className="mt-1 text-xs font-bold text-navy/45">{s.blurb}</p>
                </div>
              )
            })}
          </div>
        </section>
      ))}
      <p className="mt-6 text-xs font-bold text-navy/40">
        Reveal alignment uses original items on Course 2 concepts — never copied pages or publisher banks.
      </p>
      <p className="text-xs font-bold text-navy/40">{MODULES.length} modules on the classroom spine.</p>
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
      <h1 className="font-display text-4xl font-extrabold">Coach</h1>
      <p className="mt-1 font-bold text-navy/60">
        A 440 overall is a prior, not a personality. Geometry can be strong while stats is noisy. We split the why.
      </p>
      {focus ? (
        <div className="mt-4 rounded-[24px] border-2 border-navy bg-white p-4">
          <p className="text-xs font-extrabold uppercase tracking-widest text-navy/40">Today’s focus dimensions</p>
          {Object.entries(focus)
            .filter(([k]) => !['attempts', 'correct', 'lastSeen'].includes(k))
            .map(([k, v]) => (
              <div key={k} className="mt-2">
                <div className="flex justify-between text-sm font-extrabold">
                  <span>{k}</span>
                  <span>{Math.round(Number(v))}</span>
                </div>
                <div className="h-2 rounded-full bg-mist">
                  <div className="h-full rounded-full bg-goggle" style={{ width: `${Number(v)}%` }} />
                </div>
              </div>
            ))}
        </div>
      ) : null}
      <h2 className="mt-5 font-display text-2xl font-extrabold">What the misses actually were</h2>
      <div className="mt-2 space-y-2">
        {Object.keys(mix).length === 0 ? (
          <p className="font-bold text-navy/50">Fly once and this fills in — slips vs gaps vs format vs nerves.</p>
        ) : (
          Object.entries(mix).map(([k, n]) => (
            <p key={k} className="rounded-2xl border-2 border-navy bg-white px-3 py-2 font-extrabold">
              {k.replaceAll('_', ' ')} · {n}
            </p>
          ))
        )}
      </div>
    </div>
  )
}
