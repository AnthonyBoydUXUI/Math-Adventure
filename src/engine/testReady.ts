import { DIAGNOSIS_COPY } from './diagnosis.ts'
import type { AttemptRecord, Diagnosis, Format } from '../types.ts'

const TEST_FORMATS: Format[] = ['word', 'equation', 'graph', 'table', 'diagram', 'mcq', 'multistep']

export interface FormatCell {
  format: Format
  attempts: number
  accuracy: number
}

export interface TestReport {
  sampleSize: number
  readiness: number
  lockInRate: number
  transfer: number
  paperHabit: number
  formats: FormatCell[]
  weakestFormat?: Format
  loudestDiagnosis?: Diagnosis
  drillLine: string
  testDayLine: string
}

export function buildTestReport(attempts: AttemptRecord[]): TestReport {
  const lab = attempts.filter((a) => a.phase === 'lab' || a.phase === 'boss')
  const pool = lab.length >= 2 ? lab : attempts
  const sampleSize = pool.length

  if (!sampleSize) {
    return {
      sampleSize: 0,
      readiness: 48,
      lockInRate: 0,
      transfer: 0,
      paperHabit: 0,
      formats: [],
      drillLine: 'Run Test Lab once. We split slips vs gaps vs format vs nerves — that is what the real test hits.',
      testDayLine: 'Class strength does not automatically show up on a diagnostic. Same math, different look.',
    }
  }

  const lockIns = pool.filter((a) => a.correct && a.firstDraftCorrect && !a.changed)
  const lockInRate = pct(lockIns.length / sampleSize)
  const wrappers = pool.filter((a) => a.format !== 'word')
  const transfer = wrappers.length ? pct(wrappers.filter((a) => a.correct).length / wrappers.length) : pct(pool.filter((a) => a.correct).length / sampleSize)
  const paperHabit = pct(pool.filter((a) => a.usedPaper).length / sampleSize)
  const accuracy = pct(pool.filter((a) => a.correct).length / sampleSize)

  const formats: FormatCell[] = TEST_FORMATS.map((format) => {
    const rows = pool.filter((a) => a.format === format)
    return {
      format,
      attempts: rows.length,
      accuracy: rows.length ? pct(rows.filter((a) => a.correct).length / rows.length) : -1,
    }
  }).filter((c) => c.attempts > 0)

  const weakest = [...formats].sort((a, b) => a.accuracy - b.accuracy || b.attempts - a.attempts)[0]

  const mix = new Map<Diagnosis, number>()
  for (const a of pool) {
    if (a.diagnosis === 'solid') continue
    mix.set(a.diagnosis, (mix.get(a.diagnosis) ?? 0) + 1)
  }
  const loudestDiagnosis = [...mix.entries()].sort((a, b) => b[1] - a[1])[0]?.[0]

  const pressure =
    pool.filter((a) =>
      ['second_guessing', 'test_anxiety', 'pacing', 'confidence'].includes(a.diagnosis),
    ).length / sampleSize
  const readiness = clamp(
    Math.round(transfer * 0.35 + lockInRate * 0.25 + accuracy * 0.2 + paperHabit * 0.1 + (1 - pressure) * 100 * 0.1),
  )

  const drillLine = weakest
    ? `${labelFormat(weakest.format)} is the wrapper that still beats you (${Math.round(weakest.accuracy)}%). Same math, different look.`
    : 'Keep rotating formats. Tests rarely ask the classroom version first.'

  const testDayLine = loudestDiagnosis
    ? `${DIAGNOSIS_COPY[loudestDiagnosis].title}: ${DIAGNOSIS_COPY[loudestDiagnosis].line}`
    : 'Lock the first correct answer. That is the test skill hiding under the game.'

  return {
    sampleSize,
    readiness,
    lockInRate,
    transfer,
    paperHabit,
    formats,
    weakestFormat: weakest?.format,
    loudestDiagnosis,
    drillLine,
    testDayLine,
  }
}

export function preferFormats(weakest?: Format): Format[] {
  const base: Format[] = ['word', 'equation', 'graph', 'table', 'diagram', 'missing', 'mcq']
  if (!weakest) return base
  return [weakest, ...base.filter((f) => f !== weakest)]
}

function labelFormat(format: Format) {
  if (format === 'mcq') return 'Multiple choice'
  if (format === 'multistep') return 'Multi-step'
  return format[0]!.toUpperCase() + format.slice(1)
}

function pct(n: number) {
  return clamp(Math.round(n * 100))
}

function clamp(n: number) {
  return Math.max(0, Math.min(100, n))
}
