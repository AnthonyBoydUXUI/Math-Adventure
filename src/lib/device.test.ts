import { describe, expect, it } from 'vitest'
import { surfaceFromSize } from './device.ts'

describe('multi-device surfaces', () => {
  it('classifies watch, phone, tablet, and desktop', () => {
    expect(surfaceFromSize(320, 360)).toBe('watch')
    expect(surfaceFromSize(390, 844)).toBe('phone')
    expect(surfaceFromSize(820, 1180)).toBe('tablet')
    expect(surfaceFromSize(1440, 900)).toBe('desktop')
  })
})
