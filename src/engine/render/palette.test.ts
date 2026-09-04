import { describe, expect, it } from 'vitest'
import { nightHex, sectorCode } from './palette.ts'

describe('game lighting palette', () => {
  it('desaturates sticker colors into night materials', () => {
    const night = nightHex('#ff6a2b')
    expect(night).toMatch(/^#[0-9a-f]{6}$/)
    expect(night).not.toBe('#ff6a2b')
  })

  it('uses sector codes instead of emoji', () => {
    expect(sectorCode('Ratio Runway')).toBe('RR')
    expect(sectorCode('Below-Zero District')).toBe('BZ')
    expect(sectorCode('Tip Market')).toBe('TM')
  })
})
