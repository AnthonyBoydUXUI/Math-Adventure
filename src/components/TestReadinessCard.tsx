import { Link } from 'react-router-dom'
import { buildTestReport } from '../engine/testReady.ts'
import { usePlayerStore } from '../store.ts'

export function TestReadinessCard({ compact }: { compact?: boolean }) {
  const attempts = usePlayerStore((s) => s.attempts)
  const report = buildTestReport(attempts)

  return (
    <div className="panel rounded-sm p-4">
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-ink">Test readiness</p>
          <p className="font-display text-2xl font-semibold">{report.readiness}</p>
        </div>
        <p className="text-right text-xs font-medium text-ink">
          {report.sampleSize ? `${report.sampleSize} test-style plays` : 'No lab sample yet'}
        </p>
      </div>
      <div className="mt-2 h-1 overflow-hidden bg-mist">
        <div className="h-full bg-sky" style={{ width: `${report.readiness}%` }} />
      </div>
      {!compact ? (
        <>
          <div className="mt-3 grid grid-cols-3 gap-2 text-center text-[11px] font-semibold">
            <div className="rounded-sm bg-mist/70 p-2">
              <p className="text-ink">Transfer</p>
              <p>{report.transfer}</p>
            </div>
            <div className="rounded-sm bg-mist/70 p-2">
              <p className="text-ink">Lock-in</p>
              <p>{report.lockInRate}</p>
            </div>
            <div className="rounded-sm bg-mist/70 p-2">
              <p className="text-ink">Paper</p>
              <p>{report.paperHabit}</p>
            </div>
          </div>
          {report.formats.length ? (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {report.formats.map((cell) => (
                <span
                  key={cell.format}
                  className="rounded-sm border border-white/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-ink"
                >
                  {cell.format} {Math.round(cell.accuracy)}
                </span>
              ))}
            </div>
          ) : null}
          <p className="mt-3 text-sm font-medium text-navy">{report.drillLine}</p>
          <p className="mt-1 text-sm font-medium text-ink">{report.testDayLine}</p>
        </>
      ) : (
        <p className="mt-3 text-sm font-medium text-ink">{report.drillLine}</p>
      )}
      {compact ? (
        <Link to="/lab" className="mt-3 inline-block text-xs font-semibold uppercase tracking-[0.16em] text-sky">
          Open Test Lab
        </Link>
      ) : null}
    </div>
  )
}
