import { SIGNAL } from '../engine/render/cast/canon.ts'
import { cn } from '../lib/cn.ts'

/** On-map Signal — bone hood, gold chevron, navy strap, walking legs. */
export function SignalWalker({
  className,
  walking,
  cheer,
}: {
  className?: string
  walking?: boolean
  cheer?: boolean
}) {
  return (
    <svg viewBox="0 0 48 88" className={cn('drop-shadow-md', className)} aria-label="Signal">
      <ellipse cx="24" cy="84" rx="10" ry="3" fill="#000" opacity="0.3" />
      <g className={walking ? 'signal-walk' : cheer ? 'signal-cheer' : 'signal-idle'}>
        <rect className="signal-leg signal-leg-l" x="16" y="58" width="6" height="20" rx="2" fill={SIGNAL.navy} />
        <rect className="signal-leg signal-leg-r" x="26" y="58" width="6" height="20" rx="2" fill={SIGNAL.navy} />
        <rect x="15" y="76" width="8" height="6" rx="2" fill="#f3efe6" />
        <rect x="25" y="76" width="8" height="6" rx="2" fill="#f3efe6" />
        <path d="M14 30 H34 L36 58 H12 Z" fill={SIGNAL.bone} />
        <path d="M18 36 L30 44" stroke={SIGNAL.navy} strokeWidth="3" />
        <rect x="20" y="52" width="8" height="4" rx="1" fill={SIGNAL.gold} />
        <path d="M10 22 C10 10 38 10 38 22 L36 32 H12 Z" fill={SIGNAL.bone} />
        <path d="M18 14 L24 8 L30 14" fill="none" stroke={SIGNAL.gold} strokeWidth="2.2" strokeLinejoin="round" />
        <circle cx="20" cy="24" r="1.6" fill={SIGNAL.amber} />
        <circle cx="28" cy="24" r="1.6" fill={SIGNAL.amber} />
        <rect className="signal-arm signal-arm-l" x="8" y="34" width="6" height="16" rx="3" fill={SIGNAL.navy} />
        <rect className="signal-arm signal-arm-r" x="34" y="34" width="6" height="16" rx="3" fill={SIGNAL.navy} />
      </g>
    </svg>
  )
}
