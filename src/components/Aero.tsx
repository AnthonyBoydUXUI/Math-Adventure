import { cn } from '../lib/cn.ts'

export type AeroMood = 'idle' | 'cheer' | 'think' | 'lockin'

const GOGGLE: Record<string, string> = {
  'goggles-base': '#e11d48',
  'goggles-gold': '#d97706',
  'goggles-paint': '#7b61ff',
}

const HOODIE: Record<string, string> = {
  'hoodie-base': '#1e3a5f',
  'hoodie-court': '#c2410c',
  'hoodie-signal': '#0f766e',
}

const KICKS: Record<string, string> = {
  'kicks-base': '#fb923c',
  'kicks-volt': '#a3e635',
}

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
  const g = GOGGLE[goggles] ?? GOGGLE['goggles-base']
  const h = HOODIE[hoodie] ?? HOODIE['hoodie-base']
  const k = KICKS[kicks] ?? KICKS['kicks-base']
  const tilt = mood === 'think' ? -6 : mood === 'cheer' ? 4 : 0

  return (
    <svg
      viewBox="0 0 160 200"
      className={cn('overflow-visible', className)}
      aria-hidden="true"
      style={{ transform: `rotate(${tilt}deg)` }}
    >
      <ellipse cx="80" cy="188" rx="42" ry="8" fill="#141628" opacity="0.12" />
      <path d="M46 92c-16 8-22 28-12 40 6 8 22 10 28 6" fill={h} />
      <rect x="48" y="86" width="64" height="70" rx="22" fill={h} />
      <path d="M48 100h64l-6 18H54z" fill="#0b1224" opacity="0.18" />
      <circle cx="80" cy="62" r="32" fill="#f4c7a5" />
      <path d="M50 50c8-22 52-22 60 2-18-8-42-8-60-2z" fill="#1c2038" />
      <rect x="50" y="56" width="60" height="22" rx="11" fill={g} />
      <circle cx="66" cy="67" r="11" fill="#fff6ec" />
      <circle cx="94" cy="67" r="11" fill="#fff6ec" />
      <circle cx="66" cy="67" r="5" fill="#141628" />
      <circle cx="94" cy="67" r="5" fill="#141628" />
      <circle cx="63.5" cy="64.5" r="1.8" fill="#fff" className="twinkle" />
      <circle cx="91.5" cy="64.5" r="1.8" fill="#fff" className="twinkle-2" />
      {mood === 'cheer' ? (
        <path d="M70 82c4 6 16 6 20 0" stroke="#141628" strokeWidth="3" fill="none" strokeLinecap="round" />
      ) : mood === 'think' ? (
        <path d="M72 84h16" stroke="#141628" strokeWidth="3" fill="none" strokeLinecap="round" />
      ) : (
        <path d="M72 83c4 4 12 4 16 0" stroke="#141628" strokeWidth="3" fill="none" strokeLinecap="round" />
      )}
      <rect x="54" y="150" width="18" height="22" rx="6" fill="#f4c7a5" />
      <rect x="88" y="150" width="18" height="22" rx="6" fill="#f4c7a5" />
      <rect x="50" y="168" width="26" height="14" rx="6" fill={k} />
      <rect x="84" y="168" width="26" height="14" rx="6" fill={k} />
      <circle cx="118" cy="118" r="16" fill="#ffc53d" stroke="#141628" strokeWidth="3" />
      <path d="M112 118h12M118 112v12" stroke="#141628" strokeWidth="2.4" />
    </svg>
  )
}
