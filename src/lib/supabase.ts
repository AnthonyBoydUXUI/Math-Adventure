import { createClient, type SupabaseClient } from '@supabase/supabase-js'

/** Math Adventure project — publishable client key only. */
const PROJECT_URL = 'https://gzufhifaxnwkxsdfnuhs.supabase.co'
const PROJECT_PUBLISHABLE_KEY = 'sb_publishable_vSGhABIIIcFZq48la9UVbg_SHnN__b2'

export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || PROJECT_URL
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || PROJECT_PUBLISHABLE_KEY

export function isSupabaseConfigured() {
  return SUPABASE_URL.startsWith('https://') && SUPABASE_ANON_KEY.length > 20
}

let client: SupabaseClient | null = null

export function getSupabase(): SupabaseClient | null {
  if (!isSupabaseConfigured()) return null
  if (!client) {
    client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  }
  return client
}

export interface ProfileRow {
  id: string
  payload: unknown
  updated_at: string
}
