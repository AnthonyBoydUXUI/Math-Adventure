import { Link } from 'react-router-dom'
import { DayClock } from '../components/DayClock.tsx'
import { usePlayerStore } from '../store.ts'

export function WatchPage() {
  const { streak, bookmark, session, studentName } = usePlayerStore()
  const name = studentName.trim() || 'Student'

  return (
    <div className="watch-face mx-auto max-w-[280px] px-3 py-4 text-center">
      <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-ink">{name}</p>
      <div className="mt-1">
        <DayClock compact />
      </div>
      <p className="mt-4 font-display text-5xl font-semibold leading-none">{streak}</p>
      <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.18em] text-ink">Day streak</p>
      <p className="mt-4 text-sm font-semibold leading-snug text-navy">{bookmark.label}</p>
      <Link
        to="/train"
        className="press mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-sm bg-sky text-sm font-semibold text-chrome"
      >
        {session.active ? 'Resume' : 'Today’s 15'}
      </Link>
      <Link to="/" className="mt-2 inline-flex min-h-11 items-center text-xs font-medium text-ink">
        Full app
      </Link>
    </div>
  )
}
