import { SKILLS } from '../data/curriculum.ts'
import { QUESTIONS } from '../data/questions.ts'
import type { ScoreboardKind, SkillDef } from '../types.ts'

export interface HomeworkPlan {
  concept: string
  skillId: string
  skill?: SkillDef
  asking: string
  known: string[]
  move: string
  scoreboard: ScoreboardKind
  hints: string[]
  check?: number | string
  checkKind: 'number' | 'text' | 'none'
  why: string
  anotherWay: string
  relatedIds: string[]
}

const SKILL_HINTS: { test: RegExp; skillId: string }[] = [
  { test: /percent|tip|tax|discount|markup|%/i, skillId: 'percent-of' },
  { test: /unit rate|per hour|mph|per one/i, skillId: 'unit-rate' },
  { test: /proportional|constant of|y\s*=\s*kx/i, skillId: 'constant-k' },
  { test: /inequal|greater than|less than|at least|at most|[<>]=?/i, skillId: 'inequalities' },
  { test: /\b(solve|equation|two-step)\b|[a-z]\s*=\s*/i, skillId: 'two-step-eq' },
  { test: /like terms|distribut|simplif/i, skillId: 'like-terms' },
  { test: /probab|spinner|p\(/i, skillId: 'simple-prob' },
  { test: /mean|median|sample|line plot|mad\b/i, skillId: 'sampling-stats' },
  { test: /circle|circumfer|π|pi\b/i, skillId: 'circles-composite' },
  { test: /volume|surface area|prism/i, skillId: 'surface-volume' },
  { test: /angle|supplement|vertical|scale draw/i, skillId: 'angles-scale' },
  { test: /integer|negative|number line/i, skillId: 'integer-ops' },
  { test: /fraction|mixed number|rational/i, skillId: 'rational-ops' },
  { test: /slope|y\s*=\s*mx|linear/i, skillId: 'slope-linear' },
  { test: /pythag|hypotenuse|right triangle/i, skillId: 'pythag' },
  { test: /f\s*\(|function of/i, skillId: 'function-notation' },
  { test: /system of|two equations/i, skillId: 'systems-intro' },
]

export function identifyConcept(text: string) {
  for (const row of SKILL_HINTS) {
    if (row.test.test(text)) return row.skillId
  }
  return 'multistep-word'
}

function parsePercentOf(text: string) {
  const m = text.match(/(\d+(?:\.\d+)?)\s*%\s*of\s*(\d+(?:\.\d+)?)/i)
  if (!m) return null
  return (Number(m[1]) / 100) * Number(m[2])
}

function parseWhatPercent(text: string) {
  const m = text.match(/(\d+(?:\.\d+)?)\s+is\s+what\s+percent\s+of\s+(\d+(?:\.\d+)?)/i)
  if (!m) return null
  return (Number(m[1]) / Number(m[2])) * 100
}

function parseTwoStep(text: string) {
  const m = text.match(/(\d+)\s*([a-z])\s*([+-])\s*(\d+)\s*=\s*(\d+)/i)
  if (!m) return null
  const a = Number(m[1])
  const sign = m[3] === '+' ? 1 : -1
  const b = Number(m[4]) * sign
  const c = Number(m[5])
  return (c - b) / a
}

function parseSimpleAdd(text: string) {
  const m = text.match(/(-?\d+)\s*\+\s*(-?\d+)/)
  if (!m) return null
  return Number(m[1]) + Number(m[2])
}

function parseProduct(text: string) {
  const m = text.match(/(-?\d+)\s*[×x*]\s*(-?\d+)/)
  if (!m) return null
  return Number(m[1]) * Number(m[2])
}

function parseVolume(text: string) {
  const m = text.match(/(\d+(?:\.\d+)?)\s*(?:by|x|×)\s*(\d+(?:\.\d+)?)\s*(?:by|x|×)\s*(\d+(?:\.\d+)?)/i)
  if (!m) return null
  return Number(m[1]) * Number(m[2]) * Number(m[3])
}

export function buildHomeworkPlan(raw: string): HomeworkPlan {
  const text = raw.trim()
  const skillId = identifyConcept(text)
  const skill = SKILLS.find((s) => s.id === skillId)
  const relatedIds = QUESTIONS.filter((q) => q.skillId === skillId)
    .slice(0, 3)
    .map((q) => q.id)

  let check: number | string | undefined
  let checkKind: HomeworkPlan['checkKind'] = 'none'
  const percentOf = parsePercentOf(text)
  const whatPct = parseWhatPercent(text)
  const twoStep = parseTwoStep(text)
  const sum = parseSimpleAdd(text)
  const prod = parseProduct(text)
  const vol = parseVolume(text)

  if (percentOf !== null) {
    check = Math.round(percentOf * 1000) / 1000
    checkKind = 'number'
  } else if (whatPct !== null) {
    check = Math.round(whatPct * 1000) / 1000
    checkKind = 'number'
  } else if (twoStep !== null) {
    check = twoStep
    checkKind = 'number'
  } else if (vol !== null) {
    check = vol
    checkKind = 'number'
  } else if (prod !== null) {
    check = prod
    checkKind = 'number'
  } else if (sum !== null) {
    check = sum
    checkKind = 'number'
  }

  const scoreboard: ScoreboardKind =
    skillId === 'two-step-eq' || skillId === 'inequalities' ? 'equation' : 'word'

  return {
    concept: skill?.name ?? 'Multi-step thinking',
    skillId,
    skill,
    asking: 'What is the question actually asking you to find?',
    known: [
      'Name the numbers that matter.',
      'Cross out extra story details.',
      'Label units.',
    ],
    move:
      skillId === 'percent-of'
        ? 'Part = percent × whole — or percent = part ÷ whole.'
        : skillId === 'two-step-eq'
          ? 'Undo the last operation first. Keep both sides honest.'
          : skillId === 'simple-prob'
            ? 'Favorable over total. Same size pieces.'
            : 'Pick the math move, then write it before you compute.',
    scoreboard,
    hints: [
      'Don’t solve in your head yet.',
      'Write KNOW / FIND / MOVE.',
      'Estimate whether the answer should be bigger or smaller than a nearby number.',
    ],
    check,
    checkKind,
    why: 'Homework help here is a coach, not an answer key. You do the work.',
    anotherWay: 'Try a simpler number in the same structure, then return.',
    relatedIds,
  }
}

export function homeworkFeedback(plan: HomeworkPlan, attempt: string) {
  if (plan.checkKind === 'none' || plan.check === undefined) {
    return {
      verdict: 'recorded' as const,
      line: 'Logged. Compare it to your paper. Does it pass CHECK?',
    }
  }
  const n = Number(attempt.replace(/[,$%]/g, ''))
  if (plan.checkKind === 'number' && Number.isFinite(n)) {
    const ok = Math.abs(n - Number(plan.check)) <= 0.05
    return {
      verdict: ok ? ('correct' as const) : ('retry' as const),
      line: ok
        ? 'That checks out. Now write one sentence on why it makes sense.'
        : 'Not yet — don’t peek. Revisit MOVE, then try once more.',
    }
  }
  return { verdict: 'recorded' as const, line: 'Got it. Walk CHECK on paper.' }
}
