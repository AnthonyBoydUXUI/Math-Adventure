import { describe, expect, it } from 'vitest'
import { checkAnswer } from '../lib/answers.ts'
import type { ParentSettings } from '../types.ts'
import { diagnose } from './diagnosis.ts'
import { buildHomeworkPlan, homeworkFeedback } from './homework.ts'
import { emptyStats, seedSkillStats } from './mastery.ts'
import { evaluateAchievements } from './scoring.ts'
import { generateDailyMission, labSequence, missionMinutes } from './session.ts'
import { buildTestReport, preferFormats } from './testReady.ts'
import { parseVoice } from './voice/index.ts'
import { classroomChain, circuitPits, WORLDS } from '../data/worlds.ts'
import { usePlayerStore } from '../store.ts'

const parent: ParentSettings = {
  moduleId: 'm6',
  topicId: 'm6-t1',
  themes: ['basketball'],
  pressureLab: false,
  studentName: 'Test',
}

describe('daily mission', () => {
  it('builds a 15-minute five-phase flight', () => {
    const mission = generateDailyMission(seedSkillStats(), parent, new Date('2026-09-04'))
    expect(mission.phases.map((p) => p.phase)).toEqual(['warmup', 'builder', 'lab', 'boss', 'recap'])
    expect(missionMinutes(mission)).toBe(15)
    expect(mission.phases.find((p) => p.phase === 'warmup')?.questionIds.length).toBeGreaterThan(0)
    expect(mission.phases.find((p) => p.phase === 'boss')?.questionIds.length).toBe(1)
  })

  it('keeps Test Lab on one family with multiple formats', () => {
    const seq = labSequence('hoodie-equation', () => 0.2)
    expect(seq.length).toBeGreaterThanOrEqual(3)
    expect(new Set(seq.map((q) => q.familyId)).size).toBe(1)
    expect(new Set(seq.map((q) => q.format)).size).toBeGreaterThan(1)
  })

  it('overweights the parent-selected classroom skill', () => {
    const mission = generateDailyMission(seedSkillStats(), parent, new Date('2026-09-04'))
    expect(mission.focusSkillId).toBe('two-step-eq')
  })
})

describe('diagnosis', () => {
  const base = {
    usedPaper: true,
    paperExpected: true,
    usedHint: false,
    confidence: 3,
    timeMs: 20000,
    targetMs: 40,
    format: 'word' as const,
    seenFormats: ['word'] as const,
    familyAccuracy: 0.8,
    skill: { ...emptyStats(), knowledge: 70, accuracy: 70, transfer: 40, responseTime: 60 },
  }

  it('flags second-guessing when a correct first draft is changed', () => {
    expect(
      diagnose({
        ...base,
        correct: false,
        firstDraftCorrect: true,
        changed: true,
      }),
    ).toBe('second_guessing')
  })

  it('flags transfer when a known skill fails a new format', () => {
    expect(
      diagnose({
        ...base,
        correct: false,
        firstDraftCorrect: false,
        changed: false,
        format: 'graph',
        seenFormats: ['word'],
      }),
    ).toBe('transfer_difficulty')
  })

  it('flags skipped writing on paper-first misses', () => {
    expect(
      diagnose({
        ...base,
        correct: false,
        firstDraftCorrect: false,
        changed: false,
        usedPaper: false,
        paperExpected: true,
      }),
    ).toBe('skipped_writing')
  })
})

describe('answers and homework', () => {
  it('accepts equivalent fractions', () => {
    expect(checkAnswer({ type: 'fraction', n: 3, d: 10 }, '3/10')).toBe(true)
    expect(checkAnswer({ type: 'fraction', n: 3, d: 10 }, '0.3')).toBe(true)
  })

  it('parses percent-of homework without revealing first', () => {
    const plan = buildHomeworkPlan('What is 15% of 40?')
    expect(plan.skillId).toBe('percent-of')
    expect(plan.check).toBe(6)
    const first = homeworkFeedback(plan, '9')
    expect(first.verdict).toBe('retry')
    const second = homeworkFeedback(plan, '6')
    expect(second.verdict).toBe('correct')
  })
})

describe('achievements', () => {
  it('grants Trust Yourself for a locked correct first answer', () => {
    const earned = evaluateAchievements({
      unlocked: [],
      attempts: [
        {
          id: '1',
          at: 1,
          questionId: 'eq-eq',
          skillId: 'two-step-eq',
          familyId: 'hoodie-equation',
          format: 'equation',
          phase: 'lab',
          correct: true,
          firstDraftCorrect: true,
          changed: false,
          lockedIn: true,
          usedHint: false,
          usedPaper: true,
          confidence: 4,
          timeMs: 8000,
          diagnosis: 'solid',
          answerGiven: '42',
        },
      ],
      streak: 1,
      labStreakCorrect: 1,
      usedVoiceAnotherWay: false,
      completedFlight: false,
    })
    expect(earned).toContain('trust-yourself')
  })
})

describe('voice intents', () => {
  it('parses coach phrases and spoken answers', () => {
    expect(parseVoice("I don't get this").intent).toBe('confused')
    expect(parseVoice('Explain it another way').intent).toBe('another_way')
    expect(parseVoice('Why did we divide?').intent).toBe('why')
    expect(parseVoice('I got 24').intent).toBe('answer')
    expect(parseVoice('I got 24').number).toBe(24)
  })
})

describe('connected adventures', () => {
  it('chains classroom worlds so each subject feeds the next', () => {
    const chain = classroomChain()
    for (let i = 0; i < chain.length - 1; i += 1) {
      expect(chain[i]?.nextId).toBe(chain[i + 1]?.id)
      expect(chain[i + 1]?.prevId).toBe(chain[i]?.id)
    }
  })

  it('gives every world a distinct adventure plus a carry/handoff', () => {
    for (const world of WORLDS) {
      expect(world.adventure.length).toBeGreaterThan(8)
      expect(world.carry.length).toBeGreaterThan(4)
      expect(world.handoff.length).toBeGreaterThan(8)
    }
    const names = WORLDS.filter((w) => w.track === 'classroom').map((w) => w.adventure)
    expect(new Set(names).size).toBe(names.length)
  })

  it('lays pits in a connected circuit and names the tank in coach copy', () => {
    const pits = circuitPits()
    expect(pits.length).toBe(classroomChain().length)
    expect(pits.every((p, i) => i === 0 || p.y > pits[i - 1]!.y)).toBe(true)
    const mission = generateDailyMission(seedSkillStats(), parent, new Date('2026-09-04'))
    expect(mission.phases[0]?.coachLine).toMatch(/tank/i)
    expect(mission.phases[1]?.coachLine).toMatch(/Next pit/)
  })

  it('driveTo rolls into the next classroom and grants Open Road', () => {
    usePlayerStore.setState({
      parent: { ...usePlayerStore.getState().parent, moduleId: 'm6', topicId: 'm6-t1' },
      achievements: [],
    })
    usePlayerStore.getState().driveTo('m7', 'm7-t1')
    expect(usePlayerStore.getState().parent.moduleId).toBe('m7')
    expect(usePlayerStore.getState().achievements).toContain('open-road')
  })
})

describe('test readiness', () => {
  it('flags the wrapper that fails after the classroom look is known', () => {
    const report = buildTestReport([
      attempt({ format: 'word', correct: true, diagnosis: 'solid' }),
      attempt({ format: 'equation', correct: true, diagnosis: 'solid' }),
      attempt({ format: 'graph', correct: false, diagnosis: 'transfer_difficulty' }),
      attempt({ format: 'graph', correct: false, diagnosis: 'format_confusion' }),
    ])
    expect(report.weakestFormat).toBe('graph')
    expect(report.loudestDiagnosis).toMatch(/transfer|format/)
    expect(report.drillLine).toMatch(/Graph/)
    expect(preferFormats('graph')[0]).toBe('graph')
  })

  it('does not call a 100% wrapper a miss', () => {
    const report = buildTestReport([
      attempt({ format: 'word', correct: true, diagnosis: 'solid' }),
      attempt({ format: 'word', correct: true, diagnosis: 'solid' }),
    ])
    expect(report.drillLine).toMatch(/holding/)
    expect(report.drillLine).not.toMatch(/beats you/)
  })

  it('puts the weak test wrapper first in Test Lab', () => {
    const seq = labSequence('hoodie-equation', () => 0.2, 'mcq')
    expect(seq[0]?.format).toBe('mcq')
  })

  it('keeps empty-state copy from sounding like a medical or official diagnosis', () => {
    expect(buildTestReport([]).testDayLine).not.toMatch(/diagnostic/i)
  })
})

describe('daily resume and rollover', () => {
  it('resumeOrStart does not wipe an active session', () => {
    usePlayerStore.setState({
      session: {
        ...usePlayerStore.getState().session,
        active: true,
        completed: false,
        phaseIndex: 2,
        itemIndex: 1,
      },
    })
    const mode = usePlayerStore.getState().resumeOrStart()
    expect(mode).toBe('resume')
    expect(usePlayerStore.getState().session.phaseIndex).toBe(2)
    expect(usePlayerStore.getState().session.itemIndex).toBe(1)
    expect(usePlayerStore.getState().bookmark.kind).toBe('mid-session')
    usePlayerStore.setState({
      session: { ...usePlayerStore.getState().session, active: false, phaseIndex: 0, itemIndex: 0 },
    })
  })

  it('rolls an unfinished yesterday session into today’s mission on the same topic', () => {
    usePlayerStore.setState({
      parent: { ...usePlayerStore.getState().parent, moduleId: 'm6', topicId: 'm6-t1' },
      mission: { ...usePlayerStore.getState().mission, dateKey: '2026-09-03' },
      session: {
        ...usePlayerStore.getState().session,
        active: true,
        completed: false,
        phaseIndex: 1,
        itemIndex: 0,
      },
    })
    usePlayerStore.getState().ensureToday(new Date(2026, 8, 4, 7, 30))
    const s = usePlayerStore.getState()
    expect(s.session.active).toBe(false)
    expect(s.mission.dateKey).toBe('2026-09-04')
    expect(s.parent.topicId).toBe('m6-t1')
    expect(s.bookmark.kind).toBe('paused-yesterday')
  })
})

describe('App Store compliance store', () => {
  it('does not ship a Copilot placeholder name', () => {
    expect(usePlayerStore.getState().studentName).not.toBe('Copilot')
    expect(usePlayerStore.getState().parent.studentName).not.toBe('Copilot')
    expect(usePlayerStore.getState().compliance.acknowledgedAt).toBeNull()
  })

  it('records a 12+ acknowledgement', () => {
    usePlayerStore.getState().acknowledgeCompliance('parent')
    const c = usePlayerStore.getState().compliance
    expect(c.role).toBe('parent')
    expect(c.ageBand).toBe('12plus')
    expect(c.acknowledgedAt).toBeGreaterThan(0)
    usePlayerStore.setState({
      compliance: { acknowledgedAt: null, ageBand: null, role: null },
    })
  })
})

function attempt(
  patch: Partial<{
    format: 'word' | 'equation' | 'graph' | 'table'
    correct: boolean
    diagnosis: 'solid' | 'transfer_difficulty' | 'format_confusion' | 'second_guessing'
  }>,
) {
  return {
    id: `${Math.random()}`,
    at: 1,
    questionId: 'eq-eq',
    skillId: 'two-step-eq',
    familyId: 'hoodie-equation',
    format: patch.format ?? 'word',
    phase: 'lab' as const,
    correct: patch.correct ?? true,
    firstDraftCorrect: patch.correct ?? true,
    changed: false,
    lockedIn: Boolean(patch.correct),
    usedHint: false,
    usedPaper: true,
    confidence: 3,
    timeMs: 12000,
    diagnosis: patch.diagnosis ?? 'solid',
    answerGiven: '42',
  }
}
