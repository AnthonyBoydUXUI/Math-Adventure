/** Original Harbor cast — 6.75-head teen, not adult fashion proportion. */
export const CAST_HEADS = 6.75
export const CAST_HEAD = 0.2
export const CAST_HEIGHT = CAST_HEADS * CAST_HEAD

export const CAST_Y = {
  sole: 0,
  ankle: CAST_HEAD * 0.42,
  knee: CAST_HEAD * 2.05,
  hip: CAST_HEAD * 3.55,
  waist: CAST_HEAD * 4.15,
  chest: CAST_HEAD * 5.05,
  shoulder: CAST_HEAD * 5.45,
  chin: CAST_HEAD * 5.75,
  head: CAST_HEAD * 6.25,
  crown: CAST_HEIGHT,
} as const

export type CastRole = 'player' | 'coach' | 'guide'
export type CastMood = 'idle' | 'focus' | 'think' | 'cheer' | 'lockin'

export interface CastLook {
  role?: CastRole
  mood?: CastMood
  visor?: string
  suit?: string
  kicks?: string
  /** Optional production GLB. Empty = in-engine hero. */
  glbUrl?: string
}

export const CAST_PIPELINE = [
  'brief',
  'concept',
  'turnaround',
  'model',
  'retopo',
  'uv-material',
  'rig',
  'blendshapes',
  'animation',
  'optimize',
  'glb',
  'app',
] as const

export function visorHex(id = 'goggles-base') {
  if (id === 'goggles-gold') return '#f0d36a'
  if (id === 'goggles-paint') return '#7b8cff'
  return '#e4c24a'
}

export function suitHex(id = 'hoodie-base') {
  if (id === 'hoodie-court') return '#7a2e14'
  if (id === 'hoodie-signal') return '#0f5c56'
  return '#0e1a3a'
}

export function kickHex(id = 'kicks-base') {
  if (id === 'kicks-volt') return '#e4c24a'
  return '#f3efe6'
}
