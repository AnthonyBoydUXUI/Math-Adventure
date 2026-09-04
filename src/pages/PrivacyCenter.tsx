import { useState } from 'react'
import { Link } from 'react-router-dom'
import { downloadTextFile, serializeLocalArchive } from '../lib/archive.ts'
import { dayKey } from '../lib/hash.ts'
import { usePlayerStore } from '../store.ts'

export function PrivacyCenter() {
  const attempts = usePlayerStore((s) => s.attempts)
  const wipeLocalData = usePlayerStore((s) => s.wipeLocalData)
  const [confirm, setConfirm] = useState(false)
  const [exported, setExported] = useState(false)

  return (
    <div className="px-4 pb-8">
      <h1 className="font-display text-4xl font-semibold tracking-tight">Privacy Center</h1>
      <p className="mt-2 text-sm font-medium text-ink">
        Progress starts on this device. Sign in under Account to copy it to one cloud profile so phone, tablet, laptop,
        and the watch glance stay in sync — and so a site-data clear is not the end of the streak.
      </p>

      <div className="panel mt-4 rounded-2xl p-4">
        <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-ink">On this device</p>
        <p className="mt-1 font-display text-2xl font-semibold">{attempts.length} saved plays</p>
        <p className="mt-1 text-sm font-medium text-ink">
          Optional name, homework photos, and voice use stay local. Export includes that JSON blob.
        </p>
      </div>

      <button
        type="button"
        className="press mt-4 min-h-11 w-full rounded-xl bg-sky font-semibold text-chrome"
        onClick={() => {
          downloadTextFile(serializeLocalArchive(), `aero-export-${dayKey()}.json`)
          setExported(true)
        }}
      >
        Export my data
      </button>
      {exported ? <p className="mt-2 text-center text-xs font-medium text-leaf">Download started</p> : null}

      {!confirm ? (
        <button
          type="button"
          className="mt-3 min-h-11 w-full rounded-xl border border-goggle/40 font-semibold text-goggle"
          onClick={() => setConfirm(true)}
        >
          Delete all local data
        </button>
      ) : (
        <div className="mt-3 space-y-2">
          <p className="text-sm font-medium text-gold">This erases progress, photos, and the first-launch agreement on this device.</p>
          <button
            type="button"
            className="press min-h-11 w-full rounded-xl bg-goggle font-semibold text-white"
            onClick={wipeLocalData}
          >
            Yes, erase this device
          </button>
          <button type="button" className="min-h-11 w-full text-sm font-medium text-ink" onClick={() => setConfirm(false)}>
            Keep my data
          </button>
        </div>
      )}

      <Link to="/account" className="mt-4 inline-flex min-h-11 items-center text-sm font-semibold text-sky">
        Open Account + sync
      </Link>

      <nav className="mt-8 flex flex-wrap gap-x-4 gap-y-2 text-sm font-semibold text-sky" aria-label="Legal">
        <Link to="/privacy">Privacy Policy</Link>
        <Link to="/terms">Terms of Use</Link>
        <Link to="/support">Support</Link>
      </nav>
    </div>
  )
}
