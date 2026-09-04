import { useEffect, useRef } from 'react'
import { VEHICLE_SHEETS, worldLiveMap } from '../data/sheets.ts'
import { worldById, worldForModule } from '../data/worlds.ts'
import {
  cameraFrame,
  mapRsHeading,
  MAP_SCALE_COMPACT,
  MAP_SCALE_FULL,
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

export function LiveWorld({
  worldId,
  phase = 'idle',
  progress = 0.08,
  surge = null,
  compact,
  className,
}: {
  worldId: string
  phase?: MotionPhase
  progress?: number
  surge?: MotionSurge
  compact?: boolean
  className?: string
}) {
  const world = worldById(worldId)
  const mapRef = useRef<HTMLImageElement>(null)
  const carRef = useRef<HTMLImageElement>(null)
  const lightRef = useRef<HTMLDivElement>(null)
  const tRef = useRef(progress)
  const scale = compact ? MAP_SCALE_COMPACT : MAP_SCALE_FULL
  const aimX = 50
  const aimY = compact ? 60 : 56
  const start = routeAt(worldRoute(worldId), progress)
  const first = cameraFrame(start.x, start.y, scale, aimX, aimY)

  useEffect(() => {
    const points = worldRoute(worldId)
    tRef.current = progress
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const born = performance.now()
    let frame = 0

    const tick = (now: number) => {
      const elapsed = (now - born) / 1000
      const pace = phasePace(phase)
      const goal = reduced ? progress : motionGoal(progress, elapsed, pace, surge)
      tRef.current = reduced ? goal : stepLiveT(tRef.current, goal, surge === 'correct' ? 0.14 : 0.075)
      const pose = routeAt(points, tRef.current)
      const pan = cameraFrame(pose.x, pose.y, scale, aimX, aimY)
      const bounce = reduced ? 0 : Math.sin(elapsed * 2.2 * pace.bob) * (compact ? 0.28 : 0.45)
      if (mapRef.current) {
        mapRef.current.style.width = `${pan.width}%`
        mapRef.current.style.height = `${pan.height}%`
        mapRef.current.style.left = `${pan.left}%`
        mapRef.current.style.top = `${pan.top + bounce}%`
      }
      if (carRef.current) {
        carRef.current.style.transform = `translate(-50%, -50%) rotate(${mapRsHeading(pose.angle)}deg)`
      }
      if (lightRef.current && !reduced) {
        const lx = 48 + Math.sin(elapsed * 0.2) * 14
        const ly = 36 + Math.cos(elapsed * 0.16) * 11
        lightRef.current.style.background = `radial-gradient(ellipse 60% 48% at ${lx}% ${ly}%, rgba(255,228,170,0.18), transparent 68%)`
      }
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [worldId, phase, progress, surge, compact, scale, aimX, aimY])

  const name = world?.district ?? 'District'

  return (
    <div
      className={cn('relative overflow-hidden bg-[#05070b]', compact ? 'h-52' : 'aspect-square', className)}
      role="img"
      aria-label={`${name}, live`}
    >
      <img
        ref={mapRef}
        src={worldLiveMap(worldId)}
        alt=""
        className="pointer-events-none absolute max-w-none select-none"
        style={{
          width: `${first.width}%`,
          height: `${first.height}%`,
          left: `${first.left}%`,
          top: `${first.top}%`,
        }}
      />
      <div ref={lightRef} className="pointer-events-none absolute inset-0 mix-blend-soft-light" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_42%,rgba(5,7,11,0.5)_100%)]" />
      <img
        ref={carRef}
        src={VEHICLE_SHEETS.mapRs}
        alt=""
        className="pointer-events-none absolute will-change-transform"
        style={{
          left: `${aimX}%`,
          top: `${aimY}%`,
          width: compact ? '30%' : '26%',
          height: 'auto',
          transform: `translate(-50%, -50%) rotate(${mapRsHeading(start.angle)}deg)`,
        }}
      />
    </div>
  )
}

export function LiveDay({ compact, className }: { compact?: boolean; className?: string }) {
  const parent = usePlayerStore((s) => s.parent)
  const mission = usePlayerStore((s) => s.mission)
  const session = usePlayerStore((s) => s.session)
  const world = worldForModule(parent.moduleId)
  const phase: MotionPhase = !session.active
    ? session.completed
      ? 'recap'
      : 'idle'
    : (mission.phases[session.phaseIndex]?.phase ?? 'idle')
  const progress = sessionProgress(mission, session)
  const surge: MotionSurge = session.lastResult ? (session.lastResult.correct ? 'correct' : 'miss') : null
  return <LiveWorld worldId={world.id} phase={phase} progress={progress} surge={surge} compact={compact} className={className} />
}
