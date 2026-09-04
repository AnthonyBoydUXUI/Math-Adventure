import { useEffect, useState } from 'react'
import { formatClock } from '../lib/clock.ts'

export function DayClock({ compact = false }: { compact?: boolean }) {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const tick = () => setNow(new Date())
    const id = window.setInterval(tick, 15_000)
    const onVisible = () => {
      if (document.visibilityState === 'visible') tick()
    }
    document.addEventListener('visibilitychange', onVisible)
    return () => {
      window.clearInterval(id)
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [])

  const clock = formatClock(now)
  return (
    <time
      dateTime={now.toISOString()}
      className={compact ? 'text-[11px] font-medium uppercase tracking-[0.16em] text-ink' : 'text-sm font-semibold'}
      aria-label={clock.line}
    >
      {compact ? clock.compact : clock.line}
    </time>
  )
}
