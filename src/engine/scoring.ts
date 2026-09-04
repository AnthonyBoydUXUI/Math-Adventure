import type { AttemptRecord } from '../types.ts'
import { ACHIEVEMENTS } from '../data/meta.ts'

/** First hint is coaching. Extra looks cost sparks so the currency buys process, not an answer. */
export const HINT_SPARK_COST = 8

export function xpForAttempt(correct: boolean, phase: string, usedPaper: boolean) {
  if (!correct) return 0
  let xp = 20
  if (phase === 'lab') xp += 8
  if (phase === 'boss') xp += 16
  if (usedPaper) xp += 6
  return xp
}

export function levelFromXp(xp: number) {
  return 1 + Math.floor(xp / 120)
}

export function xpIntoLevel(xp: number) {
  return xp % 120
}

export function evaluateAchievements(args: {
  unlocked: string[]
  attempts: AttemptRecord[]
  streak: number
  labStreakCorrect?: number
  labCorrectCount?: number
  usedVoiceAnotherWay: boolean
  completedFlight: boolean
}) {
  const earned: string[] = []
  const has = (id: string) => args.unlocked.includes(id) || earned.includes(id)
  const grant = (id: string) => {
    if (!has(id) && ACHIEVEMENTS.some((a) => a.id === id)) earned.push(id)
  }

  if (args.attempts.some((a) => a.lockedIn && a.firstDraftCorrect && a.correct && !a.changed)) {
    grant('trust-yourself')
  }
  const families = new Map<string, Set<string>>()
  for (const a of args.attempts) {
    if (!a.correct) continue
    const set = families.get(a.familyId) ?? new Set()
    set.add(a.format)
    families.set(a.familyId, set)
  }
  if ([...families.values()].some((s) => s.size >= 2)) grant('different-look')
  if (args.attempts.some((a) => a.correct && !a.firstDraftCorrect)) grant('comeback')
  if ((args.labCorrectCount ?? args.labStreakCorrect ?? 0) >= 5) grant('locked-in')
  if (args.attempts.some((a) => a.usedPaper && a.correct && a.phase !== 'warmup')) grant('paper-work')
  if (args.completedFlight) grant('flight-complete')
  if (args.streak >= 3) grant('streak-3')
  if (args.streak >= 7) grant('streak-7')
  if (args.attempts.some((a) => a.phase === 'boss' && a.correct && a.usedPaper)) grant('boss-down')
  if (args.usedVoiceAnotherWay) grant('voice-ask')
  return earned
}
