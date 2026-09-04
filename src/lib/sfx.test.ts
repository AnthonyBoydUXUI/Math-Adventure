import { describe, expect, it } from 'vitest'
import { WORLDS } from '../data/worlds.ts'
import { isMuted, setMuted, WORLD_SCORES, worldScore } from './sfx.ts'

describe('sound mixer', () => {
  it('toggles mute for the hobby-safe Web Audio bed', () => {
    setMuted(true)
    expect(isMuted()).toBe(true)
    setMuted(false)
    expect(isMuted()).toBe(false)
  })

  it('gives every district its own motif and pulse', () => {
    for (const world of WORLDS) {
      expect(WORLD_SCORES[world.id], world.id).toBeDefined()
    }
    const signatures = Object.values(WORLD_SCORES).map((score) => `${score.motif}:${score.pulseMs}`)
    expect(new Set(signatures).size).toBe(signatures.length)
    expect(worldScore('unknown-district').motif).toBe('runway')
  })
})
