import { describe, expect, it } from 'vitest'
import { isMuted, setMuted } from './sfx.ts'

describe('sound mixer', () => {
  it('toggles mute for the hobby-safe Web Audio bed', () => {
    setMuted(true)
    expect(isMuted()).toBe(true)
    setMuted(false)
    expect(isMuted()).toBe(false)
  })
})
