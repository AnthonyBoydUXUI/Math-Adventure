/** Locked Signal and Harbor RS sheets, plus a top-down map per district. */

export const SIGNAL_SHEETS = {
  hero: '/sheets/signal/hero.jpg',
  turnaround: '/sheets/signal/turnaround.jpg',
  bust: '/sheets/signal/bust.jpg',
  expressions: '/sheets/signal/expressions.jpg',
  lineup: '/sheets/signal/lineup.jpg',
} as const

export const VEHICLE_SHEETS = {
  turnaround: '/sheets/vehicle/turnaround.jpg',
  hero: '/sheets/vehicle/hero.jpg',
} as const

export function worldMap(id: string) {
  return `/sheets/worlds/${id}.jpg`
}

export function worldThumb(id: string) {
  return `/sheets/worlds/${id}.thumb.jpg`
}
