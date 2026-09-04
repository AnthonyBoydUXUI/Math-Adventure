/** Original Harbor cast — 6.75-head teen, not adult fashion proportion. */
export const CAST_HEADS = 6.75
export const CAST_HEAD = 0.2
export const CAST_HEIGHT = CAST_HEADS * CAST_HEAD

export const CAST_Y = {
  sole: 0,
  ankle: CAST_HEAD * 0.5,
  knee: CAST_HEAD * 2.1,
  hip: CAST_HEAD * 3.6,
  waist: CAST_HEAD * 4.2,
  chest: CAST_HEAD * 5.1,
  shoulder: CAST_HEAD * 5.5,
  chin: CAST_HEAD * 5.8,
  head: CAST_HEAD * 6.3,
  crown: CAST_HEIGHT,
} as const

export type CastRole = 'player' | 'coach' | 'rival' | 'guide'
export type CastMood =
  | 'idle'
  | 'focus'
  | 'think'
  | 'cheer'
  | 'lockin'
  | 'surprised'
  | 'frustrated'
  | 'confident'

export interface CastLook {
  role?: CastRole
  mood?: CastMood
  visor?: string
  suit?: string
  kicks?: string
  /** Optional production GLB. Empty = in-engine sculpt. */
  glbUrl?: string
  quality?: 'close' | 'play' | 'far'
}

export const CAST_ROLES: CastRole[] = ['player', 'coach', 'rival', 'guide']

export const CAST_MOODS: CastMood[] = [
  'idle',
  'focus',
  'think',
  'cheer',
  'lockin',
  'surprised',
  'frustrated',
  'confident',
]

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

/** Locked player identity. Production GLB is still missing. */
export const CAST_APPROVED = 'signal' as const

export const CAST_MISSING = {
  productionGlb: true,
  lodSet: true,
  humanoidRig: true,
  speechBlendshapes: true,
  textures2k: true,
  turnaroundApproved: true,
} as const

export const SIGNAL = {
  bone: '#e8e4dc',
  navy: '#0e1a3a',
  gold: '#e4c24a',
  amber: '#c48a2a',
} as const

export function visorHex(id = 'goggles-base') {
  if (id === 'goggles-gold') return '#f0d36a'
  if (id === 'goggles-paint') return '#7b8cff'
  return SIGNAL.gold
}

export function suitHex(id = 'hoodie-base', role: CastRole = 'player') {
  if (role === 'coach') return '#14304e'
  if (role === 'guide') return '#3a2a68'
  if (role === 'rival') return '#7a2e14'
  if (id === 'hoodie-court') return '#7a2e14'
  if (id === 'hoodie-signal') return SIGNAL.bone
  if (role === 'player') return SIGNAL.bone
  return SIGNAL.bone
}

export function kickHex(id = 'kicks-base') {
  if (id === 'kicks-volt') return '#e4c24a'
  return '#f3efe6'
}
