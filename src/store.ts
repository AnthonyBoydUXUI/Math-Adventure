import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { ACHIEVEMENTS, COSMETICS } from './data/meta.ts'
import { questionById } from './data/questions.ts'
import { diagnose, familyAccuracy, seenFormats } from './engine/diagnosis.ts'
import { applyAttempt, emptyStats, seedSkillStats, compositeMastery } from './engine/mastery.ts'
import { buildBookmark, defaultBookmark, markPracticeDay, type ProgressBookmark } from './engine/progress.ts'
import { evaluateAchievements, HINT_SPARK_COST, xpForAttempt } from './engine/scoring.ts'
import { buildTestReport } from './engine/testReady.ts'
import { generateDailyMission } from './engine/session.ts'
import { resumeAudio, setMuted, sfx, startAmbient, stopAmbient, type AmbientPhase } from './lib/sfx.ts'
import { worldForModule } from './data/worlds.ts'
import { clearLocalArchive } from './lib/archive.ts'
import { checkAnswer } from './lib/answers.ts'
import { haptic } from './lib/haptics.ts'
import { dayKey, isSameCalendarDay } from './lib/clock.ts'
import type {
  AttemptRecord,
  ComplianceState,
  DailyMission,
  Diagnosis,
  DimensionStats,
  ParentSettings,
  PermissionState,
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
  labCorrectCount: number
  readinessAtStart?: number
  usedVoiceAnotherWay: boolean
  completed: boolean
}

type PlayerStoreSetter = (
  partial: Partial<PlayerStore> | ((s: PlayerStore) => Partial<PlayerStore>),
) => void

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
  bookmark: ProgressBookmark
  practiceDays: string[]
  lastActiveAt: number
  toast?: string
  soundOn: boolean
  compliance: ComplianceState
  permissions: PermissionState
  acknowledgeCompliance: (role: NonNullable<ComplianceState['role']>) => void
  markPermissionExplained: (kind: 'camera' | 'mic') => void
  wipeLocalData: () => void
  ensureToday: (now?: Date) => void
  resumeOrStart: (extra?: boolean) => 'resume' | 'start' | 'extra'
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
  completeRecap: (choice?: 'advance' | 'deepen') => void
  markVoice: () => void
  setParent: (patch: Partial<ParentSettings>) => void
  driveTo: (moduleId: string, topicId: string) => void
  equip: (slot: 'goggles' | 'hoodie' | 'kicks' | 'paint' | 'wheels' | 'wing', id: string) => void
  setThemes: (themes: Theme[]) => void
  setToast: (msg?: string) => void
  toggleSound: () => void
}

const defaultParent: ParentSettings = {
  moduleId: 'm6',
  topicId: 'm6-t1',
  themes: ['basketball', 'art', 'sky', 'gaming'],
  pressureLab: false,
  studentName: '',
}

const defaultCompliance: ComplianceState = {
  acknowledgedAt: null,
  ageBand: null,
  role: null,
}

const defaultPermissions: PermissionState = {
  cameraExplained: false,
  micExplained: false,
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
    labCorrectCount: 0,
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
  return normalizeCosmetics({ ...cosmetics, unlocked: [...new Set([...cosmetics.unlocked, ...extra])] })
}

function normalizeCosmetics(cosmetics: Partial<PlayerCosmetics> & { unlocked?: string[] }): PlayerCosmetics {
  return {
    goggles: cosmetics.goggles ?? 'goggles-base',
    hoodie: cosmetics.hoodie ?? 'hoodie-base',
    kicks: cosmetics.kicks ?? 'kicks-base',
    paint: cosmetics.paint ?? 'paint-volt',
    wheels: cosmetics.wheels ?? 'wheels-bronze',
    wing: cosmetics.wing ?? 'wing-black',
    unlocked: cosmetics.unlocked ?? [],
  }
}

function refreshBookmark(set: PlayerStoreSetter, get: () => PlayerStore) {
  const s = get()
  const mastery = compositeMastery(s.stats[s.mission.focusSkillId] ?? emptyStats())
  set({
    bookmark: buildBookmark({
      parent: s.parent,
      mission: s.mission,
      session: s.session,
      mastery,
    }),
    lastActiveAt: Date.now(),
  })
}

function districtPhase(s: PlayerStore): AmbientPhase {
  if (!s.session.active) return s.session.completed ? 'recap' : 'idle'
  return s.mission.phases[s.session.phaseIndex]?.phase ?? 'idle'
}

function syncDistrictScore(get: () => PlayerStore, worldId?: string, phase?: AmbientPhase) {
  const s = get()
  if (!s.soundOn) {
    stopAmbient()
    return
  }
  startAmbient(worldId ?? worldForModule(s.parent.moduleId).id, phase ?? districtPhase(s))
}

function grantOpenRoad(get: () => PlayerStore, set: PlayerStoreSetter) {
  const s = get()
  if (s.achievements.includes('open-road')) return
  if (!ACHIEVEMENTS.some((a) => a.id === 'open-road')) return
  const achievements = [...s.achievements, 'open-road']
  set({
    achievements,
    cosmetics: unlockCosmetics(s.cosmetics, achievements),
    toast: 'Open Road — you drove into the next adventure',
  })
  sfx.xp()
}

export const usePlayerStore = create<PlayerStore>()(
  persist(
    (set, get) => ({
      studentName: '',
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
        paint: 'paint-volt',
        wheels: 'wheels-bronze',
        wing: 'wing-black',
        unlocked: COSMETICS.filter((c) => c.unlock === 'start').map((c) => c.id),
      },
      parent: defaultParent,
      mission: generateDailyMission(seedSkillStats(), defaultParent),
      session: freshSession(),
      bookmark: defaultBookmark(),
      practiceDays: [],
      lastActiveAt: 0,
      toast: undefined,
      soundOn: true,
      compliance: defaultCompliance,
      permissions: defaultPermissions,
      acknowledgeCompliance: (role) =>
        set({
          compliance: {
            acknowledgedAt: Date.now(),
            ageBand: '12plus',
            role,
          },
        }),
      markPermissionExplained: (kind) =>
        set((s) => ({
          permissions: {
            ...s.permissions,
            ...(kind === 'camera' ? { cameraExplained: true } : { micExplained: true }),
          },
        })),
      wipeLocalData: () => {
        clearLocalArchive()
        usePlayerStore.persist.clearStorage()
        window.location.assign('/')
      },
      ensureToday: (now = new Date()) => {
        const s = get()
        if (s.session.active && isSameCalendarDay(s.mission.dateKey, now)) {
          refreshBookmark(set, get)
          return
        }
        if (s.session.active && !isSameCalendarDay(s.mission.dateKey, now)) {
          const mastery = compositeMastery(s.stats[s.mission.focusSkillId] ?? emptyStats())
          const parked = buildBookmark({
            parent: s.parent,
            mission: s.mission,
            session: s.session,
            mastery,
            now,
          })
          const mission = generateDailyMission(s.stats, s.parent, now, false, s.attempts)
          set({
            mission,
            session: freshSession(),
            bookmark: { ...parked, kind: 'paused-yesterday' },
            lastActiveAt: now.getTime(),
          })
          return
        }
        if (isSameCalendarDay(s.mission.dateKey, now)) {
          refreshBookmark(set, get)
          return
        }
        const mission = generateDailyMission(s.stats, s.parent, now, false, s.attempts)
        set({
          mission,
          session: freshSession(),
        })
        refreshBookmark(set, get)
      },
      resumeOrStart: (extra = false) => {
        const s = get()
        if (s.session.active && !extra) {
          refreshBookmark(set, get)
          syncDistrictScore(get)
          return 'resume'
        }
        get().startFlight(extra)
        return extra ? 'extra' : 'start'
      },
      startFlight: (extra = false) => {
        const s = get()
        void resumeAudio()
        setMuted(!s.soundOn)
        if (s.soundOn) {
          sfx.start()
          startAmbient(worldForModule(s.parent.moduleId).id, 'warmup')
        }
        const now = new Date()
        const mission = generateDailyMission(s.stats, s.parent, now, extra, s.attempts)
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
            readinessAtStart: buildTestReport(s.attempts).readiness,
          },
          practiceDays: markPracticeDay(s.practiceDays, dayKey(now)),
        })
        refreshBookmark(set, get)
      },
      setDraft: (value) =>
        set((s) => ({
          session: {
            ...s.session,
            draft: value,
            changed: s.session.firstDraft ? value !== s.session.firstDraft : s.session.changed,
          },
        })),
      useHint: () => {
        const s = get()
        if (s.session.hints >= 1 && s.sparks < HINT_SPARK_COST) {
          set({ toast: `Need ${HINT_SPARK_COST} sparks for another look` })
          return
        }
        set({
          sparks: s.session.hints >= 1 ? s.sparks - HINT_SPARK_COST : s.sparks,
          session: { ...s.session, hints: s.session.hints + 1 },
        })
      },
      markPaper: () => set((s) => ({ session: { ...s.session, paper: true } })),
      setPhoto: (dataUrl) => set((s) => ({ session: { ...s.session, photo: dataUrl, paper: true } })),
      setConfidence: (n) => set((s) => ({ session: { ...s.session, confidence: n } })),
      skipPaperGate: () => set((s) => ({ session: { ...s.session, paperGate: false } })),
      acceptPaperGate: () =>
        set((s) => ({ session: { ...s.session, paperGate: false, paper: true } })),
      markVoice: () => set((s) => ({ session: { ...s.session, usedVoiceAnotherWay: true } })),
      setToast: (msg) => set({ toast: msg }),
      toggleSound: () => {
        const next = !get().soundOn
        setMuted(!next)
        set({ soundOn: next })
        if (next) {
          void resumeAudio()
          sfx.tap()
          syncDistrictScore(get)
        } else {
          stopAmbient()
        }
      },
      setThemes: (themes) => set((s) => ({ parent: { ...s.parent, themes } })),
      setParent: (patch) => {
        const parent = { ...get().parent, ...patch }
        set({
          parent,
          mission: generateDailyMission(get().stats, parent, new Date(), false, get().attempts),
          studentName: parent.studentName || get().studentName,
        })
        syncDistrictScore(get, worldForModule(parent.moduleId).id)
        refreshBookmark(set, get)
      },
      driveTo: (moduleId, topicId) => {
        const s = get()
        const from = worldForModule(s.parent.moduleId)
        const dest = worldForModule(moduleId)
        if (s.parent.moduleId !== moduleId || s.parent.topicId !== topicId) {
          const parent = { ...s.parent, moduleId, topicId }
          set({
            parent,
            mission: generateDailyMission(s.stats, parent, new Date(), false, s.attempts),
            studentName: parent.studentName || s.studentName,
          })
          syncDistrictScore(get, dest.id)
        }
        sfx.whoosh()
        if (from.nextId && dest.id === from.nextId) {
          grantOpenRoad(get, set)
        }
        refreshBookmark(set, get)
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
        sfx.lock()
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
        const labCorrectCount =
          phase.phase === 'lab' && finalCorrect ? (s.session.labCorrectCount ?? 0) + 1 : (s.session.labCorrectCount ?? 0)
        const newAch = evaluateAchievements({
          unlocked: s.achievements,
          attempts: [...s.attempts, attempt],
          streak: s.streak,
          labCorrectCount,
          usedVoiceAnotherWay: s.session.usedVoiceAnotherWay,
          completedFlight: false,
        }).filter((id) => !s.achievements.includes(id))
        const unlockedName = ACHIEVEMENTS.find((a) => a.id === newAch[0])?.name

        set({
          stats,
          attempts: [...s.attempts, attempt],
          xp: s.xp + xpForAttempt(finalCorrect, phase.phase, s.session.paper),
          sparks: s.sparks + (finalCorrect ? 4 : 0),
          achievements: [...s.achievements, ...newAch],
          cosmetics: unlockCosmetics(s.cosmetics, [...s.achievements, ...newAch]),
          session: {
            ...s.session,
            awaitingLock: false,
            lastResult: { correct: finalCorrect, diagnosis, firstDraftCorrect: firstCorrect },
            labCorrectRun,
            labCorrectCount,
          },
          toast: unlockedName ? `Unlocked · ${unlockedName}` : undefined,
        })
        if (finalCorrect) {
          sfx.correct()
          haptic('success')
        } else {
          sfx.miss()
          haptic('warn')
        }
        if (newAch[0]) sfx.xp()
        refreshBookmark(set, get)
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
          if (get().soundOn) sfx.whoosh()
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
          syncDistrictScore(get)
          refreshBookmark(set, get)
          return
        }
        if (s.soundOn) sfx.whoosh()
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
        syncDistrictScore(get)
        refreshBookmark(set, get)
      },
      completeRecap: (choice) => {
        const s = get()
        const streakState = ensureStreak({ streak: s.streak, lastDay: s.lastDay })
        const newAch = evaluateAchievements({
          unlocked: s.achievements,
          attempts: s.attempts,
          streak: streakState.streak,
          labCorrectCount: s.session.labCorrectCount ?? s.session.labCorrectRun,
          usedVoiceAnotherWay: s.session.usedVoiceAnotherWay,
          completedFlight: true,
        }).filter((id) => !s.achievements.includes(id))
        const session = { ...s.session, active: false, completed: true }
        const mastery = compositeMastery(s.stats[s.mission.focusSkillId] ?? emptyStats())
        const path = choice === 'advance' || choice === 'deepen' ? choice : undefined
        const bookmark = buildBookmark({
          parent: s.parent,
          mission: s.mission,
          session,
          mastery,
          path,
        })
        const parent =
          choice === 'advance' && bookmark.kind === 'next-topic' && bookmark.nextModuleId && bookmark.nextTopicId
            ? { ...s.parent, moduleId: bookmark.nextModuleId, topicId: bookmark.nextTopicId }
            : s.parent
        const unlockedName = ACHIEVEMENTS.find((a) => a.id === newAch[0])?.name
        set({
          streak: streakState.streak,
          lastDay: streakState.lastDay,
          achievements: [...s.achievements, ...newAch],
          cosmetics: unlockCosmetics(s.cosmetics, [...s.achievements, ...newAch]),
          session,
          parent,
          bookmark,
          practiceDays: markPracticeDay(s.practiceDays, dayKey()),
          lastActiveAt: Date.now(),
          xp: s.xp + 30,
          sparks: s.sparks + 12,
          toast: unlockedName ? `Unlocked · ${unlockedName}` : s.toast,
        })
        if (s.soundOn) sfx.xp()
        syncDistrictScore(get)
      },
    }),
    {
      name: 'aero-math-adventure',
      version: 5,
      migrate: (persisted, version) => {
        const s = { ...((persisted ?? {}) as Record<string, unknown>) }
        if (version < 4) {
          const parent = { ...((s.parent as ParentSettings | undefined) ?? defaultParent) }
          if (parent.studentName === 'Copilot') parent.studentName = ''
          s.parent = parent
          if (s.studentName === 'Copilot') s.studentName = ''
          s.compliance = { ...defaultCompliance }
          s.permissions = { ...defaultPermissions }
        }
        if (version < 5) {
          s.bookmark = defaultBookmark()
          s.practiceDays = Array.isArray(s.practiceDays) ? s.practiceDays : []
          s.lastActiveAt = typeof s.lastActiveAt === 'number' ? s.lastActiveAt : 0
        }
        return s as unknown as PlayerStore
      },
      merge: (persisted, current) => {
        const p = (persisted ?? {}) as Partial<PlayerStore>
        const parent = { ...current.parent, ...(p.parent ?? {}) }
        if (parent.studentName === 'Copilot') parent.studentName = ''
        return {
          ...current,
          ...p,
          studentName: p.studentName === 'Copilot' ? '' : (p.studentName ?? current.studentName),
          cosmetics: normalizeCosmetics({ ...current.cosmetics, ...(p.cosmetics ?? {}) }),
          parent,
          compliance: { ...current.compliance, ...(p.compliance ?? {}) },
          permissions: { ...current.permissions, ...(p.permissions ?? {}) },
          bookmark: { ...current.bookmark, ...(p.bookmark ?? {}) },
          practiceDays: p.practiceDays ?? current.practiceDays,
        }
      },
    },
  ),
)
