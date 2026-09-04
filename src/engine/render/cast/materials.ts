import { VINYL } from '../materials.ts'

/** Hybrid collectible: dimensional PBR, no pores, no flat cel. */
export const CAST_MAT = {
  skin: {
    color: '#c17a48',
    roughness: 0.46,
    metalness: 0.02,
    sheen: 0.4,
    sheenColor: '#e8b892',
    sheenRoughness: 0.58,
    clearcoat: 0.06,
    clearcoatRoughness: 0.78,
  },
  sclera: { color: '#fff4ea', roughness: 0.1, metalness: 0.01, clearcoat: 0.35, clearcoatRoughness: 0.2 },
  iris: { color: '#c48a2a', roughness: 0.22, metalness: 0.04 },
  hair: { color: '#12161c', roughness: 0.32, metalness: 0.06, clearcoat: 0.42, clearcoatRoughness: 0.28 },
  suit: { roughness: 0.48, metalness: 0.04, sheen: 0.22, sheenColor: '#8aa0c4', sheenRoughness: 0.7 },
  plate: { color: VINYL.bone, roughness: 0.28, metalness: 0.06, clearcoat: 0.45, clearcoatRoughness: 0.28 },
  shoe: { roughness: 0.22, metalness: 0.08, clearcoat: 0.72, clearcoatRoughness: 0.18 },
  gum: { color: '#b8894a', roughness: 0.42, metalness: 0.04 },
} as const
