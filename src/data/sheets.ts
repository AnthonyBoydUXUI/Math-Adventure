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
  /** Top-down Harbor RS cut from the Sky Harbor courtyard, not an SVG stand-in. */
  mapRs: '/sheets/vehicle/map-rs.png',
} as const

export function worldMap(id: string) {
  return `/sheets/worlds/${id}.jpg`
}

/** Live drive uses a Harbor map with the painted car removed so only the sprite moves. */
export function worldLiveMap(id: string) {
  if (id === 'harbor') return '/sheets/worlds/harbor.live.jpg'
  return worldMap(id)
}

export function worldThumb(id: string) {
  return `/sheets/worlds/${id}.thumb.jpg`
}
