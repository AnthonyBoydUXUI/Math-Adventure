import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCloud } from '../cloud/CloudProvider.tsx'
import { SUPABASE_URL } from '../lib/supabase.ts'

export function AccountPage() {
  const cloud = useCloud()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState<string>()
  const [busy, setBusy] = useState(false)

  async function run(mode: 'in' | 'up') {
    setBusy(true)
    setMessage(undefined)
    const error = mode === 'in' ? await cloud.signIn(email, password) : await cloud.signUp(email, password)
    setMessage(error ?? (mode === 'up' ? 'Signed up. Progress will back up to this account.' : 'Signed in. Devices will share this profile.'))
    setBusy(false)
  }

  return (
    <div className="px-4 pb-8">
      <h1 className="type-pack text-5xl">Account</h1>
      <p className="mt-2 text-sm font-medium text-ink">
        One email, one profile. Phone, tablet, laptop, and the watch glance all read the same row. Clearing Safari on
        one device does not wipe the cloud copy.
      </p>

      {cloud.configured ? (
        <p className="mt-3 text-xs font-medium text-ink">
          Cloud project: {SUPABASE_URL.replace('https://', '')}
        </p>
      ) : (
        <p className="panel mt-4 rounded-sm p-4 text-sm font-medium text-gold">
          Supabase keys are missing in this build. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY, then run
          supabase/schema.sql.
        </p>
      )}

      <div className="panel mt-4 rounded-sm p-4">
        <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-ink">Status</p>
        <p className="mt-1 font-display text-2xl font-semibold">
          {cloud.user ? cloud.user.email : 'Signed out · local only'}
        </p>
        <p className="mt-1 text-sm font-medium text-ink">
          {cloud.status === 'synced' && cloud.lastSyncedAt
            ? `Last sync ${new Date(cloud.lastSyncedAt).toLocaleString()}`
            : cloud.status === 'syncing'
              ? 'Syncing…'
              : cloud.status === 'error'
                ? cloud.error
                : 'Practice still works offline. Sign in to back it up.'}
        </p>
      </div>

      {cloud.user ? (
        <div className="mt-4 grid gap-2">
          <button
            type="button"
            className="press min-h-11 rounded-xl bg-sky font-semibold text-chrome"
            onClick={() => void cloud.syncNow()}
          >
            Sync now
          </button>
          <button
            type="button"
            className="min-h-11 rounded-xl border border-white/15 font-semibold"
            onClick={() => void cloud.signOut()}
          >
            Sign out
          </button>
          <button
            type="button"
            className="min-h-11 text-sm font-medium text-goggle"
            onClick={() => void cloud.deleteCloudProfile()}
          >
            Delete cloud profile
          </button>
        </div>
      ) : (
        <form
          className="mt-4 grid gap-2"
          onSubmit={(e) => {
            e.preventDefault()
            void run('in')
          }}
        >
          <label className="text-xs font-semibold uppercase tracking-widest text-ink">
            Email
            <input
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 min-h-11 w-full rounded-xl border border-white/10 bg-white px-3 font-semibold"
            />
          </label>
          <label className="text-xs font-semibold uppercase tracking-widest text-ink">
            Password
            <input
              type="password"
              autoComplete="current-password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 min-h-11 w-full rounded-xl border border-white/10 bg-white px-3 font-semibold"
            />
          </label>
          <button
            type="submit"
            disabled={busy || !cloud.configured}
            className="press min-h-11 rounded-xl bg-sky font-semibold text-chrome disabled:opacity-40"
          >
            Sign in
          </button>
          <button
            type="button"
            disabled={busy || !cloud.configured}
            className="min-h-11 rounded-xl border border-white/15 font-semibold disabled:opacity-40"
            onClick={() => void run('up')}
          >
            Create account
          </button>
        </form>
      )}

      {message ? <p className="mt-3 text-sm font-medium text-navy">{message}</p> : null}

      <p className="mt-6 text-xs font-medium text-ink">
        Email is the only login. No ads, no tracking. Homework photos stay on the device that took them — the cloud
        profile holds progress, streak, and the left-off bookmark.
      </p>
      <Link to="/watch" className="mt-4 inline-flex min-h-11 items-center text-sm font-semibold text-sky">
        Open watch glance
      </Link>
    </div>
  )
}
