import { Component, type ReactNode, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { ContactShadows, Grid } from '@react-three/drei'
import type { PerspectiveCamera } from 'three'
import { CastHero } from './cast/GlbCast.tsx'
import type { CastMood } from './cast/canon.ts'
import { Chassis } from './Chassis.tsx'
import { DistrictKit } from './DistrictKit.tsx'
import { nightHex } from './palette.ts'

function CameraDrift() {
  const t = useRef(0)
  useFrame((state, delta) => {
    t.current += delta
    const cam = state.camera as PerspectiveCamera
    cam.position.x = 2.55 + Math.sin(t.current * 0.14) * 0.18
    cam.position.y = 1.05 + Math.sin(t.current * 0.09) * 0.04
    cam.position.z = 3.15
    cam.lookAt(-0.15, 0.72, 0.12)
  })
  return null
}

export function GameViewport({
  districtId,
  color,
  paint,
  wheels,
  wing,
  visor,
  suit,
  kicks,
  mood = 'idle',
}: {
  districtId: string
  color: string
  paint?: string
  wheels?: string
  wing?: string
  visor?: string
  suit?: string
  kicks?: string
  mood?: CastMood
}) {
  const night = nightHex(color)
  return (
    <SceneGuard>
      <Canvas
        camera={{ position: [2.55, 1.05, 3.15], fov: 30, near: 0.08, far: 48 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
        shadows="percentage"
        style={{ width: '100%', height: '100%' }}
      >
        <color attach="background" args={['#05070b']} />
        <fog attach="fog" args={['#05070b', 7, 18]} />
        <hemisphereLight args={['#c5d4e4', '#0a0c10', 0.26]} />
        <ambientLight intensity={0.1} />
        <directionalLight
          position={[4.2, 6.2, 3.4]}
          intensity={1.55}
          color="#f2f6ff"
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <directionalLight position={[-3.8, 1.4, -2.2]} intensity={0.55} color={night} />
        <directionalLight position={[0.4, 1.8, -2.6]} intensity={0.7} color="#e4c24a" />
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
          <planeGeometry args={[48, 48]} />
          <meshStandardMaterial color="#0a0d12" metalness={0.35} roughness={0.88} />
        </mesh>
        <Grid
          args={[24, 24]}
          cellSize={0.5}
          cellThickness={0.35}
          sectionSize={2.5}
          sectionThickness={0.9}
          cellColor="#1a222d"
          sectionColor={night}
          fadeDistance={16}
          fadeStrength={1.35}
          position={[0, 0.012, 0]}
          infiniteGrid
        />
        <DistrictKit id={districtId} color={night} />
        <group position={[-0.62, 0, 0.28]}>
          <CastHero mood={mood} visor={visor} suit={suit} kicks={kicks} />
        </group>
        <Chassis paint={paint} wheels={wheels} wing={wing} />
        <ContactShadows position={[0, 0.01, 0]} opacity={0.5} scale={14} blur={2.1} far={3.2} />
        <CameraDrift />
      </Canvas>
    </SceneGuard>
  )
}

class SceneGuard extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  render() {
    if (this.state.failed) return <div className="h-full min-h-[160px] w-full bg-[#05070b]" />
    return this.props.children
  }
}
