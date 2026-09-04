import { DOMAIN_TO_PRIOR, SKILLS } from '../data/curriculum.ts'
import { clamp } from '../lib/hash.ts'
import type { DimensionStats, Track } from '../types.ts'

export function emptyStats(): DimensionStats {
  return {
    knowledge: 50,
    recall: 50,
    transfer: 45,
    accuracy: 50,
    writtenProcess: 40,
    confidence: 48,
    responseTime: 50,
    attempts: 0,
    correct: 0,
    lastSeen: 0,
  }
}

export function priorFromDiagnostic(domain: string): number {
  const score = DOMAIN_TO_PRIOR[domain] ?? 440
  const mapped = 38 + ((score - 380) / 100) * 32
  return clamp(mapped, 34, 78)
}

export function seedSkillStats(): Record<string, DimensionStats> {
  const out: Record<string, DimensionStats> = {}
  for (const skill of SKILLS) {
    const prior = priorFromDiagnostic(skill.domain)
    const foundationNudge = skill.track === 'foundation' ? -4 : 0
    const nextNudge = skill.track === 'next' ? -6 : 0
    const stats = emptyStats()
    const base = clamp(prior + foundationNudge + nextNudge, 30, 80)
    stats.knowledge = base
    stats.recall = base - 2
    stats.transfer = base - 8
    stats.accuracy = base - 1
    stats.writtenProcess = base - 10
    stats.confidence = base - 6
    stats.responseTime = base - 4
    out[skill.id] = stats
  }
  return out
}

export function compositeMastery(s: DimensionStats) {
  return (
    s.knowledge * 0.22 +
    s.recall * 0.12 +
    s.transfer * 0.2 +
    s.accuracy * 0.18 +
    s.writtenProcess * 0.12 +
    s.confidence * 0.08 +
    s.responseTime * 0.08
  )
}

export function scaffoldingLevel(mastery: number): 0 | 1 | 2 {
  if (mastery < 48) return 0
  if (mastery < 70) return 1
  return 2
}

export function applyAttempt(
  stats: DimensionStats,
  opts: {
    correct: boolean
    formatIsNew: boolean
    usedPaper: boolean
    usedHint: boolean
    confidence: number
    timeMs: number
    targetMs: number
    changedAwayFromCorrect: boolean
  },
): DimensionStats {
  const next = { ...stats, attempts: stats.attempts + 1, lastSeen: Date.now() }
  if (opts.correct) next.correct += 1

  const accDelta = opts.correct ? 4 : -5
  next.accuracy = clamp(next.accuracy + accDelta, 0, 100)

  const knowDelta = opts.correct ? (opts.usedHint ? 1.5 : 3.5) : opts.usedHint ? -1 : -4
  next.knowledge = clamp(next.knowledge + knowDelta, 0, 100)

  const recallDelta = opts.correct && !opts.formatIsNew ? 3 : opts.correct ? 1 : -2
  next.recall = clamp(next.recall + recallDelta, 0, 100)

  const transferDelta = opts.formatIsNew ? (opts.correct ? 6 : -4) : opts.correct ? 1 : -1
  next.transfer = clamp(next.transfer + transferDelta, 0, 100)

  const paperDelta = opts.usedPaper ? (opts.correct ? 5 : 2) : opts.correct ? 0 : -3
  next.writtenProcess = clamp(next.writtenProcess + paperDelta, 0, 100)

  let confDelta = (opts.confidence - 3) * 1.2
  if (opts.correct && opts.confidence >= 4) confDelta += 2
  if (!opts.correct && opts.confidence >= 4) confDelta -= 2
  if (opts.changedAwayFromCorrect) confDelta -= 4
  next.confidence = clamp(next.confidence + confDelta, 0, 100)

  const ratio = opts.timeMs / Math.max(4000, opts.targetMs * 1000)
  let timeDelta = 0
  if (opts.correct && ratio < 1.15) timeDelta = 3
  else if (ratio > 1.8) timeDelta = -3
  else if (opts.correct) timeDelta = 1
  next.responseTime = clamp(next.responseTime + timeDelta, 0, 100)

  return next
}

export function weakestSkills(
  stats: Record<string, DimensionStats>,
  track: Track | 'any',
  n = 3,
) {
  const rows = SKILLS.filter((s) => track === 'any' || s.track === track).map((s) => ({
    skill: s,
    mastery: compositeMastery(stats[s.id] ?? emptyStats()),
  }))
  rows.sort((a, b) => a.mastery - b.mastery)
  return rows.slice(0, n)
}

export function strongestSkills(stats: Record<string, DimensionStats>, n = 3) {
  const rows = SKILLS.map((s) => ({
    skill: s,
    mastery: compositeMastery(stats[s.id] ?? emptyStats()),
  }))
  rows.sort((a, b) => b.mastery - a.mastery)
  return rows.slice(0, n)
}
