import { MODULES } from '../data/curriculum.ts'
import { THEMES } from '../types.ts'
import { usePlayerStore } from '../store.ts'
import { cn } from '../lib/cn.ts'

export function ParentPage() {
  const { parent, setParent, setThemes } = usePlayerStore()
  const mod = MODULES.find((m) => m.id === parent.moduleId)

  return (
    <div className="px-4 pb-8">
      <h1 className="font-display text-4xl font-semibold tracking-tight">Parent desk</h1>
      <p className="mt-1 font-bold text-navy/65">
        Point Aero at this week’s Reveal Math topic. The 15-minute plan will overweight it — without copying the book.
      </p>

      <label className="mt-4 block text-xs font-extrabold uppercase tracking-widest text-navy/45">Student name</label>
      <input
        value={parent.studentName}
        onChange={(e) => setParent({ studentName: e.target.value })}
        className="mt-1 w-full rounded-2xl border border-white/10 bg-white px-3 py-3 font-extrabold"
      />

      <label className="mt-4 block text-xs font-extrabold uppercase tracking-widest text-navy/45">
        Reveal Math · Course 2
      </label>
      <select
        className="mt-1 w-full rounded-2xl border border-white/10 bg-white px-3 py-3 font-extrabold"
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
        className="mt-2 w-full rounded-2xl border border-white/10 bg-white px-3 py-3 font-extrabold"
        value={parent.topicId}
        onChange={(e) => setParent({ topicId: e.target.value })}
      >
        {mod?.topics.map((t) => (
          <option key={t.id} value={t.id}>
            {t.name}
          </option>
        ))}
      </select>

      <label className="mt-4 inline-flex items-center gap-2 font-extrabold">
        <input
          type="checkbox"
          checked={parent.pressureLab}
          onChange={(e) => setParent({ pressureLab: e.target.checked })}
        />
        Gentle lock-in clock in Test Lab
      </label>

      <h2 className="mt-5 text-xs font-extrabold uppercase tracking-widest text-navy/45">Interest worlds</h2>
      <div className="mt-2 flex flex-wrap gap-2">
        {THEMES.map((th) => {
          const on = parent.themes.includes(th)
          return (
            <button
              key={th}
              type="button"
              className={cn(
                'rounded-full border border-white/10 px-3 py-1 text-sm font-extrabold capitalize',
                on ? 'bg-orange text-white' : 'bg-white',
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

      <h2 className="mt-6 font-display text-2xl font-extrabold">How to read the diagnostic</h2>
      <ul className="mt-2 space-y-2 text-sm font-bold text-navy/70">
        <li className="rounded-2xl bg-white p-3">Overall 440 is a starting prior — not “fourth grade.”</li>
        <li className="rounded-2xl bg-white p-3">Geometry 480 is a relative strength. Use it as a bridge.</li>
        <li className="rounded-2xl bg-white p-3">Stats 380 is the loudest gap cluster, not a global identity.</li>
        <li className="rounded-2xl bg-white p-3">
          Expressions 430 often mixes format transfer + written process, not missing algebra talent.
        </li>
      </ul>

      <label className="mt-5 inline-flex rounded-2xl border border-white/10 bg-white px-3 py-2 text-sm font-extrabold">
        Upload a class page photo
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (!file) return
            const reader = new FileReader()
            reader.onload = () => setParent({ pagePhoto: String(reader.result) })
            reader.readAsDataURL(file)
          }}
        />
      </label>
      {parent.pagePhoto ? (
        <img src={parent.pagePhoto} alt="Class page" className="mt-3 max-h-40 rounded-2xl border border-white/10 object-cover" />
      ) : null}
    </div>
  )
}
