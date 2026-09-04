import { describe, expect, it } from 'vitest'
import { SUPABASE_URL, isSupabaseConfigured } from './supabase.ts'

describe('Math Adventure Supabase project', () => {
  it('is wired to the provided publishable project', () => {
    expect(isSupabaseConfigured()).toBe(true)
    expect(SUPABASE_URL).toBe('https://gzufhifaxnwkxsdfnuhs.supabase.co')
  })
})
