import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Group } from 'three'

const PAINT: Record<string, string> = {
  'paint-volt': '#c4a800',
  'paint-night': '#1a2f4a',
  'paint-leaf': '#1b7a52',
}

const RIM: Record<string, string> = {
  'wheels-bronze': '#8a4b16',
  'wheels-gold': '#b8922a',
}

export function Chassis({
  paint = 'paint-volt',
  wheels = 'wheels-bronze',
  wing = 'wing-black',
}: {
  paint?: string
  wheels?: string
  wing?: string
}) {
  const ref = useRef<Group>(null)
  const body = PAINT[paint] ?? PAINT['paint-volt']
  const rim = RIM[wheels] ?? RIM['wheels-bronze']
  const spoiler = wing === 'wing-gold' ? '#9a7b1a' : '#141414'

  useFrame((state) => {
    if (!ref.current) return
    ref.current.position.y = 0.02 + Math.sin(state.clock.elapsedTime * 0.7) * 0.006
  })

  return (
    <group ref={ref} position={[0.85, 0.02, 0.25]} rotation={[0, -0.58, 0]} scale={1.05}>
      <mesh position={[0.04, 0.05, 0]} receiveShadow>
        <boxGeometry args={[2.08, 0.04, 0.9]} />
        <meshStandardMaterial color="#08090c" metalness={0.45} roughness={0.72} />
      </mesh>
      <mesh castShadow position={[0.02, 0.18, 0]}>
        <boxGeometry args={[1.98, 0.2, 0.84]} />
        <meshStandardMaterial color={body} metalness={0.82} roughness={0.2} />
      </mesh>
      <mesh castShadow position={[-0.18, 0.36, 0]}>
        <boxGeometry args={[0.78, 0.2, 0.76]} />
        <meshStandardMaterial color="#0a0c10" metalness={0.5} roughness={0.38} />
      </mesh>
      <mesh position={[0.22, 0.36, 0]}>
        <boxGeometry args={[0.42, 0.16, 0.72]} />
        <meshStandardMaterial color="#4d7d96" metalness={0.12} roughness={0.06} transparent opacity={0.42} />
      </mesh>
      <mesh castShadow position={[0.74, 0.2, 0]}>
        <boxGeometry args={[0.48, 0.1, 0.8]} />
        <meshStandardMaterial color={body} metalness={0.84} roughness={0.18} />
      </mesh>
      <mesh position={[1.02, 0.08, 0]}>
        <boxGeometry args={[0.2, 0.03, 0.92]} />
        <meshStandardMaterial color="#111318" metalness={0.55} roughness={0.4} />
      </mesh>
      <mesh position={[1.02, 0.17, 0.3]}>
        <boxGeometry args={[0.05, 0.045, 0.16]} />
        <meshStandardMaterial color="#f4f8ff" emissive="#d7e8ff" emissiveIntensity={1.8} />
      </mesh>
      <mesh position={[1.02, 0.17, -0.3]}>
        <boxGeometry args={[0.05, 0.045, 0.16]} />
        <meshStandardMaterial color="#f4f8ff" emissive="#d7e8ff" emissiveIntensity={1.8} />
      </mesh>
      <mesh position={[-0.96, 0.2, 0.28]}>
        <boxGeometry args={[0.04, 0.04, 0.2]} />
        <meshStandardMaterial color="#ff2a3a" emissive="#ff1a33" emissiveIntensity={1.4} />
      </mesh>
      <mesh position={[-0.96, 0.2, -0.28]}>
        <boxGeometry args={[0.04, 0.04, 0.2]} />
        <meshStandardMaterial color="#ff2a3a" emissive="#ff1a33" emissiveIntensity={1.4} />
      </mesh>
      <mesh castShadow position={[-0.94, 0.46, 0]}>
        <boxGeometry args={[0.3, 0.035, 0.96]} />
        <meshStandardMaterial color={spoiler} metalness={0.7} roughness={0.28} />
      </mesh>
      <mesh position={[-0.86, 0.32, 0.34]}>
        <boxGeometry args={[0.035, 0.24, 0.035]} />
        <meshStandardMaterial color="#111" metalness={0.5} roughness={0.4} />
      </mesh>
      <mesh position={[-0.86, 0.32, -0.34]}>
        <boxGeometry args={[0.035, 0.24, 0.035]} />
        <meshStandardMaterial color="#111" metalness={0.5} roughness={0.4} />
      </mesh>
      <mesh position={[0.02, 0.12, 0.43]}>
        <boxGeometry args={[1.6, 0.06, 0.04]} />
        <meshStandardMaterial color="#0d0f13" metalness={0.4} roughness={0.5} />
      </mesh>
      <mesh position={[0.02, 0.12, -0.43]}>
        <boxGeometry args={[1.6, 0.06, 0.04]} />
        <meshStandardMaterial color="#0d0f13" metalness={0.4} roughness={0.5} />
      </mesh>
      {(
        [
          [0.58, 0.36],
          [0.58, -0.36],
          [-0.58, 0.36],
          [-0.58, -0.36],
        ] as const
      ).map(([x, z]) => (
        <group key={`${x}:${z}`} position={[x, 0.11, z]} rotation={[0, 0, Math.PI / 2]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.12, 0.12, 0.1, 16]} />
            <meshStandardMaterial color="#0b0b0b" metalness={0.45} roughness={0.42} />
          </mesh>
          <mesh>
            <cylinderGeometry args={[0.07, 0.07, 0.11, 12]} />
            <meshStandardMaterial color={rim} metalness={0.88} roughness={0.18} />
          </mesh>
        </group>
      ))}
    </group>
  )
}
