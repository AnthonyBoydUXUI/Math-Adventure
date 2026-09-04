import { Canvas } from '@react-three/fiber'
import { ContactShadows } from '@react-three/drei'
import { CastHero } from './GlbCast.tsx'
import type { CastLook } from './canon.ts'
import { StudioEnv } from './studio.tsx'
import { cn } from '../../../lib/cn.ts'

export function CastPortrait({
  className,
  framing = 'waist',
  ...look
}: CastLook & { className?: string; framing?: 'face' | 'waist' | 'full' | 'silhouette' }) {
  const cam =
    framing === 'face'
      ? ([0.26, 1.28, 0.55] as const)
      : framing === 'full'
        ? ([1.05, 0.82, 2.05] as const)
        : ([0.62, 1.02, 1.2] as const)
  const target =
    framing === 'face' ? ([0, 1.27, 0.12] as const) : framing === 'full' ? ([0, 0.68, 0] as const) : ([0, 0.95, 0] as const)
  const quality = framing === 'face' ? 'close' : look.quality ?? 'play'

  return (
    <div className={cn('relative overflow-hidden bg-[#05070b]', className)} aria-hidden>
      <Canvas
        camera={{ position: [...cam], fov: 26, near: 0.05, far: 20 }}
        dpr={[1, 1.6]}
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
        shadows="percentage"
        style={{ width: '100%', height: '100%' }}
        onCreated={({ camera }) => {
          camera.lookAt(target[0], target[1], target[2])
        }}
      >
        <color attach="background" args={[framing === 'silhouette' ? '#e8e4da' : '#05070b']} />
        <StudioEnv intensity={0.42} />
        <hemisphereLight args={['#c5d4e4', '#0a0c10', 0.3]} />
        <directionalLight position={[2.1, 3.2, 2.1]} intensity={1.55} color="#f4f7ff" castShadow />
        <directionalLight position={[-2.2, 1.1, -1.1]} intensity={0.5} color="#7eb6d6" />
        <directionalLight position={[0.15, 1.5, -2]} intensity={0.7} color="#e4c24a" />
        <CastHero {...look} quality={quality} />
        {framing !== 'silhouette' && (
          <ContactShadows position={[0, 0.01, 0]} opacity={0.48} scale={4} blur={1.8} far={1.6} />
        )}
      </Canvas>
    </div>
  )
}
