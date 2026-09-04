import type { ReactNode } from 'react'
import type { VisualSpec } from '../types.ts'

export function VisualMath({ visual }: { visual: VisualSpec }) {
  if (visual.kind === 'number-line') return <NumberLine v={visual} />
  if (visual.kind === 'fraction-bar') return <FractionBar v={visual} />
  if (visual.kind === 'ratio-grid') return <RatioGrid v={visual} />
  if (visual.kind === 'graph') return <MathGraph v={visual} />
  if (visual.kind === 'table') return <MathTable v={visual} />
  if (visual.kind === 'shape') return <ShapeViz v={visual} />
  if (visual.kind === 'balance') return <Balance v={visual} />
  if (visual.kind === 'court') return <Court v={visual} />
  if (visual.kind === 'money') return <Money v={visual} />
  if (visual.kind === 'line-plot') return <LinePlot v={visual} />
  if (visual.kind === 'angles') return <Angles v={visual} />
  return null
}

function Card({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-[22px] border-2 border-navy bg-white p-3 shadow-[0_4px_0_#141628]">
      {children}
    </div>
  )
}

function NumberLine({ v }: { v: Extract<VisualSpec, { kind: 'number-line' }> }) {
  const span = v.max - v.min
  const x = (n: number) => 20 + ((n - v.min) / span) * 260
  const ticks = []
  for (let t = v.min; t <= v.max; t += v.tick) ticks.push(t)
  return (
    <Card>
      <svg viewBox="0 0 300 80" className="w-full">
        {v.highlight ? (
          <rect
            x={x(v.highlight[0])}
            y="28"
            width={Math.max(8, x(v.highlight[1]) - x(v.highlight[0]))}
            height="16"
            rx="8"
            fill="#ff4d8d"
            opacity="0.25"
          />
        ) : null}
        <line x1="20" y1="36" x2="280" y2="36" stroke="#141628" strokeWidth="4" />
        {ticks.map((t) => (
          <g key={t}>
            <line x1={x(t)} y1="28" x2={x(t)} y2="44" stroke="#141628" strokeWidth="3" />
            <text x={x(t)} y="64" textAnchor="middle" fontSize="11" fontFamily="Nunito" fill="#141628">
              {t}
            </text>
          </g>
        ))}
        {v.points?.map((p) => (
          <g key={p.label ?? p.value}>
            <circle cx={x(p.value)} cy="36" r="8" fill={p.color ?? '#ff6a2b'} stroke="#141628" strokeWidth="3" />
            {p.label ? (
              <text x={x(p.value)} y="18" textAnchor="middle" fontSize="11" fontWeight="800" fill="#141628">
                {p.label}
              </text>
            ) : null}
          </g>
        ))}
      </svg>
    </Card>
  )
}

function FractionBar({ v }: { v: Extract<VisualSpec, { kind: 'fraction-bar' }> }) {
  const bar = (parts: number, filled: number, label?: string, color = '#3d9bff') => (
    <div className="space-y-1">
      {label ? <p className="text-xs font-extrabold uppercase tracking-wide text-navy/60">{label}</p> : null}
      <div className="flex overflow-hidden rounded-xl border-2 border-navy">
        {Array.from({ length: parts }, (_, i) => (
          <div
            key={i}
            className="h-8 flex-1 border-r-2 border-navy last:border-0"
            style={{ background: i < filled ? color : '#fff6ec' }}
          />
        ))}
      </div>
    </div>
  )
  return (
    <Card>
      <div className="space-y-3">
        {bar(v.parts, v.filled, v.label)}
        {v.second ? bar(v.second.parts, v.second.filled, v.second.label, '#ff6a2b') : null}
      </div>
    </Card>
  )
}

function RatioGrid({ v }: { v: Extract<VisualSpec, { kind: 'ratio-grid' }> }) {
  const cells = v.rows * v.cols
  return (
    <Card>
      <div
        className="grid gap-1"
        style={{ gridTemplateColumns: `repeat(${v.cols}, minmax(0, 1fr))` }}
      >
        {Array.from({ length: cells }, (_, i) => (
          <div
            key={i}
            className="aspect-square rounded-md border-2 border-navy"
            style={{ background: i < v.filled ? '#3d9bff' : '#ffc53d' }}
          />
        ))}
      </div>
      <p className="mt-2 text-center text-xs font-extrabold text-navy/70">
        {v.filledLabel ?? 'filled'} · {v.restLabel ?? 'rest'}
      </p>
    </Card>
  )
}

function MathGraph({ v }: { v: Extract<VisualSpec, { kind: 'graph' }> }) {
  const xMax = v.xMax ?? Math.max(...v.points.map((p) => p[0]), 1)
  const yMax = v.yMax ?? Math.max(...v.points.map((p) => p[1]), 1)
  const px = (x: number) => 36 + (x / xMax) * 230
  const py = (y: number) => 150 - (y / yMax) * 120
  const path = v.points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${px(p[0])} ${py(p[1])}`).join(' ')
  return (
    <Card>
      <svg viewBox="0 0 300 180" className="w-full">
        <line x1="36" y1="150" x2="270" y2="150" stroke="#141628" strokeWidth="3" />
        <line x1="36" y1="150" x2="36" y2="20" stroke="#141628" strokeWidth="3" />
        <text x="154" y="172" textAnchor="middle" fontSize="11" fontWeight="800">
          {v.xLabel}
        </text>
        <text x="14" y="90" fontSize="11" fontWeight="800" transform="rotate(-90 14 90)">
          {v.yLabel}
        </text>
        {v.line ? <path d={path} fill="none" stroke="#7b61ff" strokeWidth="4" /> : null}
        {v.points.map((p) => (
          <circle key={`${p[0]}-${p[1]}`} cx={px(p[0])} cy={py(p[1])} r="6" fill="#ff6a2b" stroke="#141628" strokeWidth="3" />
        ))}
      </svg>
    </Card>
  )
}

function MathTable({ v }: { v: Extract<VisualSpec, { kind: 'table' }> }) {
  return (
    <Card>
      <table className="w-full text-center text-sm font-extrabold">
        <thead>
          <tr className="bg-mist">
            {v.headers.map((h) => (
              <th key={h} className="border border-navy px-2 py-1">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {v.rows.map((row, i) => (
            <tr key={i} className={i === v.highlightRow ? 'bg-gold/40' : ''}>
              {row.map((cell, j) => (
                <td key={j} className="border border-navy px-2 py-1">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  )
}

function ShapeViz({ v }: { v: Extract<VisualSpec, { kind: 'shape' }> }) {
  return (
    <Card>
      <svg viewBox="0 0 260 140" className="w-full">
        {v.figure === 'circle' ? (
          <>
            <circle cx="90" cy="70" r="48" fill="#3d9bff" stroke="#141628" strokeWidth="4" />
            <line x1="90" y1="70" x2="138" y2="70" stroke="#141628" strokeWidth="3" />
            <text x="170" y="76" fontWeight="800" fontSize="16">
              r = {v.labels.r}
            </text>
          </>
        ) : v.figure === 'triangle' ? (
          <>
            <polygon points="40,120 140,120 140,30" fill="#ffc53d" stroke="#141628" strokeWidth="4" />
            <text x="80" y="136" fontWeight="800">
              {v.labels.a}
            </text>
            <text x="150" y="80" fontWeight="800">
              {v.labels.b}
            </text>
            <text x="70" y="70" fontWeight="800">
              {v.labels.c}
            </text>
          </>
        ) : v.figure === 'prism' ? (
          <>
            <polygon points="50,90 150,90 180,50 80,50" fill="#7b61ff" stroke="#141628" strokeWidth="3" />
            <polygon points="50,90 50,130 150,130 150,90" fill="#9f8cff" stroke="#141628" strokeWidth="3" />
            <polygon points="150,90 180,50 180,90 150,130" fill="#5b45d6" stroke="#141628" strokeWidth="3" />
            <text x="188" y="40" fontWeight="800" fontSize="13">
              {v.labels.l}×{v.labels.w}×{v.labels.h}
            </text>
          </>
        ) : (
          <>
            <rect x="40" y="40" width="140" height="70" fill="#22a36b" stroke="#141628" strokeWidth="4" />
            <text x="90" y="30" fontWeight="800">
              {v.labels.l}
            </text>
            <text x="188" y="80" fontWeight="800">
              {v.labels.w}
            </text>
          </>
        )}
      </svg>
    </Card>
  )
}

function Balance({ v }: { v: Extract<VisualSpec, { kind: 'balance' }> }) {
  return (
    <Card>
      <div className="flex items-end justify-center gap-6">
        <Pan items={v.left} />
        <div className="mb-2 h-2 w-16 rounded bg-navy" />
        <Pan items={v.right} />
      </div>
      <p className="mt-2 text-center text-xs font-extrabold uppercase tracking-widest text-navy/50">
        Left side · Move · Right side
      </p>
    </Card>
  )
}

function Pan({ items }: { items: string[] }) {
  return (
    <div className="min-w-24 rounded-2xl border-2 border-navy bg-cream px-3 py-2 text-center text-sm font-extrabold">
      {items.map((it) => (
        <div key={it}>{it}</div>
      ))}
    </div>
  )
}

function Court({ v }: { v: Extract<VisualSpec, { kind: 'court' }> }) {
  const pct = Math.round((v.made / v.attempts) * 100)
  return (
    <Card>
      <svg viewBox="0 0 260 140" className="w-full">
        <rect x="10" y="10" width="240" height="120" rx="8" fill="#c2410c" stroke="#141628" strokeWidth="4" />
        <rect x="90" y="10" width="80" height="50" fill="none" stroke="#fff" strokeWidth="3" />
        <circle cx="130" cy="60" r="22" fill="none" stroke="#fff" strokeWidth="3" />
        <circle cx="130" cy="28" r="8" fill="#fff" />
      </svg>
      <p className="mt-1 text-center text-sm font-extrabold">
        {v.made} / {v.attempts} · {pct}%
      </p>
    </Card>
  )
}

function Money({ v }: { v: Extract<VisualSpec, { kind: 'money' }> }) {
  return (
    <Card>
      <div className="flex items-center gap-3">
        <div className="rounded-xl border-2 border-navy bg-leaf px-4 py-3 font-display text-2xl font-extrabold text-white">
          ${v.dollars}
          {v.cents ? `.${v.cents}` : ''}
        </div>
        <p className="text-sm font-extrabold">{v.note}</p>
      </div>
    </Card>
  )
}

function LinePlot({ v }: { v: Extract<VisualSpec, { kind: 'line-plot' }> }) {
  const min = Math.min(...v.values) - 5
  const max = Math.max(...v.values) + 5
  const counts = new Map<number, number>()
  for (const n of v.values) counts.set(n, (counts.get(n) ?? 0) + 1)
  const x = (n: number) => 30 + ((n - min) / (max - min)) * 230
  return (
    <Card>
      <svg viewBox="0 0 300 110" className="w-full">
        <line x1="24" y1="80" x2="276" y2="80" stroke="#141628" strokeWidth="4" />
        {[...counts.entries()].map(([val, count]) =>
          Array.from({ length: count }, (_, i) => (
            <text key={`${val}-${i}`} x={x(val)} y={72 - i * 16} textAnchor="middle" fontSize="16" fontWeight="800">
              ×
            </text>
          )),
        )}
        {[...new Set(v.values)].sort((a, b) => a - b).map((n) => (
          <text key={n} x={x(n)} y="98" textAnchor="middle" fontSize="11" fontWeight="800">
            {n}
          </text>
        ))}
      </svg>
      <p className="text-center text-xs font-extrabold text-navy/60">{v.unit}</p>
    </Card>
  )
}

function Angles({ v }: { v: Extract<VisualSpec, { kind: 'angles' }> }) {
  return (
    <Card>
      <svg viewBox="0 0 260 130" className="w-full">
        <line x1="30" y1="90" x2="230" y2="90" stroke="#141628" strokeWidth="5" />
        {v.rays.map((r) => {
          const rad = ((-r.deg) * Math.PI) / 180
          const x2 = 130 + Math.cos(rad) * 90
          const y2 = 90 + Math.sin(rad) * 70
          return (
            <g key={r.deg}>
              <line x1="130" y1="90" x2={x2} y2={y2} stroke="#ff4d8d" strokeWidth="4" />
              <text x={x2} y={y2 - 6} fontSize="12" fontWeight="800">
                {r.label}
              </text>
            </g>
          )
        })}
      </svg>
    </Card>
  )
}
