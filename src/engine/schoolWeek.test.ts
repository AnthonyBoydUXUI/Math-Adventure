import { describe, expect, it } from 'vitest'
import { generateDailyMission } from './session.ts'
import { seedSkillStats } from './mastery.ts'
import { activeSchoolWeek, schoolDaySkill, weekKey } from './schoolWeek.ts'
import { identifyWeekSkills, simplestWalkthrough, buildHomeworkPlan } from './homework.ts'
import type { ParentSettings } from '../types.ts'

const monday = new Date('2026-09-14T12:00:00')

describe('school week coach', () => {
  it('finds more than one skill in a week note', () => {
    expect(identifyWeekSkills('equations and percent tax on Friday')).toEqual(
      expect.arrayContaining(['two-step-eq', 'percent-of']),
    )
  })

  it('walks two-step equations from a tiny version first', () => {
    const steps = simplestWalkthrough('two-step-eq')
    expect(steps[0]?.title.toLowerCase()).toMatch(/what/)
    expect(steps.some((s) => /tiny/i.test(s.title))).toBe(true)
    expect(steps[steps.length - 1]?.title.toLowerCase()).toMatch(/check/)
  })

  it('steers the 15-minute day to this week’s school skill', () => {
    const parent: ParentSettings = {
      moduleId: 'm6',
      topicId: 'm6-t1',
      themes: ['basketball'],
      pressureLab: false,
      studentName: 'Test',
      schoolWeek: {
        weekKey: weekKey(monday),
        note: 'unit rate quiz',
        skillIds: ['unit-rate'],
        gradeBand: '7',
        pages: [],
      },
    }
    expect(schoolDaySkill(parent, monday)).toBe('unit-rate')
    const mission = generateDailyMission(seedSkillStats(), parent, monday)
    expect(mission.focusSkillId).toBe('unit-rate')
    expect(activeSchoolWeek({ ...parent, schoolWeek: { ...parent.schoolWeek!, weekKey: '2026-01-01' } }, monday)).toBeUndefined()
  })

  it('still coaches a pasted percent problem without dumping the answer first', () => {
    const plan = buildHomeworkPlan('What is 15% of 40?')
    expect(plan.steps.length).toBeGreaterThanOrEqual(4)
    expect(plan.check).toBe(6)
  })
})
