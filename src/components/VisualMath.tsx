import type { ReactNode } from 'react'
import type { VisualSpec } from '../types.ts'

const LINE = '#8aa0b4'
const ACCENT = '#7eb6d6'
const MARK = '#c4a800'
const FILL = '#1a2f4a'

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
  return <div className="rounded-sm border border-white/10 bg-[#0a0d12] p-3">{children}</div>
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
            fill={ACCENT}
            opacity="0.18"
          />
        ) : null}
        <line x1="20" y1="36" x2="280" y2="36" stroke={LINE} strokeWidth="1.5" />
        {ticks.map((t) => (
          <g key={t}>
            <line x1={x(t)} y1="28" x2={x(t)} y2="44" stroke={LINE} strokeWidth="1.25" />
            <text x={x(t)} y="64" textAnchor="middle" fontSize="11" fill="#9aa4b8">
              {t}
            </text>
          </g>
        ))}
        {v.points?.map((p) => (
          <g key={p.label ?? p.value}>
            <rect x={x(p.value) - 5} y="31" width="10" height="10" fill={p.color ?? MARK} />
            {p.label ? (
              <text x={x(p.value)} y="18" textAnchor="middle" fontSize="11" fontWeight="600" fill="#e8eef8">
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
  const bar = (parts: number, filled: number, label?: string, color = ACCENT) => (
    <div className="space-y-1">
      {label ? <p className="text-xs font-medium uppercase tracking-wide text-ink">{label}</p> : null}
      <div className="flex overflow-hidden rounded-sm border border-white/10">
        {Array.from({ length: parts }, (_, i) => (
          <div
            key={i}
            className="h-8 flex-1 border-r border-white/10 last:border-0"
            style={{ background: i < filled ? color : '#141820' }}
          />
        ))}
      </div>
    </div>
  )
  return (
    <Card>
      <div className="space-y-3">
        {bar(v.parts, v.filled, v.label)}
        {v.second ? bar(v.second.parts, v.second.filled, v.second.label, MARK) : null}
      </div>
    </Card>
  )
}

function RatioGrid({ v }: { v: Extract<VisualSpec, { kind: 'ratio-grid' }> }) {
  const cells = v.rows * v.cols
  return (
    <Card>
      <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${v.cols}, minmax(0, 1fr))` }}>
        {Array.from({ length: cells }, (_, i) => (
          <div
            key={i}
            className="aspect-square rounded-sm border border-white/10"
            style={{ background: i < v.filled ? FILL : '#1c2230' }}
          />
        ))}
      </div>
      <p className="mt-2 text-center text-xs font-medium text-ink">
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
        <line x1="36" y1="150" x2="270" y2="150" stroke={LINE} strokeWidth="1.25" />
        <line x1="36" y1="150" x2="36" y2="20" stroke={LINE} strokeWidth="1.25" />
        <text x="154" y="172" textAnchor="middle" fontSize="11" fontWeight="600" fill="#9aa4b8">
          {v.xLabel}
        </text>
        <text x="14" y="90" fontSize="11" fontWeight="600" fill="#9aa4b8" transform="rotate(-90 14 90)">
          {v.yLabel}
        </text>
        {v.line ? <path d={path} fill="none" stroke={ACCENT} strokeWidth="2" /> : null}
        {v.points.map((p) => (
          <rect key={`${p[0]}-${p[1]}`} x={px(p[0]) - 3} y={py(p[1]) - 3} width="6" height="6" fill={MARK} />
        ))}
      </svg>
    </Card>
  )
}

function MathTable({ v }: { v: Extract<VisualSpec, { kind: 'table' }> }) {
  return (
    <Card>
      <table className="w-full text-center text-sm font-semibold">
        <thead>
          <tr className="bg-mist">
            {v.headers.map((h) => (
              <th key={h} className="border border-white/10 px-2 py-1 text-ink">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {v.rows.map((row, i) => (
            <tr key={i} className={i === v.highlightRow ? 'bg-sky/10' : ''}>
              {row.map((cell, j) => (
                <td key={j} className="border border-white/10 px-2 py-1">
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
            <circle cx="90" cy="70" r="48" fill="none" stroke={ACCENT} strokeWidth="1.75" />
            <line x1="90" y1="70" x2="138" y2="70" stroke={LINE} strokeWidth="1.25" />
            <text x="170" y="76" fontWeight="600" fontSize="16" fill="#e8eef8">
              r = {v.labels.r}
            </text>
          </>
        ) : v.figure === 'triangle' ? (
          <>
            <polygon points="40,120 140,120 140,30" fill="none" stroke={ACCENT} strokeWidth="1.75" />
            <text x="80" y="136" fontWeight="600" fill="#9aa4b8">
              {v.labels.a}
            </text>
            <text x="150" y="80" fontWeight="600" fill="#9aa4b8">
              {v.labels.b}
            </text>
            <text x="70" y="70" fontWeight="600" fill="#9aa4b8">
              {v.labels.c}
            </text>
          </>
        ) : v.figure === 'prism' ? (
          <>
            <polygon points="50,90 150,90 180,50 80,50" fill="none" stroke={ACCENT} strokeWidth="1.5" />
            <polygon points="50,90 50,130 150,130 150,90" fill="none" stroke={LINE} strokeWidth="1.5" />
            <polygon points="150,90 180,50 180,90 150,130" fill="none" stroke={MARK} strokeWidth="1.5" />
            <text x="188" y="40" fontWeight="600" fontSize="13" fill="#e8eef8">
              {v.labels.l}×{v.labels.w}×{v.labels.h}
            </text>
          </>
        ) : (
          <>
            <rect x="40" y="40" width="140" height="70" fill="none" stroke={ACCENT} strokeWidth="1.75" />
            <text x="90" y="30" fontWeight="600" fill="#9aa4b8">
              {v.labels.l}
            </text>
            <text x="188" y="80" fontWeight="600" fill="#9aa4b8">
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
        <div className="mb-2 h-px w-16 bg-ink" />
        <Pan items={v.right} />
      </div>
      <p className="mt-2 text-center text-xs font-medium uppercase tracking-widest text-ink">
        Left side · Move · Right side
      </p>
    </Card>
  )
}

function Pan({ items }: { items: string[] }) {
  return (
    <div className="min-w-24 rounded-sm border border-white/10 bg-chrome px-3 py-2 text-center text-sm font-semibold">
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
        <rect x="10" y="10" width="240" height="120" fill="none" stroke={LINE} strokeWidth="1.5" />
        <rect x="90" y="10" width="80" height="50" fill="none" stroke={ACCENT} strokeWidth="1.25" />
        <circle cx="130" cy="60" r="22" fill="none" stroke={ACCENT} strokeWidth="1.25" />
        <rect x="126" y="24" width="8" height="8" fill="#e8eef8" />
      </svg>
      <p className="mt-1 text-center text-sm font-semibold">
        {v.made} / {v.attempts} · {pct}%
      </p>
    </Card>
  )
}

function Money({ v }: { v: Extract<VisualSpec, { kind: 'money' }> }) {
  return (
    <Card>
      <div className="flex items-center gap-3">
        <div className="rounded-sm border border-white/10 bg-paper px-4 py-3 font-display text-2xl font-semibold text-navy">
          ${v.dollars}
          {v.cents ? `.${v.cents}` : ''}
        </div>
        <p className="text-sm font-medium text-ink">{v.note}</p>
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
        <line x1="24" y1="80" x2="276" y2="80" stroke={LINE} strokeWidth="1.25" />
        {[...counts.entries()].map(([val, count]) =>
          Array.from({ length: count }, (_, i) => (
            <text key={`${val}-${i}`} x={x(val)} y={72 - i * 16} textAnchor="middle" fontSize="14" fontWeight="600" fill={ACCENT}>
              ×
            </text>
          )),
        )}
        {[...new Set(v.values)].sort((a, b) => a - b).map((n) => (
          <text key={n} x={x(n)} y="98" textAnchor="middle" fontSize="11" fontWeight="600" fill="#9aa4b8">
            {n}
          </text>
        ))}
      </svg>
      <p className="text-center text-xs font-medium text-ink">{v.unit}</p>
    </Card>
  )
}

function Angles({ v }: { v: Extract<VisualSpec, { kind: 'angles' }> }) {
  return (
    <Card>
      <svg viewBox="0 0 260 130" className="w-full">
        <line x1="30" y1="90" x2="230" y2="90" stroke={LINE} strokeWidth="1.5" />
        {v.rays.map((r) => {
          const rad = ((-r.deg) * Math.PI) / 180
          const x2 = 130 + Math.cos(rad) * 90
          const y2 = 90 + Math.sin(rad) * 70
          return (
            <g key={r.deg}>
              <line x1="130" y1="90" x2={x2} y2={y2} stroke={ACCENT} strokeWidth="1.5" />
              <text x={x2} y={y2 - 6} fontSize="12" fontWeight="600" fill="#e8eef8">
                {r.label}
              </text>
            </g>
          )
        })}
      </svg>
    </Card>
  )
}
