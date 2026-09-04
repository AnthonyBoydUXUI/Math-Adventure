import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { COSMETICS } from './data/meta.ts'
import { questionById } from './data/questions.ts'
import { diagnose, familyAccuracy, seenFormats } from './engine/diagnosis.ts'
import { applyAttempt, seedSkillStats } from './engine/mastery.ts'
import { evaluateAchievements, xpForAttempt } from './engine/scoring.ts'
import { generateDailyMission } from './engine/session.ts'
import { checkAnswer } from './lib/answers.ts'
import { dayKey } from './lib/hash.ts'
import type {
  AttemptRecord,
  DailyMission,
  Diagnosis,
  DimensionStats,
  ParentSettings,
  PlayerCosmetics,
  Theme,
} from './types.ts'

export interface SessionSlice {
  active: boolean
  extra: boolean
  phaseIndex: number
  itemIndex: number
  startedAt: number
  questionStartedAt: number
  draft: string
  firstDraft: string
  changed: boolean
  hints: number
  paper: boolean
  photo?: string
  confidence: number
  awaitingLock: boolean
  paperGate: boolean
  lastResult?: {
    correct: boolean
    diagnosis: Diagnosis
    firstDraftCorrect: boolean
  }
  labCorrectRun: number
  usedVoiceAnotherWay: boolean
  completed: boolean
}

interface PlayerStore {
  studentName: string
  xp: number
  sparks: number
  streak: number
  lastDay: string
  stats: Record<string, DimensionStats>
  attempts: AttemptRecord[]
  achievements: string[]
  cosmetics: PlayerCosmetics
  parent: ParentSettings
  mission: DailyMission
  session: SessionSlice
  toast?: string
  startFlight: (extra?: boolean) => void
  setDraft: (value: string) => void
  useHint: () => void
  markPaper: () => void
  setPhoto: (dataUrl: string) => void
  setConfidence: (n: number) => void
  submitDraft: () => void
  lockIn: (keep: boolean) => void
  nextItem: () => void
  skipPaperGate: () => void
  acceptPaperGate: () => void
  completeRecap: () => void
  markVoice: () => void
  setParent: (patch: Partial<ParentSettings>) => void
  equip: (slot: 'goggles' | 'hoodie' | 'kicks', id: string) => void
  setThemes: (themes: Theme[]) => void
  setToast: (msg?: string) => void
}

const defaultParent: ParentSettings = {
  moduleId: 'm6',
  topicId: 'm6-t1',
  themes: ['basketball', 'art', 'sky', 'gaming'],
  pressureLab: false,
  studentName: 'Copilot',
}

function freshSession(): SessionSlice {
  return {
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
    confidence: 3,
    awaitingLock: false,
    paperGate: false,
    labCorrectRun: 0,
    usedVoiceAnotherWay: false,
    completed: false,
  }
}

function ensureStreak(state: { streak: number; lastDay: string }) {
  const today = dayKey()
  if (state.lastDay === today) return state
  const y = new Date()
  y.setDate(y.getDate() - 1)
  if (state.lastDay === dayKey(y)) return { streak: state.streak + 1, lastDay: today }
  if (!state.lastDay) return { streak: 1, lastDay: today }
  return { streak: 1, lastDay: today }
}

function unlockCosmetics(cosmetics: PlayerCosmetics, achievements: string[]): PlayerCosmetics {
  const extra = COSMETICS.filter((c) => c.unlock === 'start' || achievements.includes(c.unlock)).map(
    (c) => c.id,
  )
  return { ...cosmetics, unlocked: [...new Set([...cosmetics.unlocked, ...extra])] }
}

export const usePlayerStore = create<PlayerStore>()(
  persist(
    (set, get) => ({
      studentName: 'Copilot',
      xp: 0,
      sparks: 40,
      streak: 0,
      lastDay: '',
      stats: seedSkillStats(),
      attempts: [],
      achievements: [],
      cosmetics: {
        goggles: 'goggles-base',
        hoodie: 'hoodie-base',
        kicks: 'kicks-base',
        unlocked: COSMETICS.filter((c) => c.unlock === 'start').map((c) => c.id),
      },
      parent: defaultParent,
      mission: generateDailyMission(seedSkillStats(), defaultParent),
      session: freshSession(),
      startFlight: (extra = false) => {
        const s = get()
        const mission = generateDailyMission(s.stats, s.parent, new Date(), extra)
        const qid = mission.phases[0]?.questionIds[0]
        const q = qid ? questionById(qid) : undefined
        set({
          mission,
          session: {
            ...freshSession(),
            active: true,
            extra,
            startedAt: Date.now(),
            questionStartedAt: Date.now(),
            paperGate: Boolean(q?.paperFirst),
          },
        })
      },
      setDraft: (value) =>
        set((s) => ({
          session: {
            ...s.session,
            draft: value,
            changed: s.session.firstDraft ? value !== s.session.firstDraft : s.session.changed,
          },
        })),
      useHint: () => set((s) => ({ session: { ...s.session, hints: s.session.hints + 1 } })),
      markPaper: () => set((s) => ({ session: { ...s.session, paper: true } })),
      setPhoto: (dataUrl) => set((s) => ({ session: { ...s.session, photo: dataUrl, paper: true } })),
      setConfidence: (n) => set((s) => ({ session: { ...s.session, confidence: n } })),
      skipPaperGate: () => set((s) => ({ session: { ...s.session, paperGate: false } })),
      acceptPaperGate: () =>
        set((s) => ({ session: { ...s.session, paperGate: false, paper: true } })),
      markVoice: () => set((s) => ({ session: { ...s.session, usedVoiceAnotherWay: true } })),
      setToast: (msg) => set({ toast: msg }),
      setThemes: (themes) => set((s) => ({ parent: { ...s.parent, themes } })),
      setParent: (patch) => {
        const parent = { ...get().parent, ...patch }
        set({
          parent,
          mission: generateDailyMission(get().stats, parent),
          studentName: parent.studentName || get().studentName,
        })
      },
      equip: (slot, id) => {
        if (!get().cosmetics.unlocked.includes(id)) return
        set((s) => ({ cosmetics: { ...s.cosmetics, [slot]: id } }))
      },
      submitDraft: () => {
        const s = get()
        if (!s.session.draft.trim()) return
        set({
          session: {
            ...s.session,
            firstDraft: s.session.firstDraft || s.session.draft,
            awaitingLock: true,
          },
        })
      },
      lockIn: (_keep) => {
        const s = get()
        const phase = s.mission.phases[s.session.phaseIndex]
        if (!phase || phase.phase === 'recap') return
        const qid = phase.questionIds[s.session.itemIndex]
        const q = qid ? questionById(qid) : undefined
        if (!q) return

        const draft = s.session.draft
        const first = s.session.firstDraft || draft
        const firstCorrect = checkAnswer(q.answer, first)
        const finalCorrect = checkAnswer(q.answer, draft)
        const changed = first !== draft
        const timeMs = Date.now() - s.session.questionStartedAt
        const seen = seenFormats(s.attempts, q.familyId)
        const diagnosis = diagnose({
          correct: finalCorrect,
          firstDraftCorrect: firstCorrect,
          changed,
          usedPaper: s.session.paper,
          paperExpected: q.paperFirst,
          usedHint: s.session.hints > 0,
          confidence: s.session.confidence,
          timeMs,
          targetMs: q.timeTargetSec,
          format: q.format,
          seenFormats: seen,
          familyAccuracy: familyAccuracy(s.attempts, q.familyId),
          skill: s.stats[q.skillId],
        })

        const attempt: AttemptRecord = {
          id: `${Date.now()}`,
          at: Date.now(),
          questionId: q.id,
          skillId: q.skillId,
          familyId: q.familyId,
          format: q.format,
          phase: phase.phase,
          correct: finalCorrect,
          firstDraftCorrect: firstCorrect,
          changed,
          lockedIn: Boolean(_keep) && firstCorrect && finalCorrect && !changed,
          usedHint: s.session.hints > 0,
          usedPaper: s.session.paper,
          paperPhoto: s.session.photo,
          confidence: s.session.confidence,
          timeMs,
          diagnosis,
          answerGiven: draft,
        }

        const stats = {
          ...s.stats,
          [q.skillId]: applyAttempt(s.stats[q.skillId], {
            correct: finalCorrect,
            formatIsNew: !seen.includes(q.format),
            usedPaper: s.session.paper,
            usedHint: s.session.hints > 0,
            confidence: s.session.confidence,
            timeMs,
            targetMs: q.timeTargetSec,
            changedAwayFromCorrect: changed && firstCorrect && !finalCorrect,
          }),
        }

        const labCorrectRun =
          phase.phase === 'lab' ? (finalCorrect ? s.session.labCorrectRun + 1 : 0) : s.session.labCorrectRun
        const streakState = ensureStreak({ streak: s.streak, lastDay: s.lastDay })
        const newAch = evaluateAchievements({
          unlocked: s.achievements,
          attempts: [...s.attempts, attempt],
          streak: streakState.streak,
          labStreakCorrect: labCorrectRun,
          usedVoiceAnotherWay: s.session.usedVoiceAnotherWay,
          completedFlight: false,
        }).filter((id) => !s.achievements.includes(id))

        set({
          stats,
          attempts: [...s.attempts, attempt],
          xp: s.xp + xpForAttempt(finalCorrect, phase.phase, s.session.paper),
          sparks: s.sparks + (finalCorrect ? 4 : 1),
          streak: streakState.streak,
          lastDay: streakState.lastDay,
          achievements: [...s.achievements, ...newAch],
          cosmetics: unlockCosmetics(s.cosmetics, [...s.achievements, ...newAch]),
          session: {
            ...s.session,
            awaitingLock: false,
            lastResult: { correct: finalCorrect, diagnosis, firstDraftCorrect: firstCorrect },
            labCorrectRun,
          },
          toast: newAch[0] ? `Achievement unlocked` : undefined,
        })
      },
      nextItem: () => {
        const s = get()
        const phases = s.mission.phases
        let phaseIndex = s.session.phaseIndex
        let itemIndex = s.session.itemIndex + 1
        const current = phases[phaseIndex]
        if (current && itemIndex >= current.questionIds.length) {
          phaseIndex += 1
          itemIndex = 0
        }
        const nextPhase = phases[phaseIndex]
        if (!nextPhase || nextPhase.phase === 'recap') {
          set({
            session: {
              ...s.session,
              phaseIndex: Math.max(0, phases.findIndex((p) => p.phase === 'recap')),
              itemIndex: 0,
              lastResult: undefined,
              draft: '',
              firstDraft: '',
              changed: false,
              hints: 0,
              paper: false,
              photo: undefined,
              awaitingLock: false,
              paperGate: false,
            },
          })
          return
        }
        const qid = nextPhase.questionIds[itemIndex]
        const q = qid ? questionById(qid) : undefined
        set({
          session: {
            ...s.session,
            phaseIndex,
            itemIndex,
            draft: '',
            firstDraft: '',
            changed: false,
            hints: 0,
            paper: false,
            photo: undefined,
            confidence: 3,
            awaitingLock: false,
            lastResult: undefined,
            paperGate: Boolean(q?.paperFirst),
            questionStartedAt: Date.now(),
          },
        })
      },
      completeRecap: () => {
        const s = get()
        const streakState = ensureStreak({ streak: s.streak, lastDay: s.lastDay })
        const newAch = evaluateAchievements({
          unlocked: s.achievements,
          attempts: s.attempts,
          streak: streakState.streak,
          labStreakCorrect: s.session.labCorrectRun,
          usedVoiceAnotherWay: s.session.usedVoiceAnotherWay,
          completedFlight: true,
        }).filter((id) => !s.achievements.includes(id))
        set({
          streak: streakState.streak,
          lastDay: streakState.lastDay,
          achievements: [...s.achievements, ...newAch],
          cosmetics: unlockCosmetics(s.cosmetics, [...s.achievements, ...newAch]),
          session: { ...s.session, active: false, completed: true },
          xp: s.xp + 30,
          sparks: s.sparks + 12,
        })
      },
    }),
    { name: 'aero-math-adventure' },
  ),
)
