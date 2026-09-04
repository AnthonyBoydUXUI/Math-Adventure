import { worldForModule } from '../data/worlds.ts'
import { cn } from '../lib/cn.ts'

export function WorldScene({
  moduleId,
  className,
}: {
  moduleId: string
  className?: string
}) {
  const world = worldForModule(moduleId)
  return (
    <div className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)} aria-hidden>
      <Scene id={world.id} accent={world.accent} />
    </div>
  )
}

function Scene({ id, accent }: { id: string; accent: string }) {
  if (id === 'market') return <Market accent={accent} />
  if (id === 'belowzero') return <Snow />
  if (id === 'gallery') return <Gallery accent={accent} />
  if (id === 'gearworks') return <Gears accent={accent} />
  if (id === 'bridge') return <Scale />
  if (id === 'boundary') return <Waves />
  if (id === 'plaza') return <Angles />
  if (id === 'courtcrate') return <Court />
  if (id === 'arcade') return <Arcade />
  if (id === 'station') return <Bars />
  if (id === 'peak') return <Peak />
  return <Harbor accent={accent} />
}

function Harbor({ accent }: { accent: string }) {
  return (
    <svg viewBox="0 0 360 160" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice">
      <circle className="float-slow" cx="300" cy="36" r="18" fill={accent} opacity="0.85" />
      <g className="drift-fast">
        <ellipse cx="40" cy="28" rx="34" ry="14" fill="#fff" opacity="0.7" />
        <ellipse cx="62" cy="28" rx="22" ry="12" fill="#fff" opacity="0.7" />
      </g>
      <g className="drift-mid">
        <ellipse cx="160" cy="50" rx="40" ry="16" fill="#fff" opacity="0.55" />
        <ellipse cx="188" cy="50" rx="24" ry="12" fill="#fff" opacity="0.55" />
      </g>
      <g className="fly-across">
        <polygon points="0,70 28,64 28,76" fill="#fff6ec" />
        <rect x="8" y="66" width="18" height="6" fill="#141628" />
      </g>
    </svg>
  )
}

function Market({ accent }: { accent: string }) {
  return (
    <svg viewBox="0 0 360 160" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice">
      <circle className="coin-a" cx="70" cy="40" r="16" fill={accent} stroke="#141628" strokeWidth="3" />
      <circle className="coin-b" cx="300" cy="48" r="12" fill="#ffc53d" stroke="#141628" strokeWidth="3" />
      <text className="coin-a" x="64" y="46" fontSize="14" fontWeight="800">
        %
      </text>
      <rect className="bob-hi" x="240" y="90" width="50" height="28" rx="8" fill="#fff6ec" opacity="0.8" />
    </svg>
  )
}

function Snow() {
  return (
    <svg viewBox="0 0 360 160" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice">
      {['fall-a', 'fall-b', 'fall-c', 'fall-d'].map((cls, i) => (
        <circle key={cls} className={cls} cx={40 + i * 80} cy="-6" r={4 + (i % 3)} fill="#fff" />
      ))}
      <path d="M20 140 Q90 110 160 140 T300 140" fill="none" stroke="#fff" strokeWidth="6" opacity="0.35" className="wave-line" />
    </svg>
  )
}

function Gallery({ accent }: { accent: string }) {
  return (
    <svg viewBox="0 0 360 160" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice">
      <rect className="drip-a" x="40" y="8" width="18" height="40" rx="9" fill={accent} opacity="0.85" />
      <rect className="drip-b" x="280" y="4" width="22" height="52" rx="11" fill="#ffc53d" opacity="0.8" />
      <circle className="blob" cx="200" cy="36" r="20" fill="#fff6ec" opacity="0.55" />
    </svg>
  )
}

function Gears({ accent }: { accent: string }) {
  return (
    <svg viewBox="0 0 360 160" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice">
      <g className="spin-slow" transform="translate(70 50)">
        <circle r="22" fill={accent} stroke="#141628" strokeWidth="3" />
        <rect x="-4" y="-28" width="8" height="56" fill="#141628" />
        <rect x="-28" y="-4" width="56" height="8" fill="#141628" />
      </g>
      <g className="spin-rev" transform="translate(290 70)">
        <circle r="16" fill="#ffc53d" stroke="#141628" strokeWidth="3" />
        <rect x="-3" y="-20" width="6" height="40" fill="#141628" />
      </g>
    </svg>
  )
}

function Scale() {
  return (
    <svg viewBox="0 0 360 160" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice">
      <g className="tilt">
        <rect x="80" y="70" width="200" height="8" rx="4" fill="#fff6ec" />
        <rect x="70" y="86" width="50" height="28" rx="8" fill="#ffc53d" />
        <rect x="240" y="52" width="50" height="28" rx="8" fill="#3d9bff" />
      </g>
    </svg>
  )
}

function Waves() {
  return (
    <svg viewBox="0 0 360 160" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice">
      <path className="wave-line" d="M0 110 Q45 90 90 110 T180 110 T270 110 T360 110 V160 H0 Z" fill="#fff" opacity="0.25" />
      <path className="wave-line-2" d="M0 124 Q40 108 80 124 T160 124 T240 124 T360 124 V160 H0 Z" fill="#fff" opacity="0.2" />
    </svg>
  )
}

function Angles() {
  return (
    <svg viewBox="0 0 360 160" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice">
      <g className="sweep" transform="translate(300 90)">
        <line x1="0" y1="0" x2="50" y2="0" stroke="#fff6ec" strokeWidth="6" />
        <line x1="0" y1="0" x2="40" y2="-30" stroke="#ffc53d" strokeWidth="6" />
      </g>
    </svg>
  )
}

function Court() {
  return (
    <svg viewBox="0 0 360 160" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice">
      <circle className="ball-bounce" cx="300" cy="40" r="16" fill="#ff6a2b" stroke="#141628" strokeWidth="3" />
      <path d="M292 34 q8 4 16 0" fill="none" stroke="#141628" strokeWidth="2" />
      <rect x="40" y="100" width="90" height="12" fill="#fff" opacity="0.25" />
    </svg>
  )
}

function Arcade() {
  return (
    <svg viewBox="0 0 360 160" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice">
      <g className="spin-slow" transform="translate(300 50)">
        <circle r="26" fill="#fff6ec" stroke="#141628" strokeWidth="3" />
        <path d="M0 0 L26 0 A26 26 0 0 1 0 26 Z" fill="#ff4d8d" />
        <path d="M0 0 L0 26 A26 26 0 0 1 -26 0 Z" fill="#7b61ff" />
      </g>
    </svg>
  )
}

function Bars() {
  return (
    <svg viewBox="0 0 360 160" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice">
      <rect className="bar-a" x="40" y="70" width="16" height="50" fill="#fff6ec" />
      <rect className="bar-b" x="64" y="50" width="16" height="70" fill="#ffc53d" />
      <rect className="bar-c" x="88" y="90" width="16" height="30" fill="#fff" opacity="0.7" />
    </svg>
  )
}

function Peak() {
  return (
    <svg viewBox="0 0 360 160" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice">
      <polygon points="40,140 110,40 180,140" fill="#fff" opacity="0.2" />
      <circle className="twinkle" cx="260" cy="28" r="4" fill="#ffc53d" />
      <circle className="twinkle-2" cx="300" cy="48" r="3" fill="#fff" />
      <circle className="twinkle" cx="220" cy="20" r="3" fill="#fff" />
    </svg>
  )
}
