import { formatClock, weekDays } from '../lib/clock.ts'
import { cn } from '../lib/cn.ts'

export function WeekStrip({
  practiced,
  inProgressKey,
}: {
  practiced: string[]
  inProgressKey?: string
}) {
  const now = new Date()
  const days = weekDays(now)
  const clock = formatClock(now)
  const set = new Set(practiced)

  return (
    <section aria-label={`Week of ${clock.year}`}>
      <div className="flex items-end justify-between">
        <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-ink">{clock.year}</p>
      </div>
      <ol className="mt-2 grid grid-cols-7 gap-1">
        {days.map((d) => {
          const done = set.has(d.key)
          const current = d.key === inProgressKey
          return (
            <li key={d.key}>
              <div
                className={cn(
                  'flex min-h-11 flex-col items-center justify-center rounded-xl border border-white/10 px-1 py-1 text-center',
                  d.isToday && 'border-sky/50 bg-sky/10',
                  done && !d.isToday && 'border-leaf/30 bg-leaf/10',
                  d.isFuture && 'opacity-40',
                )}
              >
                <span className="text-[10px] font-medium uppercase tracking-widest text-ink">{d.weekdayShort}</span>
                <span className="font-display text-lg font-semibold leading-none">{d.day}</span>
                <span className="sr-only">
                  {d.key}
                  {d.isToday ? ', today' : ''}
                  {done ? ', practiced' : ''}
                  {current ? ', in progress' : ''}
                </span>
                <span
                  className={cn(
                    'mt-1 h-1 w-1 rounded-full',
                    current ? 'bg-gold' : done ? 'bg-leaf' : d.isToday ? 'bg-sky' : 'bg-transparent',
                  )}
                  aria-hidden
                />
              </div>
            </li>
          )
        })}
      </ol>
    </section>
  )
}
