import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Vector2, type Group } from 'three'
import { CAST_HEAD, CAST_Y, kickHex, suitHex, visorHex, type CastLook, type CastMood, type CastRole } from './canon.ts'
import { faceFor } from './expressions.ts'
import { CAST_MAT } from './materials.ts'

const H = CAST_HEAD
const SEG = { hi: 20, mid: 14, lo: 8 } as const

function segs(quality: CastLook['quality']) {
  if (quality === 'far') return SEG.lo
  if (quality === 'close') return SEG.hi
  return SEG.mid
}

function Skin() {
  return <meshPhysicalMaterial {...CAST_MAT.skin} />
}

function headProfile() {
  return [
    [0.02, 0.5],
    [0.22, 0.48],
    [0.38, 0.38],
    [0.45, 0.18],
    [0.46, 0.02],
    [0.42, -0.12],
    [0.34, -0.26],
    [0.2, -0.38],
    [0.1, -0.44],
    [0.06, -0.5],
  ].map(([x, y]) => new Vector2(x * H, y * H))
}

function hoodieProfile() {
  return [
    [0.16, 0.38],
    [0.34, 0.3],
    [0.36, 0.12],
    [0.3, -0.08],
    [0.26, -0.28],
    [0.28, -0.42],
    [0.24, -0.46],
  ].map(([x, y]) => new Vector2(x * H * 1.05, y * H * 1.15))
}

function shortsProfile() {
  return [
    [0.26, 0.16],
    [0.32, 0.04],
    [0.3, -0.18],
    [0.28, -0.28],
  ].map(([x, y]) => new Vector2(x * H, y * H))
}

function Eye({
  side,
  mood,
  role,
  quality,
}: {
  side: -1 | 1
  mood: CastMood
  role: CastRole
  quality: CastLook['quality']
}) {
  const expr = faceFor(mood)
  const n = segs(quality)
  const shape =
    role === 'coach' ? ([1.82, 0.92, 0.36] as const) : role === 'rival' ? ([1.58, 1.18, 0.4] as const) : ([1.7, 1.1, 0.38] as const)
  const x = side * H * 0.17
  if (quality === 'far') {
    return (
      <mesh position={[x, H * 0.04, H * 0.34]} scale={[shape[0], shape[1] * expr.lid, shape[2]]}>
        <sphereGeometry args={[H * 0.09, 8, 6]} />
        <meshStandardMaterial color="#1a120c" />
      </mesh>
    )
  }
  return (
    <group position={[x, H * 0.03, H * 0.35]}>
      <mesh scale={[shape[0], shape[1] * Math.min(1.15, expr.lid), shape[2]]} castShadow>
        <sphereGeometry args={[H * 0.095, n, n - 2]} />
        <meshPhysicalMaterial {...CAST_MAT.sclera} />
      </mesh>
      <mesh position={[expr.lookX * side * H * 0.04, expr.lookY * H * 0.04, H * 0.034]} rotation={[0, 0, 0]}>
        <circleGeometry args={[H * 0.072, n + 4]} />
        <meshPhysicalMaterial {...CAST_MAT.iris} />
      </mesh>
      <mesh position={[expr.lookX * side * H * 0.04, expr.lookY * H * 0.04, H * 0.038]}>
        <circleGeometry args={[H * 0.032, 12]} />
        <meshStandardMaterial color="#0a0705" roughness={0.3} />
      </mesh>
      <mesh position={[H * 0.028 * side, H * 0.03, H * 0.042]}>
        <sphereGeometry args={[H * 0.016, 10, 8]} />
        <meshStandardMaterial color="#ffffff" emissive="#fff6e8" emissiveIntensity={0.9} />
      </mesh>
      <mesh position={[-H * 0.012 * side, -H * 0.018, H * 0.04]}>
        <sphereGeometry args={[H * 0.008, 8, 6]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.35} />
      </mesh>
      <mesh
        position={[0, H * 0.075 - expr.squint * H * 0.02, H * 0.02]}
        rotation={[0.62 - expr.lid * 0.12, 0, side * -0.1]}
        scale={[1.05, 0.85 + (1 - expr.lid) * 0.8, 1]}
      >
        <boxGeometry args={[H * 0.3, H * 0.055, H * 0.1]} />
        <Skin />
      </mesh>
      <mesh position={[0, H * 0.082, H * 0.03]} rotation={[0.4, 0, side * -0.08]} scale={[1, 0.7 + (1 - expr.lid), 1]}>
        <boxGeometry args={[H * 0.28, H * 0.018, H * 0.04]} />
        <meshStandardMaterial color="#1a1420" roughness={0.45} />
      </mesh>
      <mesh
        position={[0, H * 0.15 + expr.browY * H, H * 0.06]}
        rotation={[0.18, 0, side * (-0.16 - expr.browTilt) + expr.browIn * side * 0.2]}
      >
        <boxGeometry args={[H * 0.2, H * 0.028, H * 0.045]} />
        <meshStandardMaterial color="#161018" roughness={0.5} />
      </mesh>
    </group>
  )
}

function Hair({ role, accent, quality }: { role: CastRole; accent: string; quality: CastLook['quality'] }) {
  const n = segs(quality)
  const gold = (
    <meshPhysicalMaterial
      color={accent}
      roughness={0.2}
      metalness={0.22}
      clearcoat={0.75}
      clearcoatRoughness={0.16}
    />
  )
  return (
    <group>
      <mesh castShadow position={[0, H * 0.22, -H * 0.06]} scale={[1.15, 0.62, 1.05]}>
        <sphereGeometry args={[H * 0.38, n, n - 2]} />
        <meshPhysicalMaterial {...CAST_MAT.hair} />
      </mesh>
      <mesh castShadow position={[-H * 0.08, H * 0.16, H * 0.16]} rotation={[0.55, 0.35, -0.35]} scale={[1.15, 0.55, 0.85]}>
        <sphereGeometry args={[H * 0.28, n, n - 2]} />
        <meshPhysicalMaterial {...CAST_MAT.hair} />
      </mesh>
      <mesh castShadow position={[-H * 0.22, H * 0.02, H * 0.1]} rotation={[0.25, 0.55, -0.55]}>
        <capsuleGeometry args={[H * 0.11, H * 0.22, 6, n]} />
        <meshPhysicalMaterial {...CAST_MAT.hair} />
      </mesh>
      <mesh castShadow position={[H * 0.2, H * 0.1, H * 0.02]} rotation={[0.15, -0.4, 0.45]} scale={[0.85, 0.7, 0.8]}>
        <capsuleGeometry args={[H * 0.1, H * 0.16, 6, n]} />
        <meshPhysicalMaterial {...CAST_MAT.hair} />
      </mesh>
      <mesh castShadow position={[0, H * 0.08, -H * 0.22]} scale={[1.05, 0.7, 0.75]}>
        <sphereGeometry args={[H * 0.3, n, 10]} />
        <meshPhysicalMaterial {...CAST_MAT.hair} />
      </mesh>
      <mesh
        castShadow
        position={role === 'coach' ? [H * 0.18, H * 0.12, H * 0.14] : [-H * 0.12, H * 0.2, H * 0.22]}
        rotation={[0.7, role === 'coach' ? -0.3 : 0.45, role === 'coach' ? 0.2 : -0.25]}
      >
        <capsuleGeometry args={[H * 0.055, H * 0.28, 6, n]} />
        {gold}
      </mesh>
    </group>
  )
}

function Head({
  mood,
  visor,
  role,
  quality,
}: {
  mood: CastMood
  visor: string
  role: CastRole
  quality: CastLook['quality']
}) {
  const expr = faceFor(mood)
  const profile = useMemo(() => headProfile(), [])
  const n = segs(quality)
  return (
    <group position={[0, CAST_Y.head, 0]}>
      <mesh castShadow scale={[0.94, 1.06, 0.82]}>
        <latheGeometry args={[profile, n + 8]} />
        <Skin />
      </mesh>
      <mesh position={[0, H * 0.02, H * 0.16]} scale={[0.88, 0.95, 0.62]}>
        <sphereGeometry args={[H * 0.36, n, n - 2]} />
        <Skin />
      </mesh>
      <mesh position={[0, -H * 0.12, H * 0.3]} rotation={[0.55, 0, 0]} scale={[0.7, 0.55, 0.7]}>
        <boxGeometry args={[H * 0.09, H * 0.08, H * 0.07]} />
        <Skin />
      </mesh>
      <mesh
        position={[-H * 0.22, H * 0.04 + expr.browY * H * 0.2, H * 0.32]}
        rotation={[0.15, 0.4, 0.15]}
        scale={[0.7, 0.45, 0.35]}
      >
        <boxGeometry args={[H * 0.08, H * 0.04, H * 0.03]} />
        <meshPhysicalMaterial
          color={visor}
          roughness={0.14}
          metalness={0.4}
          clearcoat={1}
          clearcoatRoughness={0.1}
          emissive={visor}
          emissiveIntensity={0.08}
        />
      </mesh>
      <Eye side={-1} mood={mood} role={role} quality={quality} />
      <Eye side={1} mood={mood} role={role} quality={quality} />
      <mesh
        position={[0, -H * 0.2, H * 0.34]}
        rotation={[0.15, 0, 0]}
        scale={[0.7 + expr.mouthWide, 0.55 + expr.mouthOpen * 4, 0.7]}
      >
        <capsuleGeometry args={[H * 0.022, H * (0.01 + expr.mouthOpen), 5, 10]} />
        <meshStandardMaterial color="#4a2218" roughness={0.48} />
      </mesh>
      {quality !== 'far' && (
        <>
          <mesh position={[-H * 0.4, 0, 0]} rotation={[0, 0, 0.3]} scale={[0.45, 0.7, 0.35]}>
            <sphereGeometry args={[H * 0.1, 10, 8]} />
            <Skin />
          </mesh>
          <mesh position={[H * 0.4, 0, 0]} rotation={[0, 0, -0.3]} scale={[0.45, 0.7, 0.35]}>
            <sphereGeometry args={[H * 0.1, 10, 8]} />
            <Skin />
          </mesh>
        </>
      )}
      <Hair role={role} accent={visor} quality={quality} />
    </group>
  )
}

function Hand({ side }: { side: -1 | 1 }) {
  return (
    <group>
      <mesh castShadow scale={[1.05, 0.7, 0.85]}>
        <sphereGeometry args={[H * 0.12, 12, 10]} />
        <Skin />
      </mesh>
      {[ -0.06, 0, 0.06 ].map((z, i) => (
        <mesh key={i} position={[side * H * 0.02, -H * 0.1, z * H]} rotation={[0.4, 0, side * 0.15]}>
          <capsuleGeometry args={[H * 0.028, H * 0.08, 4, 6]} />
          <Skin />
        </mesh>
      ))}
    </group>
  )
}

function Arm({
  side,
  upper,
  fore,
  quality,
  suit,
}: {
  side: -1 | 1
  upper: [number, number, number]
  fore: [number, number, number]
  quality: CastLook['quality']
  suit: string
}) {
  const n = segs(quality)
  const upperLen = H * 1.2
  const foreLen = H * 1.08
  return (
    <group position={[side * H * 0.38, CAST_Y.shoulder, 0]} rotation={upper}>
      <mesh castShadow position={[0, -upperLen / 2, 0]}>
        <capsuleGeometry args={[H * 0.11, upperLen, 6, n]} />
        <meshPhysicalMaterial color={suit} {...CAST_MAT.suit} />
      </mesh>
      <group position={[0, -upperLen, 0]} rotation={fore}>
        <mesh castShadow position={[0, -foreLen / 2, 0]}>
          <capsuleGeometry args={[H * 0.09, foreLen, 6, n]} />
          <meshPhysicalMaterial color={suit} {...CAST_MAT.suit} />
        </mesh>
        <group position={[0, -foreLen - H * 0.08, 0]}>
          <Hand side={side} />
        </group>
      </group>
    </group>
  )
}

function Leg({
  side,
  thighRot,
  calfRot,
  kicks,
  quality,
  tights,
}: {
  side: -1 | 1
  thighRot: [number, number, number]
  calfRot: [number, number, number]
  kicks: string
  quality: CastLook['quality']
  tights: string
}) {
  const n = segs(quality)
  const thighLen = CAST_Y.hip - CAST_Y.knee - H * 0.06
  const calfLen = CAST_Y.knee - CAST_Y.ankle - H * 0.04
  return (
    <group position={[side * H * 0.14, CAST_Y.hip, 0]} rotation={thighRot}>
      <mesh castShadow position={[0, -thighLen / 2, 0]}>
        <capsuleGeometry args={[H * 0.13, thighLen, 6, n]} />
        <meshPhysicalMaterial color={tights} {...CAST_MAT.suit} />
      </mesh>
      <group position={[0, -thighLen, 0]} rotation={calfRot}>
        <mesh castShadow position={[0, -calfLen / 2, 0]}>
          <capsuleGeometry args={[H * 0.1, calfLen, 6, n]} />
          <meshPhysicalMaterial color={tights} {...CAST_MAT.suit} />
        </mesh>
        <mesh position={[0, -calfLen + H * 0.02, 0]}>
          <capsuleGeometry args={[H * 0.09, H * 0.12, 5, 8]} />
          <meshPhysicalMaterial color="#efe6d6" roughness={0.55} />
        </mesh>
        <group position={[0, -calfLen - H * 0.02, H * 0.06]}>
          <mesh castShadow>
            <boxGeometry args={[H * 0.3, H * 0.1, H * 0.46]} />
            <meshPhysicalMaterial color={kicks} {...CAST_MAT.shoe} />
          </mesh>
          <mesh position={[0, -H * 0.07, 0.01]}>
            <boxGeometry args={[H * 0.32, H * 0.06, H * 0.5]} />
            <meshPhysicalMaterial {...CAST_MAT.gum} />
          </mesh>
          <mesh position={[0, 0.02, H * 0.14]} scale={[1, 0.7, 0.7]}>
            <sphereGeometry args={[H * 0.14, 10, 8]} />
            <meshPhysicalMaterial color={kicks} {...CAST_MAT.shoe} />
          </mesh>
        </group>
      </group>
    </group>
  )
}

function armPose(mood: CastMood, side: -1 | 1): { upper: [number, number, number]; fore: [number, number, number] } {
  if (mood === 'cheer') {
    return { upper: [0.15, 0, side * -2.35], fore: [0.2, 0, side * -0.4] }
  }
  if (mood === 'think' && side === 1) {
    return { upper: [-0.55, 0.4, -0.9], fore: [-1.1, 0.2, -0.3] }
  }
  if (mood === 'frustrated') {
    return { upper: [-0.2, 0, side * -1.7], fore: [-0.6, 0, side * -0.5] }
  }
  if (mood === 'surprised') {
    return { upper: [0.1, 0, side * -0.85], fore: [-0.3, 0, 0] }
  }
  if (mood === 'lockin' || mood === 'focus') {
    return side === 1
      ? { upper: [0.35, -0.15, -0.45], fore: [-0.55, 0, 0] }
      : { upper: [0.2, 0.1, 0.35], fore: [-0.35, 0, 0] }
  }
  if (mood === 'confident' && side === 1) {
    return { upper: [0.25, -0.2, -0.25], fore: [-0.2, 0, 0] }
  }
  return {
    upper: [0.18, side * 0.08, side * -0.22],
    fore: [-0.28, 0, side * 0.08],
  }
}

export function CastFigure({
  role = 'player',
  mood = 'idle',
  visor = 'goggles-base',
  suit = 'hoodie-base',
  kicks = 'kicks-base',
  quality = 'play',
}: CastLook) {
  const root = useRef<Group>(null)
  const spine = useRef<Group>(null)
  const v = visorHex(visor)
  const s = suitHex(suit, role)
  const k = kickHex(kicks)
  const hoodie = useMemo(() => hoodieProfile(), [])
  const shorts = useMemo(() => shortsProfile(), [])
  const n = segs(quality)
  const left = armPose(mood, -1)
  const right = armPose(mood, 1)
  const lean = mood === 'lockin' || mood === 'focus' ? 0.14 : mood === 'think' ? 0.05 : mood === 'cheer' ? -0.04 : 0

  useFrame((state) => {
    const g = root.current
    if (!g) return
    const t = state.clock.elapsedTime
    const breath = Math.sin(t * 1.55) * 0.007
    const sway = Math.sin(t * 0.85) * 0.018
    g.position.y = breath + (mood === 'cheer' ? Math.abs(Math.sin(t * 5.5)) * 0.03 : 0)
    g.rotation.y = -0.5 + sway * 0.2
    if (spine.current) {
      spine.current.rotation.z = sway * 0.07
      spine.current.rotation.x = lean + Math.sin(t * 1.55) * 0.012
    }
    if (mood === 'cheer') g.rotation.z = Math.sin(t * 6) * 0.035
  })

  return (
    <group ref={root} rotation={[0, -0.5, 0]}>
      <group ref={spine} rotation={[lean, 0, 0]}>
        <mesh position={[0, CAST_Y.chin - H * 0.08, 0]}>
          <cylinderGeometry args={[H * 0.08, H * 0.1, H * 0.14, n]} />
          <Skin />
        </mesh>
        <mesh castShadow position={[0, CAST_Y.chest, 0]}>
          <latheGeometry args={[hoodie, n + 6]} />
          <meshPhysicalMaterial color={s} {...CAST_MAT.suit} />
        </mesh>
        <mesh position={[0, CAST_Y.chest + H * 0.04, H * 0.22]}>
          <boxGeometry args={[H * 0.48, H * 0.12, H * 0.04]} />
          <meshPhysicalMaterial {...CAST_MAT.plate} />
        </mesh>
        <mesh position={[0, CAST_Y.chest + H * 0.04, H * 0.242]}>
          <boxGeometry args={[H * 0.48, H * 0.012, H * 0.01]} />
          <meshPhysicalMaterial color={v} roughness={0.18} metalness={0.35} />
        </mesh>
        <mesh castShadow position={[0, CAST_Y.chest + H * 0.22, -H * 0.12]} rotation={[0.35, 0, 0]} scale={[1.05, 0.55, 0.7]}>
          <sphereGeometry args={[H * 0.22, n, 10]} />
          <meshPhysicalMaterial color={s} {...CAST_MAT.suit} />
        </mesh>
        <Head mood={mood} visor={v} role={role} quality={quality} />
        <Arm side={-1} upper={left.upper} fore={left.fore} quality={quality} suit={s} />
        <Arm side={1} upper={right.upper} fore={right.fore} quality={quality} suit={s} />
      </group>
      <mesh castShadow position={[0, CAST_Y.hip + H * 0.02, 0]}>
        <latheGeometry args={[shorts, n + 4]} />
        <meshPhysicalMaterial color={s} {...CAST_MAT.suit} />
      </mesh>
      <mesh position={[-H * 0.28, CAST_Y.hip - H * 0.04, 0]}>
        <boxGeometry args={[H * 0.06, H * 0.28, H * 0.22]} />
        <meshPhysicalMaterial {...CAST_MAT.plate} />
      </mesh>
      <mesh position={[H * 0.28, CAST_Y.hip - H * 0.04, 0]}>
        <boxGeometry args={[H * 0.06, H * 0.28, H * 0.22]} />
        <meshPhysicalMaterial {...CAST_MAT.plate} />
      </mesh>
      <Leg
        side={-1}
        thighRot={[0.1, 0, 0.05]}
        calfRot={[-0.08, 0, 0]}
        kicks={k}
        quality={quality}
        tights={s}
      />
      <Leg
        side={1}
        thighRot={[-0.04, 0, -0.04]}
        calfRot={[0.06, 0, 0]}
        kicks={k}
        quality={quality}
        tights={s}
      />
    </group>
  )
}
