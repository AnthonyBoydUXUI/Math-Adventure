import { scaffoldingLevel } from '../engine/mastery.ts'
import { cn } from '../lib/cn.ts'
import type { ScoreboardKind } from '../types.ts'

const WORD = ['KNOW', 'FIND', 'MOVE', 'WORK', 'CHECK']
const EQ = ['LEFT SIDE', 'MOVE', 'RIGHT SIDE']
const MULTI = [
  'What information matters?',
  'What are we solving?',
  'What math move?',
  'Solve',
  'Does it make sense?',
]

export function Scoreboard({
  kind,
  mastery,
  compact,
}: {
  kind: ScoreboardKind
  mastery: number
  compact?: boolean
}) {
  const level = scaffoldingLevel(mastery)
  const steps = kind === 'equation' ? EQ : kind === 'multistep' ? MULTI : WORD
  if (level === 2 && compact) {
    return (
      <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-navy/40">
        Work it · expand if you need the board
      </p>
    )
  }
  return (
    <div className="flex flex-wrap gap-1.5">
      {steps.map((step, i) => (
        <span
          key={step}
          className={cn(
            'rounded-full border-2 border-navy px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wide',
            i === 0 && 'bg-gold',
            i === 1 && 'bg-sky text-white',
            i === 2 && 'bg-orange text-white',
            i === 3 && 'bg-leaf text-white',
            i === 4 && 'bg-pink text-white',
            level > 0 && i > 2 && 'opacity-80',
          )}
        >
          {level === 0 ? step : kind === 'multistep' ? step.split(' ')[0] : step}
        </span>
      ))}
    </div>
  )
}
