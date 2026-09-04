import { describe, expect, it } from 'vitest'
import { mergeSnapshots, stripLocalOnly, type CloudSnapshot } from './cloud.ts'
import { defaultBookmark } from '../engine/progress.ts'
import { generateDailyMission } from '../engine/session.ts'
import { seedSkillStats } from '../engine/mastery.ts'

function snap(patch: Partial<CloudSnapshot>): CloudSnapshot {
  return {
    version: 5,
    studentName: 'A',
    xp: 10,
    sparks: 4,
    streak: 1,
    lastDay: '2026-09-03',
    stats: seedSkillStats(),
    attempts: [],
    achievements: [],
    cosmetics: {
      goggles: 'goggles-base',
      hoodie: 'hoodie-base',
      kicks: 'kicks-base',
      paint: 'paint-volt',
      wheels: 'wheels-bronze',
      wing: 'wing-black',
      unlocked: [],
    },
    parent: {
      moduleId: 'm6',
      topicId: 'm6-t1',
      themes: ['art'],
      pressureLab: false,
      studentName: 'A',
      pagePhoto: 'data:image/png;base64,xxx',
    },
    mission: generateDailyMission(seedSkillStats(), {
      moduleId: 'm6',
      topicId: 'm6-t1',
      themes: ['art'],
      pressureLab: false,
      studentName: 'A',
    }, new Date(2026, 8, 4)),
    session: {
      active: false,
      extra: false,
      phaseIndex: 0,
      itemIndex: 0,
      startedAt: 0,
      questionStartedAt: 0,
      draft: '',
      firstDraft: '',
      changed: false,
      hints: 0,
      paper: false,
      photo: 'data:image/png;base64,yyy',
      confidence: 3,
      awaitingLock: false,
      paperGate: false,
      labCorrectRun: 0,
      usedVoiceAnotherWay: false,
      completed: false,
    },
    bookmark: defaultBookmark(),
    practiceDays: ['2026-09-03'],
    lastActiveAt: 100,
    soundOn: true,
    compliance: { acknowledgedAt: 1, ageBand: '12plus', role: 'parent' },
    permissions: { cameraExplained: true, micExplained: false },
    ...patch,
  }
}

describe('cloud merge', () => {
  it('keeps homework photos off the wire', () => {
    const cleaned = stripLocalOnly(snap({}))
    expect(cleaned.parent.pagePhoto).toBeUndefined()
    expect(cleaned.session.photo).toBeUndefined()
  })

  it('takes the remote copy after a local wipe', () => {
    const remote = snap({ lastActiveAt: 500, xp: 80, practiceDays: ['2026-09-01', '2026-09-04'] })
    const local = snap({ lastActiveAt: 0, xp: 0, practiceDays: [] })
    const merged = mergeSnapshots(local, remote)
    expect(merged.xp).toBe(80)
    expect(merged.practiceDays).toContain('2026-09-04')
  })

  it('unions practice days and attempts across phone and laptop', () => {
    const phone = snap({
      lastActiveAt: 200,
      practiceDays: ['2026-09-04'],
      achievements: ['trust-yourself'],
      attempts: [
        {
          id: 'p1',
          at: 2,
          questionId: 'eq-eq',
          skillId: 'two-step-eq',
          familyId: 'hoodie-equation',
          format: 'word',
          phase: 'lab',
          correct: true,
          firstDraftCorrect: true,
          changed: false,
          lockedIn: true,
          usedHint: false,
          usedPaper: true,
          confidence: 3,
          timeMs: 1000,
          diagnosis: 'solid',
          answerGiven: '4',
        },
      ],
    })
    const laptop = snap({
      lastActiveAt: 180,
      xp: 40,
      practiceDays: ['2026-09-03'],
      achievements: ['paper-work'],
      attempts: [
        {
          id: 'l1',
          at: 1,
          questionId: 'eq-eq',
          skillId: 'two-step-eq',
          familyId: 'hoodie-equation',
          format: 'equation',
          phase: 'builder',
          correct: false,
          firstDraftCorrect: false,
          changed: false,
          lockedIn: false,
          usedHint: false,
          usedPaper: false,
          confidence: 2,
          timeMs: 800,
          diagnosis: 'knowledge_gap',
          answerGiven: '3',
        },
      ],
    })
    const merged = mergeSnapshots(phone, laptop)
    expect(merged.practiceDays).toEqual(['2026-09-03', '2026-09-04'])
    expect(merged.achievements.sort()).toEqual(['paper-work', 'trust-yourself'])
    expect(merged.attempts.map((a) => a.id).sort()).toEqual(['l1', 'p1'])
    expect(merged.lastActiveAt).toBe(200)
  })
})
