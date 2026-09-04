/** Percent coordinates on each courtyard sheet. Closed loops the Harbor RS drives. */

export interface RoutePoint {
  x: number
  y: number
}

export const WORLD_ROUTES: Record<string, RoutePoint[]> = {
  harbor: [
    { x: 50, y: 80 },
    { x: 50, y: 62 },
    { x: 50, y: 40 },
    { x: 64, y: 28 },
    { x: 76, y: 44 },
    { x: 70, y: 70 },
    { x: 58, y: 82 },
  ],
  market: [
    { x: 22, y: 70 },
    { x: 38, y: 52 },
    { x: 58, y: 38 },
    { x: 78, y: 30 },
    { x: 80, y: 54 },
    { x: 62, y: 72 },
    { x: 40, y: 80 },
  ],
  belowzero: [
    { x: 30, y: 72 },
    { x: 50, y: 58 },
    { x: 70, y: 42 },
    { x: 58, y: 26 },
    { x: 36, y: 34 },
    { x: 28, y: 54 },
  ],
  gallery: [
    { x: 24, y: 76 },
    { x: 40, y: 60 },
    { x: 56, y: 44 },
    { x: 74, y: 32 },
    { x: 78, y: 56 },
    { x: 60, y: 74 },
  ],
  gearworks: [
    { x: 28, y: 68 },
    { x: 46, y: 48 },
    { x: 68, y: 36 },
    { x: 76, y: 58 },
    { x: 58, y: 76 },
    { x: 36, y: 80 },
  ],
  bridge: [
    { x: 26, y: 72 },
    { x: 26, y: 50 },
    { x: 50, y: 48 },
    { x: 74, y: 50 },
    { x: 74, y: 30 },
    { x: 50, y: 28 },
    { x: 26, y: 32 },
  ],
  boundary: [
    { x: 20, y: 64 },
    { x: 40, y: 48 },
    { x: 62, y: 36 },
    { x: 82, y: 44 },
    { x: 74, y: 68 },
    { x: 48, y: 78 },
  ],
  plaza: [
    { x: 32, y: 74 },
    { x: 50, y: 58 },
    { x: 70, y: 42 },
    { x: 62, y: 26 },
    { x: 38, y: 30 },
    { x: 24, y: 52 },
  ],
  courtcrate: [
    { x: 30, y: 70 },
    { x: 50, y: 54 },
    { x: 72, y: 40 },
    { x: 68, y: 66 },
    { x: 48, y: 80 },
  ],
  arcade: [
    { x: 24, y: 60 },
    { x: 44, y: 40 },
    { x: 68, y: 28 },
    { x: 80, y: 50 },
    { x: 62, y: 72 },
    { x: 36, y: 78 },
  ],
  station: [
    { x: 22, y: 68 },
    { x: 42, y: 50 },
    { x: 64, y: 36 },
    { x: 78, y: 54 },
    { x: 60, y: 74 },
  ],
  groundlab: [
    { x: 28, y: 70 },
    { x: 48, y: 52 },
    { x: 70, y: 38 },
    { x: 74, y: 62 },
    { x: 52, y: 78 },
  ],
  peak: [
    { x: 34, y: 76 },
    { x: 46, y: 58 },
    { x: 60, y: 40 },
    { x: 72, y: 28 },
    { x: 58, y: 22 },
    { x: 40, y: 36 },
    { x: 28, y: 58 },
  ],
}
