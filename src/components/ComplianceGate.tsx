import { useState } from 'react'
import { Link } from 'react-router-dom'
import { APP_NAME } from '../content/legal.ts'
import { usePlayerStore } from '../store.ts'
import { Aero } from './Aero.tsx'

export function ComplianceGate() {
  const acknowledgeCompliance = usePlayerStore((s) => s.acknowledgeCompliance)
  const [role, setRole] = useState<'parent' | 'student12' | null>(null)
  const [ageOk, setAgeOk] = useState(false)
  const [notMedical, setNotMedical] = useState(false)
  const [localData, setLocalData] = useState(false)
  const ready = Boolean(role) && ageOk && notMedical && localData

  return (
    <div className="mx-auto flex min-h-dvh max-w-xl flex-col px-5 pb-10 pt-[max(1.5rem,env(safe-area-inset-top))]">
      <Aero className="mx-auto h-28" />
      <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-ink">{APP_NAME}</p>
      <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight">Before you fly</h1>
      <p className="mt-3 text-sm font-medium text-ink">Parent or student 12+ — once on this device.</p>

      <fieldset className="mt-6 space-y-2">
        <legend className="text-xs font-semibold uppercase tracking-widest text-ink">I am</legend>
        {(
          [
            ['parent', 'A parent or guardian'],
            ['student12', 'A student 12 or older'],
          ] as const
        ).map(([value, label]) => (
          <label
            key={value}
            className="panel flex min-h-11 items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold"
          >
            <input
              type="radio"
              name="role"
              checked={role === value}
              onChange={() => setRole(value)}
              className="h-5 w-5 accent-sky"
            />
            {label}
          </label>
        ))}
      </fieldset>

      <label className="mt-4 flex min-h-11 items-start gap-3 text-sm font-medium">
        <input
          type="checkbox"
          className="mt-1 h-5 w-5 accent-sky"
          checked={ageOk}
          onChange={(e) => setAgeOk(e.target.checked)}
        />
        <span>This device will not be used by a child under 13. Aero is not in Apple’s Kids Category.</span>
      </label>
      <label className="mt-2 flex min-h-11 items-start gap-3 text-sm font-medium">
        <input
          type="checkbox"
          className="mt-1 h-5 w-5 accent-sky"
          checked={notMedical}
          onChange={(e) => setNotMedical(e.target.checked)}
        />
        <span>
          Lab snapshots and readiness scores are practice feedback — not a medical diagnosis or an official school
          test.
        </span>
      </label>
      <label className="mt-2 flex min-h-11 items-start gap-3 text-sm font-medium">
        <input
          type="checkbox"
          className="mt-1 h-5 w-5 accent-sky"
          checked={localData}
          onChange={(e) => setLocalData(e.target.checked)}
        />
        <span>Name, photos, and progress stay on this device. I can export or delete them in Privacy Center.</span>
      </label>

      <button
        type="button"
        disabled={!ready}
        className="press mt-6 min-h-11 w-full rounded-xl bg-sky font-semibold text-chrome disabled:opacity-40"
        onClick={() => {
          if (!role) return
          acknowledgeCompliance(role)
        }}
      >
        Continue
      </button>

      <nav className="mt-6 flex flex-wrap justify-center gap-x-4 gap-y-2 text-sm font-semibold text-sky" aria-label="Legal">
        <Link to="/privacy" className="min-h-11 inline-flex items-center">
          Privacy Policy
        </Link>
        <Link to="/terms" className="min-h-11 inline-flex items-center">
          Terms of Use
        </Link>
        <Link to="/support" className="min-h-11 inline-flex items-center">
          Support
        </Link>
      </nav>
    </div>
  )
}
