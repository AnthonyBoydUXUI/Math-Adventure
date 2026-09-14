import { describe, expect, it } from 'vitest'
import { applyLessonClear, applyStageClear, applyWorldClear, emptyRewards, worldStars } from './rewards.ts'
import { seedSkillStats } from './mastery.ts'

describe('stage and lesson rewards', () => {
  it('pays sparks once per world stage', () => {
    const first = applyStageClear(emptyRewards(), 'harbor', 'warmup')
    expect(first.sparks).toBe(6)
    const again = applyStageClear(first.rewards, 'harbor', 'warmup')
    expect(again.sparks).toBe(0)
    expect(worldStars(first.rewards, 'harbor')).toBe(1)
  })

  it('clears a lesson and a world once', () => {
    const lesson = applyLessonClear(emptyRewards(), 'two-step-eq', 'Write and solve equations')
    expect(lesson.sparks).toBe(18)
    const world = applyWorldClear(lesson.rewards, 'bridge', 'Balance Bridge')
    expect(world.sparks).toBe(36)
    expect(applyWorldClear(world.rewards, 'bridge', 'Balance Bridge').sparks).toBe(0)
    expect(seedSkillStats()).toBeTruthy()
  })
})
