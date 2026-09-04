import { describe, expect, it } from 'vitest'
import { evaluateAchievements, HINT_SPARK_COST, xpForAttempt } from './scoring.ts'

describe('competence-contingent XP', () => {
  it('awards XP only when the math is right', () => {
    expect(xpForAttempt(false, 'lab', true)).toBe(0)
    expect(xpForAttempt(true, 'warmup', false)).toBe(20)
    expect(xpForAttempt(true, 'lab', true)).toBe(34)
  })

  it('prices extra looks so sparks buy process', () => {
    expect(HINT_SPARK_COST).toBe(8)
  })

  it('unlocks Locked In from five lab hits, not a no-miss streak', () => {
    const earned = evaluateAchievements({
      unlocked: [],
      attempts: [],
      streak: 1,
      labCorrectCount: 5,
      usedVoiceAnotherWay: false,
      completedFlight: false,
    })
    expect(earned).toContain('locked-in')
  })
})
