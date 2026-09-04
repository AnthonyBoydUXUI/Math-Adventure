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
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-ink">
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
            'rounded-full border border-white/10 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wide text-ink',
            i === 0 && 'border-sky/40 bg-sky/10 text-sky',
          )}
        >
          {level === 0 ? step : kind === 'multistep' ? step.split(' ')[0] : step}
        </span>
      ))}
    </div>
  )
}
