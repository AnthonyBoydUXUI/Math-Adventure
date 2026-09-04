import { MediaCapture } from '../components/MediaCapture.tsx'
import { MODULES } from '../data/curriculum.ts'
import { THEMES } from '../types.ts'
import { usePlayerStore } from '../store.ts'
import { cn } from '../lib/cn.ts'
import { TestReadinessCard } from '../components/TestReadinessCard.tsx'

export function ParentPage() {
  const { parent, setParent, setThemes } = usePlayerStore()
  const mod = MODULES.find((m) => m.id === parent.moduleId)

  return (
    <div className="px-4 pb-8">
      <h1 className="type-pack text-5xl">Parent desk</h1>
      <p className="mt-1 font-bold text-navy/65">
        Point Aero at this week’s Grade 7 classroom topic. The 15-minute plan will overweight it — original items, not a copied book.
      </p>

      <label className="mt-4 block text-xs font-semibold uppercase tracking-widest text-navy/45">Student name</label>
      <input
        value={parent.studentName}
        onChange={(e) => setParent({ studentName: e.target.value })}
        className="mt-1 w-full rounded-sm border border-white/10 bg-paper px-3 py-3 font-semibold"
        placeholder="Optional — stays on this device"
        autoComplete="nickname"
      />

      <label className="mt-4 block text-xs font-semibold uppercase tracking-widest text-navy/45">
        Grade 7 course topics
      </label>
      <select
        className="mt-1 w-full rounded-sm border border-white/10 bg-paper px-3 py-3 font-semibold"
        value={parent.moduleId}
        onChange={(e) => {
          const next = MODULES.find((m) => m.id === e.target.value)
          setParent({ moduleId: e.target.value, topicId: next?.topics[0]?.id ?? parent.topicId })
        }}
      >
        {MODULES.map((m) => (
          <option key={m.id} value={m.id}>
            Module {m.number} — {m.name}
          </option>
        ))}
      </select>
      <select
        className="mt-2 w-full rounded-sm border border-white/10 bg-paper px-3 py-3 font-semibold"
        value={parent.topicId}
        onChange={(e) => setParent({ topicId: e.target.value })}
      >
        {mod?.topics.map((t) => (
          <option key={t.id} value={t.id}>
            {t.name}
          </option>
        ))}
      </select>

      <label className="mt-4 inline-flex items-center gap-2 font-semibold">
        <input
          type="checkbox"
          checked={parent.pressureLab}
          onChange={(e) => setParent({ pressureLab: e.target.checked })}
        />
        Gentle lock-in clock in Test Lab
      </label>

      <h2 className="mt-5 text-xs font-semibold uppercase tracking-widest text-navy/45">Interest worlds</h2>
      <div className="mt-2 flex flex-wrap gap-2">
        {THEMES.map((th) => {
          const on = parent.themes.includes(th)
          return (
            <button
              key={th}
              type="button"
              className={cn(
                'rounded-sm border border-white/10 px-3 py-1 text-sm font-semibold capitalize',
                on ? 'bg-sky text-chrome' : 'bg-paper',
              )}
              onClick={() =>
                setThemes(on ? parent.themes.filter((x) => x !== th) : [...parent.themes, th])
              }
            >
              {th === 'sky' ? 'anime-inspired sky' : th}
            </button>
          )
        })}
      </div>

      <h2 className="mt-6 font-display text-2xl font-semibold">What the test actually is</h2>
      <div className="mt-2">
        <TestReadinessCard />
      </div>
      <p className="mt-3 text-sm font-medium text-ink">
        Classwork and timed tests are different wrappers. This lab snapshot uses Test Lab + boss plays — not a grade-level label or medical diagnosis.
      </p>
      <ul className="mt-2 space-y-2 text-sm font-bold text-navy/70">
        <li className="rounded-sm bg-paper p-3">Overall 440 is a starting prior — not “fourth grade.”</li>
        <li className="rounded-sm bg-paper p-3">Geometry 480 is a relative strength. Use it as a bridge.</li>
        <li className="rounded-sm bg-paper p-3">Stats 380 is the loudest gap cluster, not a global identity.</li>
        <li className="rounded-sm bg-paper p-3">
          Expressions 430 often mixes format transfer + written process, not missing algebra talent.
        </li>
      </ul>

      <MediaCapture
        className="press mt-5 inline-flex min-h-11 items-center rounded-sm border border-white/10 bg-paper px-3 text-sm font-semibold"
        label="Upload a class page photo"
        onPhoto={(url) => setParent({ pagePhoto: url })}
      />
      {parent.pagePhoto ? (
        <img src={parent.pagePhoto} alt="Class page" className="mt-3 max-h-40 rounded-sm border border-white/10 object-cover" />
      ) : null}
    </div>
  )
}
