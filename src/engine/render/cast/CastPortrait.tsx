import { Canvas } from '@react-three/fiber'
import { ContactShadows } from '@react-three/drei'
import { CastHero } from './GlbCast.tsx'
import type { CastLook } from './canon.ts'
import { cn } from '../../../lib/cn.ts'

export function CastPortrait({
  className,
  framing = 'waist',
  ...look
}: CastLook & { className?: string; framing?: 'face' | 'waist' | 'full' }) {
  const cam =
    framing === 'face'
      ? ([0.42, 1.28, 0.85] as const)
      : framing === 'full'
        ? ([1.15, 0.85, 2.15] as const)
        : ([0.72, 1.05, 1.35] as const)
  const target = framing === 'face' ? ([0, 1.24, 0] as const) : ([0, 0.95, 0] as const)

  return (
    <div className={cn('relative overflow-hidden bg-[#05070b]', className)} aria-hidden>
      <Canvas
        camera={{ position: [...cam], fov: 28, near: 0.05, far: 20 }}
        dpr={[1, 1.6]}
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
        shadows="percentage"
        style={{ width: '100%', height: '100%' }}
        onCreated={({ camera }) => {
          camera.lookAt(target[0], target[1], target[2])
        }}
      >
        <color attach="background" args={['#05070b']} />
        <hemisphereLight args={['#c5d4e4', '#0a0c10', 0.28]} />
        <directionalLight position={[2.2, 3.4, 2]} intensity={1.7} color="#f2f6ff" castShadow />
        <directionalLight position={[-2.4, 1.2, -1.2]} intensity={0.55} color="#7eb6d6" />
        <directionalLight position={[0.2, 1.4, -2.2]} intensity={0.85} color="#e4c24a" />
        <CastHero {...look} />
        <ContactShadows position={[0, 0.01, 0]} opacity={0.5} scale={4} blur={1.8} far={1.6} />
      </Canvas>
    </div>
  )
}
