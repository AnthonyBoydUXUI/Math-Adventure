import { Alignment, Fit, Layout, useRive, useStateMachineInput } from '@rive-app/react-canvas'
import { Component, useEffect, type ReactNode } from 'react'
import { riveInputName, riveSrc, riveStateMachine, type RiveMood } from '../engine/rive/config.ts'
import { cn } from '../lib/cn.ts'

class RiveGate extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  render() {
    if (this.state.failed) return null
    return this.props.children
  }
}

function RiveCanvas({
  mood,
  compact,
  className,
  caption,
}: {
  mood: RiveMood
  compact?: boolean
  className?: string
  caption: string
}) {
  const machine = riveStateMachine()
  const { rive, RiveComponent } = useRive({
    src: riveSrc(),
    stateMachines: machine,
    autoplay: true,
    layout: new Layout({ fit: Fit.Contain, alignment: Alignment.Center }),
  })
  const bump = useStateMachineInput(rive, machine, riveInputName())

  useEffect(() => {
    if (mood === 'correct' || mood === 'talk') bump?.fire()
  }, [mood, bump])

  return (
    <button
      type="button"
      onClick={() => bump?.fire()}
      className={cn(
        'relative overflow-hidden rounded-sm border border-white/10 bg-[#070910] text-left',
        compact ? 'h-28' : 'h-40',
        className,
      )}
      aria-label={caption}
    >
      <RiveComponent className="h-full w-full" />
      <span className="pointer-events-none absolute bottom-1.5 left-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/55">
        {caption}
      </span>
    </button>
  )
}

export function RivePlay(props: {
  mood?: RiveMood
  compact?: boolean
  className?: string
  caption?: string
}) {
  return (
    <RiveGate>
      <RiveCanvas
        mood={props.mood ?? 'idle'}
        compact={props.compact}
        className={props.className}
        caption={props.caption ?? 'Tap to rev'}
      />
    </RiveGate>
  )
}
