import { Component, type ReactNode } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { ContactShadows, Grid, MeshReflectorMaterial } from '@react-three/drei'
import { useRef } from 'react'
import type { PerspectiveCamera } from 'three'
import { Chassis } from './Chassis.tsx'
import { DistrictKit } from './DistrictKit.tsx'
import { nightHex } from './palette.ts'

function CameraDrift() {
  const t = useRef(0)
  useFrame((state, delta) => {
    t.current += delta
    const cam = state.camera as PerspectiveCamera
    cam.position.x = 4.9 + Math.sin(t.current * 0.16) * 0.28
    cam.position.y = 2.15 + Math.sin(t.current * 0.1) * 0.05
    cam.position.z = 5.35
    cam.lookAt(0.15, 0.22, 0)
  })
  return null
}

export function GameViewport({
  districtId,
  color,
  paint,
  wheels,
  wing,
}: {
  districtId: string
  color: string
  paint?: string
  wheels?: string
  wing?: string
}) {
  const night = nightHex(color)
  return (
    <SceneGuard>
      <Canvas
        camera={{ position: [4.9, 2.15, 5.35], fov: 32, near: 0.1, far: 48 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
        shadows
        style={{ width: '100%', height: '100%' }}
      >
        <color attach="background" args={['#05070b']} />
        <fog attach="fog" args={['#05070b', 8, 22]} />
        <hemisphereLight args={['#9aafc4', '#0a0c10', 0.22]} />
        <ambientLight intensity={0.08} />
        <directionalLight
          position={[6, 9, 4]}
          intensity={1.45}
          color="#d7e1ee"
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <directionalLight position={[-6, 1.6, -3]} intensity={0.62} color={night} />
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
          <planeGeometry args={[48, 48]} />
          <MeshReflectorMaterial
            blur={[200, 80]}
            resolution={256}
            mixBlur={0.85}
            mixStrength={18}
            roughness={0.92}
            depthScale={0.8}
            minDepthThreshold={0.35}
            maxDepthThreshold={1.25}
            color="#0a0d12"
            metalness={0.55}
            mirror={0.15}
          />
        </mesh>
        <Grid
          args={[24, 24]}
          cellSize={0.5}
          cellThickness={0.35}
          sectionSize={2.5}
          sectionThickness={0.9}
          cellColor="#1a222d"
          sectionColor={night}
          fadeDistance={18}
          fadeStrength={1.35}
          position={[0, 0.012, 0]}
          infiniteGrid
        />
        <DistrictKit id={districtId} color={night} />
        <Chassis paint={paint} wheels={wheels} wing={wing} />
        <ContactShadows position={[0, 0.01, 0]} opacity={0.45} scale={14} blur={2.1} far={3.2} />
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
