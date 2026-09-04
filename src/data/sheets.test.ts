import { describe, expect, it } from 'vitest'
import { WORLDS } from './worlds.ts'
import { SIGNAL_SHEETS, VEHICLE_SHEETS, worldMap, worldThumb } from './sheets.ts'

describe('concept sheets', () => {
  it('gives every district a map and thumb', () => {
    for (const world of WORLDS) {
      expect(worldMap(world.id)).toBe(`/sheets/worlds/${world.id}.jpg`)
      expect(worldThumb(world.id)).toBe(`/sheets/worlds/${world.id}.thumb.jpg`)
    }
  })

  it('locks Signal and Harbor RS sheets', () => {
    expect(SIGNAL_SHEETS.turnaround).toBe('/sheets/signal/turnaround.jpg')
    expect(SIGNAL_SHEETS.hero).toBe('/sheets/signal/hero.jpg')
    expect(VEHICLE_SHEETS.turnaround).toBe('/sheets/vehicle/turnaround.jpg')
  })
})
