import { describe, expect, it } from 'vitest'
import { formatClock, isSameCalendarDay, localDayKey, missionDay, weekDays } from './clock.ts'

describe('local calendar', () => {
  it('uses the local year-month-day, not UTC midnight', () => {
    const evening = new Date(2026, 8, 4, 22, 15, 0)
    expect(localDayKey(evening)).toBe('2026-09-04')
    expect(formatClock(evening).year).toBe(2026)
    expect(formatClock(evening).line).toMatch(/Friday/)
    expect(formatClock(evening).line).toMatch(/September 4, 2026/)
    expect(formatClock(evening).time).toMatch(/10:15 PM/)
  })

  it('builds a Monday–Sunday week that includes today', () => {
    const friday = new Date(2026, 8, 4)
    const days = weekDays(friday)
    expect(days).toHaveLength(7)
    expect(days[0]?.key).toBe('2026-08-31')
    expect(days[4]?.key).toBe('2026-09-04')
    expect(days[4]?.isToday).toBe(true)
    expect(days[6]?.key).toBe('2026-09-06')
  })

  it('treats keep-playing keys as the same calendar day', () => {
    expect(missionDay('2026-09-04-plus')).toBe('2026-09-04')
    expect(isSameCalendarDay('2026-09-04-plus', new Date(2026, 8, 4, 8))).toBe(true)
  })
})
