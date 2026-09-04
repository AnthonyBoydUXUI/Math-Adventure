import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Decal } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { SRGBColorSpace, TextureLoader, type Group, type Texture } from 'three'
import { CAST_HEAD, CAST_Y, kickHex, suitHex, visorHex, type CastLook, type CastMood, type CastRole } from './canon.ts'
import { faceFor } from './expressions.ts'
import { CAST_MAT } from './materials.ts'

const H = CAST_HEAD
const SEG = { hi: 18, mid: 12, lo: 8 } as const

function segs(quality: CastLook['quality']) {
  if (quality === 'far') return SEG.lo
  if (quality === 'close') return SEG.hi
  return SEG.mid
}

function Skin() {
  return <meshPhysicalMaterial {...CAST_MAT.skin} />
}

function useFaceMap() {
  const [map, setMap] = useState<Texture | null>(null)
  useLayoutEffect(() => {
    const loader = new TextureLoader()
    loader.load('/cast/tex/face.jpg', (tex) => {
      tex.colorSpace = SRGBColorSpace
      tex.anisotropy = 8
      setMap(tex)
    })
  }, [])
  return map
}

function Lids({ mood, quality }: { mood: CastMood; quality: CastLook['quality'] }) {
  const expr = faceFor(mood)
  return (
    <group>
      <mesh
        position={[0, H * 0.16 + expr.browY * H * 0.1, H * 0.3]}
        scale={[1, Math.max(0.12, 1.05 - expr.lid + expr.squint * 0.6), 1]}
      >
        <boxGeometry args={[H * 0.55, H * 0.1, H * 0.06]} />
        <Skin />
      </mesh>
      {quality !== 'far' && (
        <>
          <mesh position={[-H * 0.13, H * 0.2 + expr.browY * H, H * 0.32]} rotation={[0, 0, 0.16 + expr.browIn * 0.25]}>
            <boxGeometry args={[H * 0.18, H * 0.028, H * 0.03]} />
            <meshStandardMaterial color="#1a1210" roughness={0.55} />
          </mesh>
          <mesh position={[H * 0.13, H * 0.2 + expr.browY * H, H * 0.32]} rotation={[0, 0, -0.16 - expr.browIn * 0.25]}>
            <boxGeometry args={[H * 0.18, H * 0.028, H * 0.03]} />
            <meshStandardMaterial color="#1a1210" roughness={0.55} />
          </mesh>
        </>
      )}
    </group>
  )
}

function Hair({ role, accent, quality }: { role: CastRole; accent: string; quality: CastLook['quality'] }) {
  const n = segs(quality)
  return (
    <group>
      <mesh castShadow position={[0, H * 0.28, -H * 0.08]} scale={[1.05, 0.48, 0.95]}>
        <sphereGeometry args={[H * 0.4, n, n]} />
        <meshPhysicalMaterial {...CAST_MAT.hair} />
      </mesh>
      <mesh castShadow position={[-H * 0.16, H * 0.22, H * 0.08]} rotation={[0.4, 0.5, -0.55]} scale={[0.85, 0.45, 0.7]}>
        <sphereGeometry args={[H * 0.22, n, 10]} />
        <meshPhysicalMaterial {...CAST_MAT.hair} />
      </mesh>
      <mesh castShadow position={[H * 0.18, H * 0.2, 0]} rotation={[0.2, -0.4, 0.5]} scale={[0.7, 0.4, 0.6]}>
        <sphereGeometry args={[H * 0.18, n, 10]} />
        <meshPhysicalMaterial {...CAST_MAT.hair} />
      </mesh>
      <mesh castShadow position={[0, H * 0.1, -H * 0.28]} scale={[1, 0.65, 0.7]}>
        <sphereGeometry args={[H * 0.3, n, 10]} />
        <meshPhysicalMaterial {...CAST_MAT.hair} />
      </mesh>
      <mesh
        castShadow
        position={role === 'coach' ? [H * 0.16, H * 0.26, H * 0.06] : [-H * 0.1, H * 0.3, H * 0.12]}
        rotation={[0.55, 0.35, -0.2]}
      >
        <capsuleGeometry args={[H * 0.045, H * 0.22, 5, n]} />
        <meshPhysicalMaterial
          color={accent}
          roughness={0.2}
          metalness={0.22}
          clearcoat={0.75}
          clearcoatRoughness={0.16}
        />
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
  const n = segs(quality)
  const map = useFaceMap()
  return (
    <group position={[0, CAST_Y.head, 0]}>
      <mesh castShadow scale={[0.92, 1.08, 0.8]}>
        <sphereGeometry args={[H * 0.42, n + 4, n]} />
        <Skin />
        {map ? (
          <Decal position={[0, H * 0.02, H * 0.28]} rotation={[0, 0, 0]} scale={[H * 0.78, H * 0.86, H * 0.36]}>
            <meshPhysicalMaterial map={map} roughness={0.46} metalness={0.02} polygonOffset polygonOffsetFactor={-4} />
          </Decal>
        ) : null}
      </mesh>
      <Lids mood={mood} quality={quality} />
      <mesh position={[0, -H * 0.18, H * 0.1]} scale={[0.72, 0.45, 0.55]}>
        <sphereGeometry args={[H * 0.28, n, 10]} />
        <Skin />
      </mesh>
      <mesh position={[-H * 0.2, H * 0.08, H * 0.3]} rotation={[0.1, 0.35, 0.1]}>
        <boxGeometry args={[H * 0.07, H * 0.035, H * 0.025]} />
        <meshPhysicalMaterial
          color={visor}
          roughness={0.14}
          metalness={0.45}
          clearcoat={1}
          clearcoatRoughness={0.1}
          emissive={visor}
          emissiveIntensity={0.1}
        />
      </mesh>
      <Hair role={role} accent={visor} quality={quality} />
    </group>
  )
}

function Hand({ side }: { side: -1 | 1 }) {
  return (
    <group>
      <mesh castShadow scale={[1.15, 0.75, 0.9]}>
        <sphereGeometry args={[H * 0.13, 12, 10]} />
        <Skin />
      </mesh>
      {[-0.07, 0, 0.07].map((z, i) => (
        <mesh key={i} position={[side * H * 0.02, -H * 0.11, z * H]} rotation={[0.35, 0, side * 0.12]}>
          <capsuleGeometry args={[H * 0.032, H * 0.09, 4, 6]} />
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
  const upperLen = H * 1.15
  const foreLen = H * 1.02
  return (
    <group position={[side * H * 0.42, CAST_Y.shoulder - H * 0.02, 0]} rotation={upper}>
      <mesh castShadow position={[0, -upperLen / 2, 0]}>
        <capsuleGeometry args={[H * 0.155, upperLen, 6, n]} />
        <meshPhysicalMaterial color={suit} {...CAST_MAT.suit} />
      </mesh>
      <group position={[0, -upperLen, 0]} rotation={fore}>
        <mesh castShadow position={[0, -foreLen / 2, 0]}>
          <capsuleGeometry args={[H * 0.13, foreLen, 6, n]} />
          <meshPhysicalMaterial color={suit} {...CAST_MAT.suit} />
        </mesh>
        <group position={[0, -foreLen - H * 0.09, 0]}>
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
  const thighLen = CAST_Y.hip - CAST_Y.knee - H * 0.05
  const calfLen = CAST_Y.knee - CAST_Y.ankle - H * 0.02
  return (
    <group position={[side * H * 0.16, CAST_Y.hip, 0]} rotation={thighRot}>
      <mesh castShadow position={[0, -thighLen / 2, 0]}>
        <capsuleGeometry args={[H * 0.175, thighLen, 6, n]} />
        <meshPhysicalMaterial color={tights} {...CAST_MAT.suit} />
      </mesh>
      <group position={[0, -thighLen, 0]} rotation={calfRot}>
        <mesh castShadow position={[0, -calfLen / 2, 0]}>
          <capsuleGeometry args={[H * 0.135, calfLen, 6, n]} />
          <meshPhysicalMaterial color={tights} {...CAST_MAT.suit} />
        </mesh>
        <mesh position={[0, -calfLen + H * 0.04, 0]}>
          <capsuleGeometry args={[H * 0.11, H * 0.14, 5, 8]} />
          <meshPhysicalMaterial color="#efe6d6" roughness={0.55} />
        </mesh>
        <group position={[0, -calfLen - H * 0.01, H * 0.08]}>
          <mesh castShadow>
            <boxGeometry args={[H * 0.34, H * 0.14, H * 0.5]} />
            <meshPhysicalMaterial color={kicks} {...CAST_MAT.shoe} />
          </mesh>
          <mesh position={[0, -H * 0.09, 0.01]}>
            <boxGeometry args={[H * 0.36, H * 0.07, H * 0.54]} />
            <meshPhysicalMaterial {...CAST_MAT.gum} />
          </mesh>
          <mesh position={[0, 0.02, H * 0.16]} scale={[1.05, 0.75, 0.75]}>
            <sphereGeometry args={[H * 0.15, 10, 8]} />
            <meshPhysicalMaterial color={kicks} {...CAST_MAT.shoe} />
          </mesh>
        </group>
      </group>
    </group>
  )
}

function armPose(mood: CastMood, side: -1 | 1): { upper: [number, number, number]; fore: [number, number, number] } {
  if (mood === 'cheer') return { upper: [0.12, 0, side * -2.3], fore: [0.15, 0, side * -0.35] }
  if (mood === 'think' && side === 1) return { upper: [-0.5, 0.35, -0.85], fore: [-1.05, 0.15, -0.25] }
  if (mood === 'frustrated') return { upper: [-0.15, 0, side * -1.65], fore: [-0.55, 0, side * -0.45] }
  if (mood === 'surprised') return { upper: [0.08, 0, side * -0.8], fore: [-0.25, 0, 0] }
  if (mood === 'lockin' || mood === 'focus') {
    return side === 1
      ? { upper: [0.32, -0.12, -0.4], fore: [-0.5, 0, 0] }
      : { upper: [0.18, 0.08, 0.32], fore: [-0.3, 0, 0] }
  }
  if (mood === 'confident' && side === 1) return { upper: [0.22, -0.18, -0.22], fore: [-0.18, 0, 0] }
  return { upper: [0.16, side * 0.06, side * -0.2], fore: [-0.24, 0, side * 0.06] }
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
  const n = segs(quality)
  const left = armPose(mood, -1)
  const right = armPose(mood, 1)
  const lean = mood === 'lockin' || mood === 'focus' ? 0.12 : mood === 'think' ? 0.04 : mood === 'cheer' ? -0.03 : 0
  const turn = useMemo(() => (quality === 'close' ? -0.18 : -0.85), [quality])

  useFrame((state) => {
    const g = root.current
    if (!g) return
    const t = state.clock.elapsedTime
    const breath = Math.sin(t * 1.55) * 0.006
    const sway = Math.sin(t * 0.85) * 0.016
    g.position.y = breath + (mood === 'cheer' ? Math.abs(Math.sin(t * 5.5)) * 0.028 : 0)
    g.rotation.y = turn + sway * 0.16
    if (spine.current) {
      spine.current.rotation.z = sway * 0.06
      spine.current.rotation.x = lean + Math.sin(t * 1.55) * 0.01
    }
    if (mood === 'cheer') g.rotation.z = Math.sin(t * 6) * 0.03
  })

  return (
    <group ref={root} rotation={[0, turn, 0]}>
      <group ref={spine} rotation={[lean, 0, 0]}>
        <mesh position={[0, CAST_Y.chin - H * 0.06, 0]}>
          <cylinderGeometry args={[H * 0.09, H * 0.12, H * 0.16, n]} />
          <Skin />
        </mesh>
        <mesh castShadow position={[0, CAST_Y.chest, 0]} scale={[1.15, 1.35, 0.85]}>
          <sphereGeometry args={[H * 0.32, n + 2, n]} />
          <meshPhysicalMaterial color={s} {...CAST_MAT.suit} />
        </mesh>
        <mesh castShadow position={[0, CAST_Y.waist + H * 0.04, 0]} scale={[1.05, 0.7, 0.75]}>
          <sphereGeometry args={[H * 0.28, n, 10]} />
          <meshPhysicalMaterial color={s} {...CAST_MAT.suit} />
        </mesh>
        <mesh position={[0, CAST_Y.chest + H * 0.06, H * 0.26]}>
          <boxGeometry args={[H * 0.5, H * 0.14, H * 0.05]} />
          <meshPhysicalMaterial {...CAST_MAT.plate} />
        </mesh>
        <mesh position={[0, CAST_Y.chest + H * 0.06, H * 0.29]}>
          <boxGeometry args={[H * 0.5, H * 0.014, H * 0.012]} />
          <meshPhysicalMaterial color={v} roughness={0.18} metalness={0.35} />
        </mesh>
        <mesh castShadow position={[0, CAST_Y.chest + H * 0.2, -H * 0.16]} rotation={[0.4, 0, 0]} scale={[1.1, 0.5, 0.65]}>
          <sphereGeometry args={[H * 0.24, n, 10]} />
          <meshPhysicalMaterial color={s} {...CAST_MAT.suit} />
        </mesh>
        <Head mood={mood} visor={v} role={role} quality={quality} />
        <Arm side={-1} upper={left.upper} fore={left.fore} quality={quality} suit={s} />
        <Arm side={1} upper={right.upper} fore={right.fore} quality={quality} suit={s} />
      </group>
      <mesh castShadow position={[0, CAST_Y.hip + H * 0.04, 0]} scale={[1.15, 0.55, 0.85]}>
        <sphereGeometry args={[H * 0.3, n, 10]} />
        <meshPhysicalMaterial color={s} {...CAST_MAT.suit} />
      </mesh>
      <mesh position={[-H * 0.3, CAST_Y.hip - H * 0.02, 0]}>
        <boxGeometry args={[H * 0.07, H * 0.26, H * 0.2]} />
        <meshPhysicalMaterial {...CAST_MAT.plate} />
      </mesh>
      <mesh position={[H * 0.3, CAST_Y.hip - H * 0.02, 0]}>
        <boxGeometry args={[H * 0.07, H * 0.26, H * 0.2]} />
        <meshPhysicalMaterial {...CAST_MAT.plate} />
      </mesh>
      <Leg side={-1} thighRot={[0.08, 0, 0.04]} calfRot={[-0.06, 0, 0]} kicks={k} quality={quality} tights={s} />
      <Leg side={1} thighRot={[-0.03, 0, -0.03]} calfRot={[0.05, 0, 0]} kicks={k} quality={quality} tights={s} />
    </group>
  )
}
