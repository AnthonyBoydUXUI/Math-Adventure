import { useEffect, useRef } from 'react'
import { worldMap } from '../data/sheets.ts'
import { worldById, worldForModule } from '../data/worlds.ts'
import {
  followPoint,
  motionGoal,
  phasePace,
  routeAt,
  sessionProgress,
  stepLiveT,
  worldRoute,
  type MotionPhase,
  type MotionSurge,
} from '../engine/motion.ts'
import { cn } from '../lib/cn.ts'
import { usePlayerStore } from '../store.ts'
import { HarborSprite } from './HarborSprite.tsx'
import { SignalWalker } from './SignalWalker.tsx'

export function LiveWorld({
  worldId,
  phase = 'idle',
  progress = 0.08,
  surge = null,
  paint,
  wheels,
  compact,
  className,
}: {
  worldId: string
  phase?: MotionPhase
  progress?: number
  surge?: MotionSurge
  paint?: string
  wheels?: string
  compact?: boolean
  className?: string
}) {
  const world = worldById(worldId)
  const car = useRef<HTMLDivElement>(null)
  const walker = useRef<HTMLDivElement>(null)
  const tRef = useRef(progress)

  useEffect(() => {
    const points = worldRoute(worldId)
    tRef.current = progress
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const start = performance.now()
    let frame = 0

    const tick = (now: number) => {
      const elapsed = (now - start) / 1000
      const pace = phasePace(phase)
      const goal = reduced ? progress : motionGoal(progress, elapsed, pace, surge)
      tRef.current = reduced ? goal : stepLiveT(tRef.current, goal, surge === 'correct' ? 0.14 : 0.075)
      const pose = routeAt(points, tRef.current)
      const buddy = followPoint(points, tRef.current, pace.follow * 0.08)
      const bob = Math.sin(elapsed * 3.2 * pace.bob) * (compact ? 0.4 : 0.7)
      if (car.current) {
        car.current.style.left = `${pose.x}%`
        car.current.style.top = `${pose.y}%`
        car.current.style.transform = `translate(-50%, -50%) rotate(${pose.angle}deg)`
      }
      if (walker.current) {
        const face = pose.x >= buddy.x ? 1 : -1
        walker.current.style.left = `${buddy.x}%`
        walker.current.style.top = `${buddy.y + bob}%`
        walker.current.style.transform = `translate(-50%, -80%) scaleX(${face})`
      }
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [worldId, phase, progress, surge, compact])

  const pace = phasePace(phase)
  const name = world?.district ?? 'District'

  return (
    <div className={cn('relative overflow-hidden bg-[#05070b]', compact ? 'h-44' : 'aspect-square', className)}>
      <img src={worldMap(worldId)} alt={`${name} map`} className="absolute inset-0 h-full w-full object-cover" />
      <div
        ref={car}
        className="pointer-events-none absolute left-0 top-0 will-change-transform"
        style={{ width: compact ? 34 : 48 }}
      >
        <HarborSprite paint={paint} wheels={wheels} spinning={!pace.parked} className="h-auto w-full" />
      </div>
      <div
        ref={walker}
        className="pointer-events-none absolute left-0 top-0 will-change-transform"
        style={{ width: compact ? 22 : 32 }}
      >
        <SignalWalker walking={!pace.parked} cheer={phase === 'recap'} className="h-auto w-full" />
      </div>
    </div>
  )
}

export function LiveDay({ compact, className }: { compact?: boolean; className?: string }) {
  const parent = usePlayerStore((s) => s.parent)
  const mission = usePlayerStore((s) => s.mission)
  const session = usePlayerStore((s) => s.session)
  const cosmetics = usePlayerStore((s) => s.cosmetics)
  const world = worldForModule(parent.moduleId)
  const phase: MotionPhase = !session.active
    ? session.completed
      ? 'recap'
      : 'idle'
    : (mission.phases[session.phaseIndex]?.phase ?? 'idle')
  const progress = sessionProgress(mission, session)
  const surge: MotionSurge = session.lastResult ? (session.lastResult.correct ? 'correct' : 'miss') : null
  return (
    <LiveWorld
      worldId={world.id}
      phase={phase}
      progress={progress}
      surge={surge}
      paint={cosmetics.paint}
      wheels={cosmetics.wheels}
      compact={compact}
      className={className}
    />
  )
}
