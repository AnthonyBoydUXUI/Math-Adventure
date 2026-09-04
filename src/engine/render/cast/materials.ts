import { VINYL } from '../materials.ts'

/** Hybrid collectible: dimensional PBR, no pores, no flat cel. */
export const CAST_MAT = {
  skin: {
    color: '#c68642',
    roughness: 0.42,
    metalness: 0.02,
    sheen: 0.35,
    sheenColor: '#e8b892',
    sheenRoughness: 0.55,
    clearcoat: 0.08,
    clearcoatRoughness: 0.7,
  },
  sclera: { color: '#fff6ec', roughness: 0.12, metalness: 0.02 },
  iris: { color: '#1b2438', roughness: 0.18, metalness: 0.04 },
  hair: { color: '#161b2e', roughness: 0.28, metalness: 0.08, clearcoat: 0.55, clearcoatRoughness: 0.22 },
  suit: { roughness: 0.22, metalness: 0.12, clearcoat: 0.85, clearcoatRoughness: 0.16 },
  plate: { color: VINYL.bone, roughness: 0.2, metalness: 0.08, clearcoat: 0.7, clearcoatRoughness: 0.18 },
  shoe: { roughness: 0.18, metalness: 0.1, clearcoat: 0.9, clearcoatRoughness: 0.12 },
} as const
