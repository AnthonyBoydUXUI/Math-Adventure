const PAINT: Record<string, string> = {
  'paint-volt': '#c4a800',
  'paint-night': '#1a2f4a',
  'paint-leaf': '#1b7a52',
}

const WHEELS: Record<string, string> = {
  'wheels-bronze': '#8a4b16',
  'wheels-gold': '#b8922a',
}

const WING: Record<string, string> = {
  'wing-black': '#121212',
  'wing-gold': '#9a7b1a',
}

export function RaceCar({
  paint = 'paint-volt',
  wheels = 'wheels-bronze',
  wing = 'wing-black',
  className,
  angle = 0,
}: {
  paint?: string
  wheels?: string
  wing?: string
  className?: string
  angle?: number
}) {
  const body = PAINT[paint] ?? PAINT['paint-volt']
  const rim = WHEELS[wheels] ?? WHEELS['wheels-bronze']
  const spoiler = WING[wing] ?? WING['wing-black']

  return (
    <svg viewBox="0 0 90 160" className={className} aria-label="Harbor RS" style={{ transform: `rotate(${angle}deg)` }}>
      <rect x="22" y="36" width="46" height="88" fill={body} />
      <rect x="26" y="40" width="38" height="28" fill="#0b0d10" />
      <rect x="40" y="44" width="20" height="16" fill="#3a6d88" opacity="0.5" />
      <rect x="24" y="118" width="42" height="8" fill={spoiler} />
      <rect x="18" y="114" width="6" height="16" fill={spoiler} />
      <rect x="66" y="114" width="6" height="16" fill={spoiler} />
      <rect x="16" y="48" width="10" height="10" fill="#111" />
      <rect x="64" y="48" width="10" height="10" fill="#111" />
      <rect x="16" y="112" width="10" height="10" fill="#111" />
      <rect x="64" y="112" width="10" height="10" fill="#111" />
      <rect x="18" y="50" width="6" height="6" fill={rim} />
      <rect x="66" y="50" width="6" height="6" fill={rim} />
      <rect x="18" y="114" width="6" height="6" fill={rim} />
      <rect x="66" y="114" width="6" height="6" fill={rim} />
    </svg>
  )
}
