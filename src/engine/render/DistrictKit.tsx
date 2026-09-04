export function DistrictKit({ id, color }: { id: string; color: string }) {
  return (
    <group>
      <Skyline color={color} />
      <Kit id={id} color={color} />
    </group>
  )
}

function Kit({ id, color }: { id: string; color: string }) {
  const wall = '#141820'
  if (id === 'market') {
    return (
      <group>
        <Box pos={[-1.8, 0.7, -1.4]} size={[0.8, 1.4, 0.8]} color={color} />
        <Box pos={[0.15, 0.4, -1.8]} size={[1.6, 0.8, 0.45]} color={wall} />
        <Box pos={[2, 0.95, -0.7]} size={[0.32, 1.9, 0.32]} color={color} />
        <Lamp pos={[-0.6, 0, 0.9]} />
      </group>
    )
  }
  if (id === 'belowzero') {
    return (
      <group>
        <Box pos={[-2.1, 0.12, -1]} size={[2.6, 0.1, 0.32]} color="#7f94ab" />
        <Box pos={[1.5, 0.85, -1.5]} size={[1, 1.7, 1]} color={wall} />
        <Box pos={[0.05, 0.28, 1.15]} size={[0.55, 0.56, 0.55]} color={color} />
        <Lamp pos={[2.2, 0, 0.4]} />
      </group>
    )
  }
  if (id === 'gallery') {
    return (
      <group>
        <Box pos={[-1.9, 1, -1.6]} size={[0.08, 2, 1.4]} color={color} />
        <Box pos={[0.05, 1, -1.9]} size={[0.08, 2, 1.4]} color="#b9a57c" />
        <Box pos={[1.7, 0.55, -0.85]} size={[1.2, 1.1, 0.18]} color={wall} />
      </group>
    )
  }
  if (id === 'gearworks') {
    return (
      <group>
        <Box pos={[-1.3, 0.45, -1.1]} size={[1.7, 0.9, 0.85]} color={wall} />
        <Box pos={[1.15, 1, -1.25]} size={[0.38, 2, 0.38]} color={color} />
        <Box pos={[0.15, 0.22, 1.15]} size={[0.85, 0.44, 0.85]} color="#322c24" />
        <Lamp pos={[-2.2, 0, 0.2]} />
      </group>
    )
  }
  if (id === 'bridge' || id === 'boundary') {
    return (
      <group>
        <Box pos={[0, 0.07, -0.15]} size={[4.6, 0.1, 0.72]} color="#2a3340" />
        <Box pos={[-1.9, 0.5, -0.15]} size={[0.1, 0.9, 0.72]} color={color} />
        <Box pos={[1.9, 0.5, -0.15]} size={[0.1, 0.9, 0.72]} color={color} />
        <Box pos={[0, 0.95, -0.15]} size={[0.08, 0.08, 0.72]} color="#8aa0b4" />
      </group>
    )
  }
  if (id === 'plaza' || id === 'courtcrate') {
    return (
      <group>
        <Box pos={[0, 0.03, -0.55]} size={[3.4, 0.06, 2.3]} color="#161b24" />
        <Box pos={[-1.5, 0.62, -1.45]} size={[0.16, 1.24, 0.16]} color={color} />
        <Box pos={[1.5, 0.62, -1.45]} size={[0.16, 1.24, 0.16]} color={color} />
        <Lamp pos={[0, 0, 1.3]} />
      </group>
    )
  }
  if (id === 'arcade' || id === 'station') {
    return (
      <group>
        <Box pos={[-1.55, 0.8, -1.25]} size={[0.95, 1.6, 0.62]} color={wall} />
        <Box pos={[0.12, 0.5, -1.55]} size={[0.95, 1, 0.62]} color={color} />
        <Box pos={[1.7, 0.38, -0.85]} size={[0.72, 0.76, 0.72]} color={wall} />
        <Lamp pos={[2.3, 0, 0.5]} />
      </group>
    )
  }
  if (id === 'peak') {
    return (
      <group>
        <mesh position={[0.35, 0.85, -1.7]} castShadow>
          <coneGeometry args={[1.15, 2, 5]} />
          <meshStandardMaterial color={color} metalness={0.18} roughness={0.68} />
        </mesh>
        <Box pos={[-1.7, 0.28, -0.55]} size={[1.3, 0.56, 1.3]} color={wall} />
      </group>
    )
  }
  return (
    <group>
      <Box pos={[-2.2, 0.7, -1.5]} size={[0.38, 1.4, 2]} color={wall} />
      <Box pos={[0.55, 0.42, -2.1]} size={[2.6, 0.84, 0.48]} color={color} />
      <Box pos={[2.3, 0.14, 0.55]} size={[1.5, 0.1, 0.42]} color="#2c3544" />
      <Lamp pos={[-0.4, 0, 1.1]} />
    </group>
  )
}

function Skyline({ color }: { color: string }) {
  const towers: Array<[number, number, number, number, number, number]> = [
    [-7.2, 2.1, -8.4, 0.9, 4.2, 0.9],
    [-5.4, 1.4, -8.8, 1.1, 2.8, 1],
    [-3.4, 1.8, -9, 0.7, 3.6, 0.8],
    [-1.2, 1.1, -9.2, 1.4, 2.2, 0.7],
    [1.4, 2.4, -8.6, 0.8, 4.8, 0.8],
    [3.2, 1.5, -9, 1.2, 3, 0.9],
    [5.4, 2, -8.2, 0.7, 4, 0.7],
    [7, 1.2, -8.8, 1, 2.4, 1],
  ]
  return (
    <group>
      {towers.map(([x, y, z, w, h, d], i) => (
        <Box key={i} pos={[x, y, z]} size={[w, h, d]} color={i % 3 === 0 ? color : '#10141c'} />
      ))}
    </group>
  )
}

function Lamp({ pos }: { pos: [number, number, number] }) {
  return (
    <group position={pos}>
      <mesh position={[0, 0.78, 0]}>
        <cylinderGeometry args={[0.028, 0.034, 1.56, 6]} />
        <meshStandardMaterial color="#1a1e26" metalness={0.5} roughness={0.45} />
      </mesh>
      <mesh position={[0, 1.58, 0]}>
        <sphereGeometry args={[0.055, 8, 8]} />
        <meshStandardMaterial color="#e8f2ff" emissive="#b7d4ee" emissiveIntensity={2.2} />
      </mesh>
      <pointLight position={[0, 1.55, 0]} intensity={0.35} distance={3.6} color="#c9dcea" />
    </group>
  )
}

function Box({
  pos,
  size,
  color,
}: {
  pos: [number, number, number]
  size: [number, number, number]
  color: string
}) {
  return (
    <mesh position={pos} castShadow receiveShadow>
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} metalness={0.38} roughness={0.52} />
    </mesh>
  )
}
