import type { DailyMission, Phase } from '../types.ts'
import { WORLD_ROUTES, type RoutePoint } from '../data/routes.ts'

export type MotionPhase = Phase | 'idle'
export type MotionSurge = 'correct' | 'miss' | null

export interface MotionPace {
  drift: number
  bob: number
  parked: boolean
  follow: number
  spin: number
}

export function phasePace(phase: MotionPhase): MotionPace {
  if (phase === 'boss') return { drift: 0.05, bob: 1.25, parked: false, follow: 0.62, spin: 2.4 }
  if (phase === 'lab') return { drift: 0.036, bob: 1.1, parked: false, follow: 0.58, spin: 1.8 }
  if (phase === 'builder') return { drift: 0.028, bob: 1, parked: false, follow: 0.55, spin: 1.4 }
  if (phase === 'warmup') return { drift: 0.02, bob: 1, parked: false, follow: 0.52, spin: 1.1 }
  if (phase === 'recap') return { drift: 0, bob: 1.35, parked: true, follow: 0.22, spin: 0 }
  return { drift: 0.016, bob: 0.85, parked: false, follow: 0.5, spin: 0.9 }
}

export function sessionProgress(mission: DailyMission, session: { active: boolean; completed: boolean; phaseIndex: number; itemIndex: number }): number {
  const total = mission.phases.reduce((n, p) => n + p.questionIds.length, 0)
  if (!total) return session.completed ? 1 : 0.08
  if (session.completed) return 1
  if (!session.active) return 0.06
  const done = mission.phases.slice(0, session.phaseIndex).reduce((n, p) => n + p.questionIds.length, 0) + session.itemIndex
  return Math.min(0.98, (done + 0.12) / total)
}

export function worldRoute(id: string): RoutePoint[] {
  return WORLD_ROUTES[id] ?? WORLD_ROUTES.harbor!
}

export function wrap01(t: number) {
  return ((t % 1) + 1) % 1
}

export function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

export function shortestDelta(from: number, to: number) {
  let d = to - from
  if (d > 0.5) d -= 1
  if (d < -0.5) d += 1
  return d
}

export function routeAt(points: RoutePoint[], t: number): { x: number; y: number; angle: number } {
  if (points.length === 0) return { x: 50, y: 50, angle: 0 }
  if (points.length === 1) return { x: points[0]!.x, y: points[0]!.y, angle: 0 }
  const u = wrap01(t) * points.length
  const i = Math.min(points.length - 1, Math.floor(u))
  const next = points[(i + 1) % points.length]!
  const cur = points[i]!
  const f = u - i
  const x = lerp(cur.x, next.x, f)
  const y = lerp(cur.y, next.y, f)
  const angle = (Math.atan2(next.y - cur.y, next.x - cur.x) * 180) / Math.PI + 90
  return { x, y, angle }
}

export function followPoint(points: RoutePoint[], t: number, lag: number) {
  return routeAt(points, wrap01(t - lag))
}

export function stepLiveT(current: number, goal: number, ease = 0.07) {
  return wrap01(current + shortestDelta(current, goal) * ease)
}

export function motionGoal(progress: number, elapsedSec: number, pace: MotionPace, surge: MotionSurge) {
  if (pace.parked) return wrap01(Math.max(progress, 0.92))
  let t = wrap01(progress + elapsedSec * pace.drift)
  if (surge === 'correct') t = wrap01(t + 0.035)
  if (surge === 'miss') t = wrap01(t - 0.012)
  return t
}
