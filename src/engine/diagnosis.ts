import type { AttemptRecord, Diagnosis, DimensionStats, Format } from '../types.ts'

export interface DiagnosisContext {
  correct: boolean
  firstDraftCorrect: boolean
  changed: boolean
  usedPaper: boolean
  paperExpected: boolean
  usedHint: boolean
  confidence: number
  timeMs: number
  targetMs: number
  format: Format
  seenFormats: readonly Format[]
  familyAccuracy: number
  skill: DimensionStats
}

export function diagnose(ctx: DiagnosisContext): Diagnosis {
  if (ctx.changed && ctx.firstDraftCorrect && !ctx.correct) return 'second_guessing'
  if (ctx.correct) return 'solid'

  const slow = ctx.timeMs > ctx.targetMs * 1000 * 1.7
  const rushed = ctx.timeMs < ctx.targetMs * 1000 * 0.35
  const highConf = ctx.confidence >= 4
  const lowConf = ctx.confidence <= 2
  const formatIsNew = !ctx.seenFormats.includes(ctx.format)
  const skillKnown = ctx.skill.knowledge >= 62 && ctx.skill.accuracy >= 58
  const transferWeak = ctx.skill.transfer < 50

  if (ctx.paperExpected && !ctx.usedPaper) return 'skipped_writing'
  if (slow && lowConf) return 'test_anxiety'
  if (slow && ctx.skill.responseTime < 45) return 'pacing'
  if (formatIsNew && skillKnown) return 'transfer_difficulty'
  if (!formatIsNew && skillKnown && ctx.familyAccuracy >= 0.5) return 'arithmetic_slip'
  if (highConf && rushed) return 'arithmetic_slip'
  if (lowConf && skillKnown) return 'confidence'
  if (formatIsNew && transferWeak) return 'format_confusion'
  if (ctx.skill.knowledge < 48) return 'knowledge_gap'
  return 'knowledge_gap'
}

export const DIAGNOSIS_COPY: Record<Diagnosis, { title: string; line: string }> = {
  solid: { title: 'Locked in', line: 'That one landed. The math and the wrapper both worked.' },
  knowledge_gap: {
    title: 'Still getting the idea',
    line: 'This one needs another look at the idea — not a verdict on you.',
  },
  arithmetic_slip: {
    title: 'Slip, not a gap',
    line: 'You knew the move. The arithmetic wobbled. Paper slows that down.',
  },
  format_confusion: {
    title: 'Same math, different look',
    line: 'You’ve got the skill. This wrapper just looked new.',
  },
  pacing: {
    title: 'Clock got loud',
    line: 'You were still thinking when the clock got loud. That’s trainable.',
  },
  confidence: {
    title: 'You knew more than you trusted',
    line: 'You know this one. Trust the first answer that already made sense.',
  },
  second_guessing: {
    title: 'First answer was right',
    line: 'You had it. Changing it was the miss — not the math.',
  },
  test_anxiety: {
    title: 'Pressure fog',
    line: 'Slow and unsure often means nerves, not missing knowledge.',
  },
  skipped_writing: {
    title: 'This one wanted paper',
    line: 'This one wanted steps on paper. That’s a habit, not a talent gap.',
  },
  transfer_difficulty: {
    title: 'New look, same math',
    line: 'You know it in one look, stuck in another. Test Lab is built for that.',
  },
}

export function familyAccuracy(attempts: AttemptRecord[], familyId: string) {
  const rows = attempts.filter((a) => a.familyId === familyId)
  if (!rows.length) return 0
  return rows.filter((a) => a.correct).length / rows.length
}

export function seenFormats(attempts: AttemptRecord[], familyId: string): Format[] {
  return [...new Set(attempts.filter((a) => a.familyId === familyId).map((a) => a.format))]
}
