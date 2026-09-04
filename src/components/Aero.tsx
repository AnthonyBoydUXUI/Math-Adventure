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

/** Original Harbor vinyl figure — visor slit, not a licensed character. */
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
  const tilt = mood === 'think' ? -5 : mood === 'cheer' ? 3 : 0

  return (
    <svg
      viewBox="0 0 160 210"
      className={cn('overflow-visible', className)}
      aria-hidden="true"
      style={{ transform: `rotate(${tilt}deg)` }}
    >
      <ellipse cx="80" cy="198" rx="38" ry="7" fill="#05070b" opacity="0.45" />
      <path d="M58 96c-14 10-16 34-6 46 7 8 20 10 26 4" fill={suit} />
      <path d="M102 96c14 10 16 34 6 46-7 8-20 10-26 4" fill={suit} />
      <rect x="52" y="88" width="56" height="68" rx="18" fill={suit} />
      <path d="M58 96h44l-5 16H63z" fill="#f3efe6" />
      <rect x="68" y="100" width="24" height="6" rx="1" fill={visor} />
      <path d="M54 154h16v22c0 4-3 8-8 8h0c-5 0-8-4-8-8z" fill="#c68642" />
      <path d="M90 154h16v22c0 4-3 8-8 8h0c-5 0-8-4-8-8z" fill="#c68642" />
      <rect x="50" y="176" width="24" height="12" rx="4" fill={shoe} />
      <rect x="86" y="176" width="24" height="12" rx="4" fill={shoe} />
      <circle cx="80" cy="58" r="30" fill="#c68642" />
      <ellipse cx="68" cy="52" rx="7" ry="10" fill="#f0c9a0" opacity="0.35" />
      <path d="M52 48c6-20 50-22 58 2-16-10-40-10-58-2z" fill="#14182a" />
      <path d="M54 52c10-6 42-8 52 0-18-4-34-4-52 0z" fill="#1c2238" />
      <path d="M108 50c2 8 1 16-2 20" stroke={visor} strokeWidth="2.2" fill="none" />
      <rect x="54" y="54" width="52" height="9" rx="3" fill="#0b1020" />
      <rect x="56" y="56" width="48" height="5" rx="2" fill={visor} opacity="0.85" />
      <ellipse cx="68" cy="72" rx="8" ry="9" fill="#fff6ec" />
      <ellipse cx="92" cy="72" rx="8" ry="9" fill="#fff6ec" />
      <ellipse cx="69" cy="73" rx="3.4" ry="4.2" fill="#141628" />
      <ellipse cx="93" cy="73" rx="3.4" ry="4.2" fill="#141628" />
      <circle cx="67" cy="70" r="1.3" fill="#fff" className="twinkle" />
      <circle cx="91" cy="70" r="1.3" fill="#fff" className="twinkle-2" />
      {mood === 'cheer' ? (
        <path d="M72 84c3 5 13 5 16 0" stroke="#3a2418" strokeWidth="2.4" fill="none" strokeLinecap="round" />
      ) : mood === 'think' ? (
        <path d="M74 85h14" stroke="#3a2418" strokeWidth="2.4" fill="none" strokeLinecap="round" />
      ) : (
        <path d="M74 84c3 3 9 3 12 0" stroke="#3a2418" strokeWidth="2.4" fill="none" strokeLinecap="round" />
      )}
    </svg>
  )
}

/** Simplified figure from behind — field kit, original, no face. */
export function FieldCast({ className, suit = '#3a2a68' }: { className?: string; suit?: string }) {
  return (
    <svg viewBox="0 0 120 200" className={cn('overflow-visible', className)} aria-hidden="true">
      <ellipse cx="60" cy="190" rx="28" ry="6" fill="#05070b" opacity="0.4" />
      <rect x="44" y="86" width="32" height="62" rx="14" fill={suit} />
      <path d="M36 96c-8 18-6 40 6 48" stroke={suit} strokeWidth="14" fill="none" strokeLinecap="round" />
      <path d="M84 96c8 18 6 40-6 48" stroke={suit} strokeWidth="14" fill="none" strokeLinecap="round" />
      <path d="M46 146v28" stroke="#1d4a8c" strokeWidth="12" strokeLinecap="round" />
      <path d="M74 146v28" stroke="#1d4a8c" strokeWidth="12" strokeLinecap="round" />
      <circle cx="60" cy="58" r="22" fill="#c68642" />
      <path d="M40 58c4-18 36-18 40 0v8H40z" fill="#14182a" />
      <rect x="46" y="168" width="14" height="10" rx="3" fill="#f3efe6" />
      <rect x="62" y="168" width="14" height="10" rx="3" fill="#f3efe6" />
    </svg>
  )
}

export function CastMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <rect width="48" height="48" fill="#0e1a3a" />
      <circle cx="24" cy="20" r="9" fill="#c68642" />
      <path d="M16 18c2-7 14-7 16 0" fill="#14182a" />
      <rect x="16" y="18" width="16" height="3" rx="1" fill="#e4c24a" />
    </svg>
  )
}
