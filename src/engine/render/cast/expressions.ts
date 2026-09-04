import type { CastMood } from './canon.ts'

/** Signal face targets. */
export interface FaceExpr {
  lid: number
  squint: number
  browY: number
  browIn: number
  browTilt: number
  mouthOpen: number
  mouthWide: number
  lookX: number
  lookY: number
}

const base: FaceExpr = {
  lid: 1,
  squint: 0,
  browY: 0,
  browIn: 0,
  browTilt: 0,
  mouthOpen: 0.018,
  mouthWide: 0.22,
  lookX: 0.03,
  lookY: 0,
}

export const FACE: Record<CastMood, FaceExpr> = {
  idle: { ...base },
  confident: { ...base, lid: 0.92, mouthWide: 0.48, mouthOpen: 0.03, lookX: 0.1, browY: 0.02 },
  focus: { ...base, lid: 0.86, squint: 0.28, browIn: 0.42, lookY: -0.07, mouthWide: 0.1 },
  lockin: { ...base, lid: 0.84, squint: 0.22, browIn: 0.5, lookY: -0.05, mouthWide: 0.08 },
  think: { ...base, lid: 0.9, browY: 0.1, browTilt: 0.12, lookX: 0.16, lookY: 0.1, mouthOpen: 0.01 },
  surprised: { ...base, lid: 1.12, browY: 0.2, mouthOpen: 0.16, mouthWide: 0.18, lookY: 0.04 },
  frustrated: { ...base, lid: 0.72, squint: 0.4, browIn: 0.82, browY: -0.08, mouthOpen: 0.03, mouthWide: 0.05 },
  cheer: { ...base, lid: 0.28, squint: 0.55, mouthOpen: 0.2, mouthWide: 0.72, browY: 0.08 },
}

export function faceFor(mood: CastMood = 'idle') {
  return FACE[mood] ?? FACE.idle
}
