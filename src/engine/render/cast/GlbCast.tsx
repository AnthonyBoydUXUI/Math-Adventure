import { useGLTF } from '@react-three/drei'
import { CastFigure } from './CastFigure.tsx'
import type { CastLook } from './canon.ts'

/**
 * Signal is the player. CastFigure is the character.
 * A .glb at public/cast/player.glb or VITE_CAST_PLAYER_GLB is an optional swap.
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
