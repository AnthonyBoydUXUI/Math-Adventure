import { cn } from '../lib/cn.ts'

export type AeroMood = 'idle' | 'cheer' | 'think' | 'lockin'

const VISOR: Record<string, string> = {
  'goggles-base': '#e4c24a',
  'goggles-gold': '#f0d36a',
  'goggles-paint': '#7b8cff',
}

const SUIT: Record<string, string> = {
  'hoodie-base': '#0e1a3a',
  'hoodie-court': '#8a3418',
  'hoodie-signal': '#0f5c56',
}

const KICKS: Record<string, string> = {
  'kicks-base': '#f3efe6',
  'kicks-volt': '#e4c24a',
}

/** Original Harbor vinyl figure. Visor band, not a licensed face. */
export function Aero({
  mood = 'idle',
  goggles = 'goggles-base',
  hoodie = 'hoodie-base',
  kicks = 'kicks-base',
  className,
}: {
  mood?: AeroMood
  goggles?: string
  hoodie?: string
  kicks?: string
  className?: string
}) {
  const visor = VISOR[goggles] ?? VISOR['goggles-base']
  const suit = SUIT[hoodie] ?? SUIT['hoodie-base']
  const shoe = KICKS[kicks] ?? KICKS['kicks-base']
  const tilt = mood === 'think' ? -4 : mood === 'cheer' ? 3 : 0

  return (
    <svg
      viewBox="0 0 160 210"
      className={cn('overflow-visible', className)}
      aria-hidden="true"
      style={{ transform: `rotate(${tilt}deg)` }}
    >
      <ellipse cx="80" cy="200" rx="36" ry="6" fill="#05070b" opacity="0.5" />
      <path d="M44 108c-8 8-12 28-4 40 6 8 16 10 22 6" fill={suit} />
      <path d="M116 108c8 8 12 28 4 40-6 8-16 10-22 6" fill={suit} />
      <rect x="50" y="92" width="60" height="66" rx="20" fill={suit} />
      <path d="M56 100h48l-6 14H62z" fill="#f3efe6" />
      <rect x="70" y="104" width="20" height="5" rx="1" fill={visor} />
      <ellipse cx="80" cy="98" rx="18" ry="6" fill="#ffffff" opacity="0.08" />
      <rect x="54" y="154" width="18" height="28" rx="8" fill="#c68642" />
      <rect x="88" y="154" width="18" height="28" rx="8" fill="#c68642" />
      <rect x="50" y="176" width="26" height="12" rx="5" fill={shoe} />
      <rect x="84" y="176" width="26" height="12" rx="5" fill={shoe} />
      <circle cx="80" cy="56" r="32" fill="#c68642" />
      <ellipse cx="66" cy="50" rx="8" ry="11" fill="#efd0b0" opacity="0.4" />
      <path d="M50 44c8-18 52-20 62 4-20-12-42-12-62-4z" fill="#161b2e" />
      <path d="M52 50c14-8 42-8 56 2-18-6-38-6-56-2z" fill="#1c2238" />
      <path d="M108 46c4 10 3 20-1 26" stroke={visor} strokeWidth="2.4" fill="none" strokeLinecap="round" />
      <rect x="52" y="52" width="56" height="8" rx="3" fill="#0a0e1a" />
      <rect x="54" y="54" width="52" height="4" rx="2" fill={visor} />
      <ellipse cx="68" cy="72" rx="7" ry="8" fill="#fff8ee" />
      <ellipse cx="92" cy="72" rx="7" ry="8" fill="#fff8ee" />
      <ellipse cx="69" cy="73" rx="3" ry="4" fill="#1a1420" />
      <ellipse cx="93" cy="73" rx="3" ry="4" fill="#1a1420" />
      <circle cx="67.2" cy="70.5" r="1.1" fill="#fff" className="twinkle" />
      <circle cx="91.2" cy="70.5" r="1.1" fill="#fff" className="twinkle-2" />
      {mood === 'cheer' ? (
        <path d="M72 84c4 5 12 5 16 0" stroke="#3a2418" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      ) : mood === 'think' ? (
        <path d="M74 85h13" stroke="#3a2418" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      ) : (
        <path d="M74 84c3 2.5 9 2.5 12 0" stroke="#3a2418" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      )}
    </svg>
  )
}

/** From-behind field figure — Mason-language silhouette, original. */
export function FieldCast({ className, suit = '#3a2a68' }: { className?: string; suit?: string }) {
  return (
    <svg viewBox="0 0 120 200" className={cn('overflow-visible', className)} aria-hidden="true">
      <ellipse cx="60" cy="192" rx="26" ry="5" fill="#05070b" opacity="0.45" />
      <rect x="36" y="94" width="16" height="44" rx="8" fill={suit} />
      <rect x="68" y="94" width="16" height="44" rx="8" fill={suit} />
      <rect x="42" y="88" width="36" height="60" rx="16" fill={suit} />
      <rect x="46" y="146" width="12" height="30" rx="6" fill="#1d4a8c" />
      <rect x="62" y="146" width="12" height="30" rx="6" fill="#1d4a8c" />
      <circle cx="60" cy="58" r="24" fill="#c68642" />
      <path d="M38 58c6-20 38-20 44 0v10H38z" fill="#161b2e" />
      <rect x="44" y="170" width="16" height="10" rx="4" fill="#f3efe6" />
      <rect x="62" y="170" width="16" height="10" rx="4" fill="#f3efe6" />
    </svg>
  )
}

export function CastMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <rect width="48" height="48" fill="#0e1a3a" />
      <circle cx="24" cy="20" r="10" fill="#c68642" />
      <path d="M15 18c3-8 15-8 18 0" fill="#161b2e" />
      <rect x="15" y="18" width="18" height="3" rx="1" fill="#e4c24a" />
    </svg>
  )
}
