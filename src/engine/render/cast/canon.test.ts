import { describe, expect, it } from 'vitest'
import { CAST_HEAD, CAST_HEADS, CAST_HEIGHT, CAST_PIPELINE, CAST_Y } from './canon.ts'

describe('Harbor cast canon', () => {
  it('uses 6.5–7 head teen proportion, not adult 8-head', () => {
    expect(CAST_HEADS).toBeGreaterThanOrEqual(6.5)
    expect(CAST_HEADS).toBeLessThanOrEqual(7)
    expect(CAST_HEIGHT / CAST_HEAD).toBeCloseTo(CAST_HEADS)
    expect(CAST_Y.crown).toBeCloseTo(CAST_HEIGHT)
    expect(CAST_Y.head - CAST_Y.chin).toBeGreaterThan(CAST_HEAD * 0.4)
  })

  it('keeps a provider-neutral GLB pipeline, not an engine lock-in', () => {
    expect(CAST_PIPELINE).toContain('glb')
    expect(CAST_PIPELINE).toContain('rig')
    expect(CAST_PIPELINE.at(-1)).toBe('app')
  })
})
