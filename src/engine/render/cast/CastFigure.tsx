import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Group } from 'three'
import { CAST_HEAD, CAST_Y, kickHex, suitHex, visorHex, type CastLook, type CastMood } from './canon.ts'
import { CAST_MAT } from './materials.ts'

const H = CAST_HEAD

function Skin() {
  return <meshPhysicalMaterial {...CAST_MAT.skin} />
}

function Eye({ side, mood }: { side: -1 | 1; mood: CastMood }) {
  const open = mood === 'cheer' ? 0.86 : mood === 'think' ? 0.72 : 1
  const x = side * H * 0.22
  return (
    <group position={[x, H * 0.02, H * 0.38]} scale={[1, open, 1]}>
      <mesh castShadow>
        <sphereGeometry args={[H * 0.13, 20, 16]} />
        <meshPhysicalMaterial {...CAST_MAT.sclera} />
      </mesh>
      <mesh position={[0, H * 0.01, H * 0.07]}>
        <sphereGeometry args={[H * 0.08, 18, 14]} />
        <meshPhysicalMaterial {...CAST_MAT.iris} />
      </mesh>
      <mesh position={[0, 0, H * 0.1]}>
        <sphereGeometry args={[H * 0.035, 12, 10]} />
        <meshStandardMaterial color="#07080c" roughness={0.25} />
      </mesh>
      <mesh position={[H * 0.03, H * 0.035, H * 0.12]}>
        <sphereGeometry args={[H * 0.018, 10, 8]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.8} />
      </mesh>
      <mesh position={[0, H * 0.1, H * 0.02]} rotation={[0.35, 0, 0]}>
        <boxGeometry args={[H * 0.26, H * 0.05, H * 0.08]} />
        <meshPhysicalMaterial {...CAST_MAT.skin} />
      </mesh>
      <mesh position={[0, H * 0.16, H * 0.04]} rotation={[0.15, 0, side * -0.12]}>
        <boxGeometry args={[H * 0.22, H * 0.035, H * 0.05]} />
        <meshStandardMaterial color="#1a1420" roughness={0.55} />
      </mesh>
    </group>
  )
}

function Hair({ accent }: { accent: string }) {
  return (
    <group>
      <mesh castShadow position={[0, H * 0.08, -H * 0.04]}>
        <sphereGeometry args={[H * 0.5, 24, 18]} />
        <meshPhysicalMaterial {...CAST_MAT.hair} />
      </mesh>
      <mesh castShadow position={[0, H * 0.22, H * 0.02]} rotation={[0.35, 0, 0]}>
        <sphereGeometry args={[H * 0.42, 20, 16]} />
        <meshPhysicalMaterial {...CAST_MAT.hair} />
      </mesh>
      <mesh castShadow position={[-H * 0.28, H * 0.02, H * 0.12]} rotation={[0.2, 0.4, -0.3]}>
        <capsuleGeometry args={[H * 0.14, H * 0.22, 8, 12]} />
        <meshPhysicalMaterial {...CAST_MAT.hair} />
      </mesh>
      <mesh castShadow position={[H * 0.32, H * 0.08, 0]} rotation={[0.1, -0.5, 0.45]}>
        <capsuleGeometry args={[H * 0.12, H * 0.28, 8, 12]} />
        <meshPhysicalMaterial
          color={accent}
          roughness={0.22}
          metalness={0.18}
          clearcoat={0.7}
          clearcoatRoughness={0.18}
        />
      </mesh>
    </group>
  )
}

function Head({ mood, visor }: { mood: CastMood; visor: string }) {
  const mouth = mood === 'cheer' ? 0.08 : mood === 'think' ? 0.01 : 0.035
  return (
    <group position={[0, CAST_Y.head, 0]}>
      <mesh castShadow>
        <sphereGeometry args={[H * 0.48, 28, 22]} />
        <Skin />
      </mesh>
      <mesh position={[0, H * 0.06, H * 0.12]} scale={[0.92, 1.02, 0.88]}>
        <sphereGeometry args={[H * 0.4, 24, 18]} />
        <Skin />
      </mesh>
      <mesh position={[0, -H * 0.08, H * 0.4]} rotation={[0.4, 0, 0]}>
        <boxGeometry args={[H * 0.1, H * 0.08, H * 0.08]} />
        <Skin />
      </mesh>
      <Eye side={-1} mood={mood} />
      <Eye side={1} mood={mood} />
      <mesh position={[0, -H * 0.18, H * 0.4]} rotation={[mood === 'cheer' ? 0.2 : 0, 0, 0]}>
        <capsuleGeometry args={[H * 0.03, H * mouth, 6, 10]} />
        <meshStandardMaterial color="#3a2418" roughness={0.5} />
      </mesh>
      <mesh position={[0, H * 0.08, H * 0.42]}>
        <boxGeometry args={[H * 0.72, H * 0.07, H * 0.08]} />
        <meshStandardMaterial color="#0a0e1a" roughness={0.35} />
      </mesh>
      <mesh position={[0, H * 0.08, H * 0.46]}>
        <boxGeometry args={[H * 0.64, H * 0.035, H * 0.04]} />
        <meshPhysicalMaterial
          color={visor}
          roughness={0.12}
          metalness={0.35}
          clearcoat={1}
          clearcoatRoughness={0.08}
          emissive={visor}
          emissiveIntensity={0.12}
        />
      </mesh>
      <Hair accent={visor} />
    </group>
  )
}

function Limb({
  pos,
  rot,
  len,
  rad,
  suit,
}: {
  pos: [number, number, number]
  rot?: [number, number, number]
  len: number
  rad: number
  suit?: string
}) {
  return (
    <mesh castShadow position={pos} rotation={rot}>
      <capsuleGeometry args={[rad, len, 8, 12]} />
      {suit ? (
        <meshPhysicalMaterial color={suit} {...CAST_MAT.suit} />
      ) : (
        <Skin />
      )}
    </mesh>
  )
}

export function CastFigure({
  role = 'player',
  mood = 'idle',
  visor = 'goggles-base',
  suit = 'hoodie-base',
  kicks = 'kicks-base',
}: CastLook) {
  const root = useRef<Group>(null)
  const v = visorHex(visor)
  const s = role === 'coach' ? '#14304e' : role === 'guide' ? '#3a2a68' : suitHex(suit)
  const k = kickHex(kicks)

  useFrame((state) => {
    const g = root.current
    if (!g) return
    const t = state.clock.elapsedTime
    const breath = Math.sin(t * 1.6) * 0.008
    const sway = Math.sin(t * 0.9) * 0.02
    g.position.y = breath
    g.rotation.y = -0.55 + sway * 0.15
    const torso = g.children[0]
    if (torso) torso.rotation.z = sway * 0.08
    if (mood === 'cheer') {
      g.rotation.z = Math.sin(t * 6) * 0.04
    }
  })

  const armCheer = mood === 'cheer' ? -2.2 : mood === 'think' ? -0.9 : -0.35
  const armFocus = mood === 'lockin' || mood === 'focus' ? -0.7 : -0.28
  const lean = mood === 'lockin' || mood === 'focus' ? 0.12 : mood === 'think' ? 0.06 : 0

  return (
    <group ref={root} rotation={[0, -0.55, 0]} position={[0, 0, 0]}>
      <group rotation={[lean, 0, 0]}>
        <mesh castShadow position={[0, CAST_Y.chest, 0]}>
          <capsuleGeometry args={[H * 0.28, H * 0.72, 10, 16]} />
          <meshPhysicalMaterial color={s} {...CAST_MAT.suit} />
        </mesh>
        <mesh castShadow position={[0, CAST_Y.chest + H * 0.08, H * 0.16]}>
          <boxGeometry args={[H * 0.42, H * 0.28, H * 0.08]} />
          <meshPhysicalMaterial {...CAST_MAT.plate} />
        </mesh>
        <mesh position={[0, CAST_Y.chest + H * 0.08, H * 0.21]}>
          <boxGeometry args={[H * 0.22, H * 0.05, H * 0.02]} />
          <meshPhysicalMaterial color={v} roughness={0.2} metalness={0.3} />
        </mesh>
        <Limb pos={[-H * 0.42, CAST_Y.shoulder, 0]} rot={[0.15, 0, armCheer]} len={H * 0.55} rad={H * 0.1} suit={s} />
        <Limb pos={[H * 0.42, CAST_Y.shoulder, 0]} rot={[0.15, 0, armFocus]} len={H * 0.55} rad={H * 0.1} suit={s} />
        <mesh castShadow position={[-H * 0.55, CAST_Y.chest - H * 0.55, H * 0.08]} rotation={[0.4, 0, 0.2]}>
          <sphereGeometry args={[H * 0.13, 14, 12]} />
          <Skin />
        </mesh>
        <mesh castShadow position={[H * 0.52, CAST_Y.chest - H * 0.5, H * 0.12]} rotation={[0.2, 0, -0.15]}>
          <sphereGeometry args={[H * 0.13, 14, 12]} />
          <Skin />
        </mesh>
        <Head mood={mood} visor={v} />
      </group>
      <Limb pos={[-H * 0.16, CAST_Y.knee, 0]} rot={[0.08, 0, 0.06]} len={H * 0.62} rad={H * 0.11} />
      <Limb pos={[H * 0.16, CAST_Y.knee, 0]} rot={[-0.04, 0, -0.05]} len={H * 0.62} rad={H * 0.11} />
      <mesh castShadow position={[-H * 0.18, CAST_Y.ankle, H * 0.08]}>
        <boxGeometry args={[H * 0.28, H * 0.16, H * 0.42]} />
        <meshPhysicalMaterial color={k} {...CAST_MAT.shoe} />
      </mesh>
      <mesh castShadow position={[H * 0.18, CAST_Y.ankle, H * 0.08]}>
        <boxGeometry args={[H * 0.28, H * 0.16, H * 0.42]} />
        <meshPhysicalMaterial color={k} {...CAST_MAT.shoe} />
      </mesh>
    </group>
  )
}
