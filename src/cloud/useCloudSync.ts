import { useEffect, useRef, useState } from 'react'
import type { User } from '@supabase/supabase-js'
import { applyCloudSnapshot, isCloudSnapshot, mergeSnapshots, takeCloudSnapshot } from '../lib/cloud.ts'
import { getSupabase, isSupabaseConfigured, type ProfileRow } from '../lib/supabase.ts'
import { usePlayerStore } from '../store.ts'

export interface CloudState {
  configured: boolean
  user: User | null
  status: 'idle' | 'syncing' | 'synced' | 'error' | 'offline'
  lastSyncedAt: number | null
  error?: string
}

const EMPTY: CloudState = {
  configured: isSupabaseConfigured(),
  user: null,
  status: 'idle',
  lastSyncedAt: null,
}

export function useCloudSync(): CloudState & {
  signIn: (email: string, password: string) => Promise<string | undefined>
  signUp: (email: string, password: string) => Promise<string | undefined>
  signOut: () => Promise<void>
  syncNow: () => Promise<void>
  deleteCloudProfile: () => Promise<void>
} {
  const [state, setState] = useState<CloudState>(EMPTY)
  const ready = useRef(false)
  const userRef = useRef<User | null>(null)
  const lastActiveAt = usePlayerStore((s) => s.lastActiveAt)

  useEffect(() => {
    userRef.current = state.user
  }, [state.user])

  useEffect(() => {
    const sb = getSupabase()
    if (!sb) return
    let cancelled = false
    void sb.auth.getSession().then(({ data }) => {
      if (cancelled) return
      setState((s) => ({ ...s, configured: true, user: data.session?.user ?? null }))
      if (data.session?.user) void pullAndPush(data.session.user.id, setState, ready)
    })
    const { data } = sb.auth.onAuthStateChange((_event, session) => {
      setState((s) => ({ ...s, user: session?.user ?? null }))
      if (session?.user) void pullAndPush(session.user.id, setState, ready)
      else ready.current = false
    })
    const onVis = () => {
      if (document.visibilityState === 'visible' && ready.current && userRef.current) {
        void pullAndPush(userRef.current.id, setState, ready)
      }
    }
    document.addEventListener('visibilitychange', onVis)
    return () => {
      cancelled = true
      data.subscription.unsubscribe()
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [])

  useEffect(() => {
    const sb = getSupabase()
    const user = state.user
    if (!sb || !user || !ready.current) return
    const handle = window.setTimeout(() => {
      void pushProfile(user.id, setState)
    }, 1600)
    return () => window.clearTimeout(handle)
  }, [lastActiveAt, state.user])

  return {
    ...state,
    signIn: async (email, password) => {
      const sb = getSupabase()
      if (!sb) return 'Cloud sync is not configured.'
      const { error } = await sb.auth.signInWithPassword({ email: email.trim(), password })
      return error?.message
    },
    signUp: async (email, password) => {
      const sb = getSupabase()
      if (!sb) return 'Cloud sync is not configured.'
      const { data, error } = await sb.auth.signUp({ email: email.trim(), password })
      if (error) return error.message
      if (!data.session) return 'Account created. Confirm the email, then sign in on this device.'
      return undefined
    },
    signOut: async () => {
      await getSupabase()?.auth.signOut()
      setState((s) => ({ ...s, user: null, status: 'idle', lastSyncedAt: null }))
    },
    syncNow: async () => {
      if (!state.user) return
      await pullAndPush(state.user.id, setState, ready)
    },
    deleteCloudProfile: async () => {
      const sb = getSupabase()
      if (!sb || !state.user) return
      await sb.from('profiles').delete().eq('id', state.user.id)
      await sb.auth.signOut()
      setState((s) => ({ ...s, user: null, status: 'idle', lastSyncedAt: null }))
    },
  }
}

async function pullAndPush(
  userId: string,
  setState: (fn: (s: CloudState) => CloudState) => void,
  ready: { current: boolean },
) {
  const sb = getSupabase()
  if (!sb) return
  setState((s) => ({ ...s, status: 'syncing', error: undefined }))
  const { data, error } = await sb.from('profiles').select('id,payload,updated_at').eq('id', userId).maybeSingle()
  if (error) {
    setState((s) => ({ ...s, status: 'error', error: friendlyCloudError(error.message) }))
    return
  }
  const local = takeCloudSnapshot()
  const remotePayload = (data as ProfileRow | null)?.payload
  const remote = isCloudSnapshot(remotePayload) ? remotePayload : null
  const next = remote ? mergeSnapshots(local, remote) : local
  applyCloudSnapshot(next)
  await pushProfile(userId, setState, next)
  ready.current = true
}

async function pushProfile(
  userId: string,
  setState: (fn: (s: CloudState) => CloudState) => void,
  payload = takeCloudSnapshot(),
) {
  const sb = getSupabase()
  if (!sb) return
  const { error } = await sb.from('profiles').upsert({
    id: userId,
    payload,
    updated_at: new Date().toISOString(),
  })
  if (error) {
    setState((s) => ({ ...s, status: 'error', error: friendlyCloudError(error.message) }))
    return
  }
  setState((s) => ({ ...s, status: 'synced', lastSyncedAt: Date.now(), error: undefined }))
}

function friendlyCloudError(message: string) {
  if (/PGRST205|schema cache|Could not find the table/i.test(message)) {
    return 'Connected to Supabase, but public.profiles is missing. Run supabase/schema.sql in the SQL editor, then sign in again.'
  }
  return message
}
