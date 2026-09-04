import { describe, expect, it } from 'vitest'
import { WORLDS } from '../data/worlds.ts'
import { WORLD_ROUTES } from '../data/routes.ts'
import { generateDailyMission } from './session.ts'
import { seedSkillStats } from './mastery.ts'
import {
  cameraFrame,
  followPoint,
  mapRsHeading,
  MAP_RS_HEADING,
  motionGoal,
  phasePace,
  routeAt,
  sessionProgress,
  shortestDelta,
  stepLiveT,
  wrap01,
  worldRoute,
} from './motion.ts'

describe('live world motion', () => {
  it('gives every district a closed driving loop', () => {
    for (const world of WORLDS) {
      const route = worldRoute(world.id)
      expect(route.length).toBeGreaterThanOrEqual(5)
      expect(WORLD_ROUTES[world.id]).toBeDefined()
    }
    expect(new Set(WORLDS.map((w) => JSON.stringify(WORLD_ROUTES[w.id]))).size).toBe(WORLDS.length)
  })

  it('keeps the Harbor RS on the loop and Signal behind it', () => {
    const route = worldRoute('bridge')
    const a = routeAt(route, 0)
    const b = routeAt(route, 0.25)
    expect(a.x).toBeGreaterThan(0)
    expect(a.y).toBeLessThan(100)
    expect(b.x).not.toBeCloseTo(a.x, 0)
    const follow = followPoint(route, 0.25, 0.05)
    expect(Math.hypot(follow.x - b.x, follow.y - b.y)).toBeGreaterThan(1)
  })

  it('eases around the wrap and speeds up on a correct surge', () => {
    expect(wrap01(-0.1)).toBeCloseTo(0.9)
    expect(shortestDelta(0.95, 0.05)).toBeCloseTo(0.1)
    expect(stepLiveT(0.1, 0.2, 0.5)).toBeGreaterThan(0.1)
    const idle = motionGoal(0.2, 2, phasePace('idle'), null)
    const boss = motionGoal(0.2, 2, phasePace('boss'), 'correct')
    expect(boss).not.toBe(idle)
    expect(phasePace('recap').parked).toBe(true)
    expect(phasePace('boss').drift).toBeGreaterThan(phasePace('warmup').drift)
  })

  it('pins the courtyard Harbor RS while the map scrolls under it', () => {
    const pan = cameraFrame(50, 40, 2, 50, 56)
    expect(pan.width).toBe(200)
    expect(pan.left + (50 / 100) * pan.width).toBeCloseTo(50)
    expect(pan.top + (40 / 100) * pan.height).toBeCloseTo(56)
    expect(mapRsHeading(0)).toBe(MAP_RS_HEADING)
    expect(mapRsHeading(90)).toBe(MAP_RS_HEADING + 90)
  })

  it('walks the 15-minute day from start to recap', () => {
    const mission = generateDailyMission(seedSkillStats(), {
      moduleId: 'm6',
      topicId: 'm6-t1',
      themes: ['basketball'],
      pressureLab: false,
      studentName: 'Test',
    })
    expect(sessionProgress(mission, { active: false, completed: false, phaseIndex: 0, itemIndex: 0 })).toBeLessThan(0.1)
    expect(sessionProgress(mission, { active: true, completed: false, phaseIndex: 0, itemIndex: 0 })).toBeGreaterThan(0)
    expect(sessionProgress(mission, { active: false, completed: true, phaseIndex: 4, itemIndex: 0 })).toBe(1)
  })
})
