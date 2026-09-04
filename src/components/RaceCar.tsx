const PAINT: Record<string, string> = {
  'paint-volt': '#f5d000',
  'paint-night': '#1e3a5f',
  'paint-leaf': '#22a36b',
}

const WHEELS: Record<string, string> = {
  'wheels-bronze': '#b45309',
  'wheels-gold': '#eab308',
}

const WING: Record<string, string> = {
  'wing-black': '#141414',
  'wing-gold': '#ca8a04',
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
    <svg viewBox="0 0 90 160" className={className} aria-label="Harbor RS race car" style={{ transform: `rotate(${angle}deg)` }}>
      <ellipse cx="45" cy="154" rx="22" ry="5" fill="#141628" opacity="0.18" />
      <rect x="18" y="28" width="54" height="104" rx="16" fill={body} stroke="#141628" strokeWidth="3" />
      <rect x="24" y="32" width="42" height="36" rx="8" fill="#111" />
      <rect x="30" y="38" width="10" height="8" rx="2" fill="#2a2a2a" />
      <rect x="50" y="38" width="10" height="8" rx="2" fill="#2a2a2a" />
      <rect x="28" y="78" width="34" height="28" rx="6" fill="#0b1224" />
      <rect x="32" y="82" width="26" height="12" rx="3" fill="#3d9bff" opacity="0.35" />
      <rect x="22" y="118" width="46" height="10" rx="2" fill={spoiler} stroke="#141628" strokeWidth="2" />
      <rect x="16" y="114" width="8" height="18" rx="2" fill={spoiler} />
      <rect x="66" y="114" width="8" height="18" rx="2" fill={spoiler} />
      <circle cx="20" cy="52" r="11" fill="#141628" />
      <circle cx="70" cy="52" r="11" fill="#141628" />
      <circle cx="20" cy="118" r="11" fill="#141628" />
      <circle cx="70" cy="118" r="11" fill="#141628" />
      <circle cx="20" cy="52" r="7" fill={rim} />
      <circle cx="70" cy="52" r="7" fill={rim} />
      <circle cx="20" cy="118" r="7" fill={rim} />
      <circle cx="70" cy="118" r="7" fill={rim} />
      <circle cx="20" cy="52" r="2.2" fill="#fff6ec" />
      <circle cx="70" cy="52" r="2.2" fill="#fff6ec" />
      <circle cx="20" cy="118" r="2.2" fill="#fff6ec" />
      <circle cx="70" cy="118" r="2.2" fill="#fff6ec" />
      <rect x="14" y="70" width="8" height="10" rx="2" fill={body} stroke="#141628" strokeWidth="2" />
      <rect x="68" y="70" width="8" height="10" rx="2" fill={body} stroke="#141628" strokeWidth="2" />
      <circle cx="34" cy="44" r="3" fill="#fff6ec" />
      <circle cx="56" cy="44" r="3" fill="#fff6ec" />
    </svg>
  )
}
