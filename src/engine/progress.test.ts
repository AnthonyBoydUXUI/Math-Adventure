import { describe, expect, it } from 'vitest'
import { buildBookmark, nextCurriculumStep, phaseProgress } from './progress.ts'
import { generateDailyMission } from './session.ts'
import { seedSkillStats } from './mastery.ts'
import type { ParentSettings } from '../types.ts'

const parent: ParentSettings = {
  moduleId: 'm6',
  topicId: 'm6-t1',
  themes: ['basketball'],
  pressureLab: false,
  studentName: 'Test',
}

describe('forward curriculum', () => {
  it('advances to the next topic when mastery is ready', () => {
    const next = nextCurriculumStep('m1', 'm1-t1', 80)
    expect(next.reason).toBe('advance')
    expect(next.topicId).toBe('m1-t2')
    expect(next.moduleId).toBe('m1')
  })

  it('stays to deepen when mastery is still forming', () => {
    const stay = nextCurriculumStep('m6', 'm6-t1', 40)
    expect(stay.reason).toBe('deepen')
    expect(stay.topicId).toBe('m6-t1')
  })

  it('caps at the last classroom topic', () => {
    const cap = nextCurriculumStep('m11', 'm11-t1', 95)
    expect(cap.reason).toBe('cap')
    expect(cap.topicId).toBe('m11-t1')
  })
})

describe('left-off bookmark', () => {
  it('names the exact phase and item for an active session', () => {
    const mission = generateDailyMission(seedSkillStats(), parent, new Date(2026, 8, 4))
    const mark = buildBookmark({
      now: new Date(2026, 8, 4, 16, 5),
      parent,
      mission,
      session: { active: true, completed: false, phaseIndex: 1, itemIndex: 0 },
      mastery: 50,
    })
    const progress = phaseProgress(mission, 1, 0)
    expect(mark.kind).toBe('mid-session')
    expect(mark.label).toContain(progress.label)
    expect(mark.label).toMatch(/1\//)
    expect(mark.dayKey).toBe('2026-09-04')
  })

  it('points forward after today’s 15 when mastery is ready', () => {
    const mission = generateDailyMission(seedSkillStats(), parent, new Date(2026, 8, 4))
    const mark = buildBookmark({
      now: new Date(2026, 8, 4, 16, 5),
      parent,
      mission,
      session: { active: false, completed: true, phaseIndex: 4, itemIndex: 0 },
      mastery: 80,
    })
    expect(mark.kind).toBe('next-topic')
    expect(mark.nextTopicId).toBe('m7-t1')
    expect(mark.label).toMatch(/Next:/)
  })

  it('lets a ready student stay and deepen instead of auto-advancing', () => {
    const mission = generateDailyMission(seedSkillStats(), parent, new Date(2026, 8, 4))
    const mark = buildBookmark({
      now: new Date(2026, 8, 4, 16, 5),
      parent,
      mission,
      session: { active: false, completed: true, phaseIndex: 4, itemIndex: 0 },
      mastery: 80,
      path: 'deepen',
    })
    expect(mark.kind).toBe('today-done')
    expect(mark.nextTopicId).toBe('m6-t1')
  })
})
