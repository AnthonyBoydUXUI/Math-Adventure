import { useGLTF } from '@react-three/drei'
import { CastFigure } from './CastFigure.tsx'
import type { CastLook } from './canon.ts'

/**
 * Production slot. A sculpted, retopo'd, rigged .glb is still missing.
 * Drop it at public/cast/player.glb (or VITE_CAST_PLAYER_GLB) after
 * Blender cleanup → humanoid rig → Meshopt/Draco. Until then the
 * in-engine 6.75-head sculpt is the stand-in — not a camera/CSS hide.
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
