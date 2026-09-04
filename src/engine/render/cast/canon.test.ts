import { describe, expect, it } from 'vitest'
import {
  CAST_APPROVED,
  CAST_HEAD,
  CAST_HEADS,
  CAST_HEIGHT,
  CAST_LOCKED,
  CAST_MOODS,
  CAST_PIPELINE,
  CAST_ROLES,
  CAST_Y,
  VEHICLE_APPROVED,
  VEHICLE_PAINT,
} from './canon.ts'
import { FACE } from './expressions.ts'
import { VINYL } from '../materials.ts'

describe('Harbor cast canon', () => {
  it('uses 6.5–7 head teen proportion, not adult 8-head', () => {
    expect(CAST_HEADS).toBeGreaterThanOrEqual(6.5)
    expect(CAST_HEADS).toBeLessThanOrEqual(7)
    expect(CAST_HEIGHT / CAST_HEAD).toBeCloseTo(CAST_HEADS)
    expect(CAST_Y.crown).toBeCloseTo(CAST_HEIGHT)
    expect(CAST_Y.head - CAST_Y.chin).toBeGreaterThan(CAST_HEAD * 0.4)
    expect(CAST_Y.shoulder - CAST_Y.hip).toBeGreaterThan(CAST_HEAD * 1.4)
    expect(CAST_Y.hip - CAST_Y.ankle).toBeGreaterThan(CAST_HEAD * 2.4)
  })

  it('shares one proportion language across the cast system', () => {
    expect(CAST_ROLES).toEqual(['player', 'coach', 'rival', 'guide'])
    expect(CAST_MOODS).toEqual(
      expect.arrayContaining(['focus', 'confident', 'think', 'surprised', 'frustrated', 'lockin', 'cheer']),
    )
    for (const mood of CAST_MOODS) {
      expect(FACE[mood].lid).toBeGreaterThan(0)
    }
  })

  it('locks Signal and the Harbor RS as the player and vehicle', () => {
    expect(CAST_APPROVED).toBe('signal')
    expect(VEHICLE_APPROVED).toBe('harbor-rs')
    expect(VEHICLE_PAINT).toBe('paint-volt')
    expect(CAST_LOCKED).toEqual({
      player: 'signal',
      vehicle: 'harbor-rs',
      paint: 'paint-volt',
      visor: 'goggles-base',
      suit: 'hoodie-base',
      kicks: 'kicks-base',
    })
    expect(VINYL.volt).toBe('#c4a24a')
    expect(CAST_PIPELINE.at(-1)).toBe('app')
  })
})
