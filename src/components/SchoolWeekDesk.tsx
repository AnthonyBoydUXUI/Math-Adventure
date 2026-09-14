import { SKILLS } from '../data/curriculum.ts'
import { MAX_SCHOOL_PAGES, emptySchoolWeek, schoolFocusFromNote, schoolWeekLabel, weekKey, withSchoolPage } from '../engine/schoolWeek.ts'
import { pageId } from '../lib/photos.ts'
import { cn } from '../lib/cn.ts'
import { usePlayerStore } from '../store.ts'
import type { GradeBand, SchoolPageKind } from '../types.ts'
import { MediaCapture } from './MediaCapture.tsx'

const BANDS: { id: GradeBand; label: string }[] = [
  { id: '7', label: '7th' },
  { id: '8', label: '8th' },
  { id: '9', label: '9th' },
]

export function SchoolWeekDesk({ compact }: { compact?: boolean }) {
  const parent = usePlayerStore((s) => s.parent)
  const setParent = usePlayerStore((s) => s.setParent)
  const week = parent.schoolWeek?.weekKey === weekKey() ? parent.schoolWeek : emptySchoolWeek(new Date(), parent.gradeBand ?? '7')
  const skills = SKILLS.filter((s) => {
    if (week.gradeBand === '7') return s.track === 'classroom' || s.track === 'foundation'
    return s.track === 'classroom' || s.track === 'next' || s.track === 'foundation'
  })

  function save(next: typeof week, alsoSteer = true) {
    const focus = schoolFocusFromNote(next.note, next.gradeBand)
    const skillIds = next.skillIds.length ? next.skillIds : focus.skillIds
    const steered = alsoSteer && skillIds[0]
      ? {
          moduleId: focus.moduleId ?? parent.moduleId,
          topicId: focus.topicId ?? parent.topicId,
        }
      : {}
    const firstSkill = SKILLS.find((s) => s.id === skillIds[0])
    setParent({
      gradeBand: next.gradeBand,
      pageNote: next.note,
      pagePhoto: next.pages[0]?.dataUrl ?? parent.pagePhoto,
      schoolWeek: { ...next, skillIds },
      ...(steered && firstSkill?.moduleId
        ? { moduleId: firstSkill.moduleId, topicId: firstSkill.topicId ?? parent.topicId }
        : steered),
    })
  }

  function addPages(kind: SchoolPageKind, urls: string[]) {
    let next = week
    for (const dataUrl of urls) {
      next = withSchoolPage(next, {
        id: pageId(),
        kind,
        label: kind === 'study-guide' ? 'Study guide' : kind === 'work' ? 'My work' : 'Assignment',
        dataUrl,
        addedAt: Date.now(),
      })
    }
    save(next, false)
  }

  return (
    <section className="panel rounded-sm p-4">
      <p className="text-xs font-semibold uppercase tracking-widest text-sky">This week at school</p>
      <p className="mt-1 font-display text-2xl font-semibold">{schoolWeekLabel(week.note || week.skillIds.length || week.pages.length ? week : undefined)}</p>
      {!compact ? (
        <>
          <div className="mt-3 flex gap-2">
            {BANDS.map((b) => (
              <button
                key={b.id}
                type="button"
                className={cn(
                  'rounded-sm border border-white/10 px-3 py-1 text-sm font-semibold',
                  week.gradeBand === b.id ? 'bg-gold text-chrome' : 'bg-paper',
                )}
                onClick={() => save({ ...week, gradeBand: b.id }, false)}
              >
                {b.label}
              </button>
            ))}
          </div>
          <textarea
            value={week.note}
            onChange={(e) => save({ ...week, note: e.target.value }, false)}
            rows={3}
            placeholder="What’s on this week? Quiz Friday, equations, study guide pages…"
            className="mt-3 w-full rounded-sm border border-white/10 bg-paper px-3 py-3 font-semibold outline-none"
          />
          <p className="mt-3 text-xs font-semibold uppercase tracking-widest text-ink">Practice these</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {skills.slice(0, week.gradeBand === '7' ? 16 : 24).map((s) => {
              const on = week.skillIds.includes(s.id)
              return (
                <button
                  key={s.id}
                  type="button"
                  className={cn(
                    'rounded-sm border border-white/10 px-2 py-1 text-xs font-semibold',
                    on ? 'bg-sky text-chrome' : 'bg-paper',
                  )}
                  onClick={() => {
                    const skillIds = on ? week.skillIds.filter((id) => id !== s.id) : [...week.skillIds, s.id].slice(0, 5)
                    save({ ...week, skillIds })
                  }}
                >
                  {s.name}
                </button>
              )
            })}
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <MediaCapture
              multiple
              className="press inline-flex min-h-11 items-center rounded-sm border border-white/10 bg-paper px-3 text-sm font-semibold"
              label="Add assignment pages"
              onPhotos={(urls) => addPages('assignment', urls)}
            />
            <MediaCapture
              multiple
              className="press inline-flex min-h-11 items-center rounded-sm border border-white/10 bg-paper px-3 text-sm font-semibold"
              label="Add study-guide pages"
              onPhotos={(urls) => addPages('study-guide', urls)}
            />
          </div>
          <p className="mt-2 text-xs font-medium text-ink">
            Up to {MAX_SCHOOL_PAGES} pages. They stay on this device. The 15-minute run uses these skills all week.
          </p>
        </>
      ) : null}
      {week.pages.length ? (
        <div className="mt-3 grid grid-cols-3 gap-2">
          {week.pages.map((page, i) => (
            <figure key={page.id} className="relative overflow-hidden rounded-sm border border-white/10">
              <img src={page.dataUrl} alt={`${page.label} ${i + 1}`} className="aspect-[3/4] w-full object-cover" />
              <figcaption className="absolute inset-x-0 bottom-0 bg-[#070910]/80 px-1 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-white/80">
                {i + 1} · {page.kind === 'study-guide' ? 'Guide' : page.kind === 'work' ? 'Work' : 'Page'}
              </figcaption>
              {!compact ? (
                <button
                  type="button"
                  className="absolute right-1 top-1 rounded-sm bg-[#070910]/80 px-1.5 text-xs font-semibold text-white"
                  onClick={() => save({ ...week, pages: week.pages.filter((p) => p.id !== page.id) }, false)}
                >
                  ×
                </button>
              ) : null}
            </figure>
          ))}
        </div>
      ) : null}
      {!compact ? (
        <button
          type="button"
          className="press mt-4 w-full bg-[#0e1a3a] py-3 font-semibold uppercase tracking-[0.12em] text-bone"
          onClick={() => save({ ...week, weekKey: weekKey() }, true)}
        >
          Practice this all week
        </button>
      ) : null}
    </section>
  )
}
