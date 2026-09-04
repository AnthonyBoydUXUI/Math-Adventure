import { useGLTF } from '@react-three/drei'
import { CastFigure } from './CastFigure.tsx'
import type { CastLook } from './canon.ts'

/**
 * Production slot. Drop a rigged, optimized .glb here later
 * (Blender cleanup → humanoid rig → Meshopt/Draco).
 * Until then the in-engine hero is the source of truth.
 */
export function CastHero(props: CastLook) {
  const url = props.glbUrl || import.meta.env.VITE_CAST_PLAYER_GLB
  if (!url) return <CastFigure {...props} />
  return <GlbCast url={url} />
}

function GlbCast({ url }: { url: string }) {
  const { scene } = useGLTF(url)
  return <primitive object={scene} />
}
