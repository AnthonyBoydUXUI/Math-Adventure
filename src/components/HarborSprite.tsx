import { VINYL } from '../engine/render/materials.ts'
import { cn } from '../lib/cn.ts'

const PAINT: Record<string, string> = {
  'paint-volt': VINYL.volt,
  'paint-night': VINYL.night,
  'paint-leaf': VINYL.leaf,
}

const RIM: Record<string, string> = {
  'wheels-bronze': VINYL.rimBronze,
  'wheels-gold': VINYL.rimGold,
}

/** Top-down Harbor RS — muted yellow, black canopy, bronze wheels. */
export function HarborSprite({
  paint = 'paint-volt',
  wheels = 'wheels-bronze',
  className,
  spinning,
}: {
  paint?: string
  wheels?: string
  className?: string
  spinning?: boolean
}) {
  const body = PAINT[paint] ?? PAINT['paint-volt']
  const rim = RIM[wheels] ?? RIM['wheels-bronze']
  return (
    <svg viewBox="0 0 72 128" className={cn('drop-shadow-lg', className)} aria-label="Harbor RS">
      <ellipse cx="36" cy="118" rx="22" ry="6" fill="#000" opacity="0.35" />
      <path
        d="M22 20 C24 8 48 8 50 20 L56 48 C60 70 60 86 54 108 C50 118 22 118 18 108 C12 86 12 70 16 48 Z"
        fill={body}
      />
      <path d="M24 28 C26 18 46 18 48 28 L50 54 C48 62 24 62 22 54 Z" fill="#0a0c10" />
      <path d="M26 32 C28 24 44 24 46 32 L47 50 C46 56 26 56 25 50 Z" fill="#1a3040" opacity="0.55" />
      <rect x="20" y="14" width="32" height="4" rx="2" fill="#f4f8ff" opacity="0.9" />
      <rect x="22" y="110" width="28" height="3" rx="1.5" fill="#c45a3a" />
      <g className={spinning ? 'harbor-wheel' : undefined}>
        <ellipse cx="16" cy="40" rx="7" ry="10" fill="#111" />
        <ellipse cx="56" cy="40" rx="7" ry="10" fill="#111" />
        <ellipse cx="16" cy="96" rx="7" ry="10" fill="#111" />
        <ellipse cx="56" cy="96" rx="7" ry="10" fill="#111" />
        <ellipse cx="16" cy="40" rx="3.5" ry="5" fill={rim} />
        <ellipse cx="56" cy="40" rx="3.5" ry="5" fill={rim} />
        <ellipse cx="16" cy="96" rx="3.5" ry="5" fill={rim} />
        <ellipse cx="56" cy="96" rx="3.5" ry="5" fill={rim} />
      </g>
    </svg>
  )
}
