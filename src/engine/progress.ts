import { MODULES, skillById } from '../data/curriculum.ts'
import { dayKey, isSameCalendarDay } from '../lib/clock.ts'
import type { DailyMission, Phase, SessionLike } from '../types.ts'

export const ADVANCE_MASTERY = 70

export interface TopicStep {
  moduleId: string
  topicId: string
  skillId: string
  name: string
  moduleName: string
  number: number
}

export type BookmarkKind = 'mid-session' | 'today-done' | 'next-topic' | 'fresh' | 'paused-yesterday'

export interface ProgressBookmark {
  savedAt: number
  dayKey: string
  moduleId: string
  topicId: string
  skillId: string
  phase: Phase | 'idle'
  phaseIndex: number
  itemIndex: number
  questionId?: string
  kind: BookmarkKind
  label: string
  nextModuleId?: string
  nextTopicId?: string
  nextLabel?: string
}

export function topicSequence(): TopicStep[] {
  return MODULES.flatMap((mod) =>
    mod.topics.map((topic) => ({
      moduleId: mod.id,
      topicId: topic.id,
      skillId: topic.skillIds[0] ?? 'two-step-eq',
      name: topic.name,
      moduleName: mod.name,
      number: mod.number,
    })),
  )
}

export function currentTopicStep(moduleId: string, topicId: string): TopicStep {
  return topicSequence().find((s) => s.moduleId === moduleId && s.topicId === topicId) ?? topicSequence()[0]!
}

export function nextCurriculumStep(
  moduleId: string,
  topicId: string,
  mastery: number,
  threshold = ADVANCE_MASTERY,
) {
  const seq = topicSequence()
  const index = seq.findIndex((s) => s.moduleId === moduleId && s.topicId === topicId)
  const here = index >= 0 ? seq[index]! : seq[0]!
  if (mastery >= threshold && index >= 0 && index < seq.length - 1) {
    const next = seq[index + 1]!
    return { ...next, reason: 'advance' as const, from: here }
  }
  if (mastery >= threshold) {
    return { ...here, reason: 'cap' as const, from: here }
  }
  return { ...here, reason: 'deepen' as const, from: here }
}

export function phaseProgress(mission: DailyMission, phaseIndex: number, itemIndex: number) {
  const phase = mission.phases[phaseIndex]
  const count = phase?.questionIds.length ?? 0
  const doneBefore = mission.phases.slice(0, phaseIndex).reduce((n, p) => n + p.questionIds.length, 0)
  const total = mission.phases.reduce((n, p) => n + p.questionIds.length, 0)
  return {
    phase,
    label: phase?.label ?? 'Session',
    item: count ? Math.min(itemIndex + 1, count) : 0,
    count,
    done: doneBefore + itemIndex,
    total,
  }
}

export function buildBookmark(input: {
  now?: Date
  parent: { moduleId: string; topicId: string }
  mission: DailyMission
  session: SessionLike
  mastery: number
  path?: 'advance' | 'deepen'
}): ProgressBookmark {
  const now = input.now ?? new Date()
  const today = dayKey(now)
  const step = currentTopicStep(input.parent.moduleId, input.parent.topicId)
  const progress = phaseProgress(input.mission, input.session.phaseIndex, input.session.itemIndex)
  const next = nextCurriculumStep(
    input.parent.moduleId,
    input.parent.topicId,
    input.path === 'deepen' ? Math.min(input.mastery, ADVANCE_MASTERY - 1) : input.mastery,
  )
  const skill = skillById(input.mission.focusSkillId)?.name ?? step.name
  const qid = progress.phase?.questionIds[input.session.itemIndex]

  if (input.session.active) {
    const sameDay = isSameCalendarDay(input.mission.dateKey, now)
    return {
      savedAt: now.getTime(),
      dayKey: today,
      moduleId: input.parent.moduleId,
      topicId: input.parent.topicId,
      skillId: input.mission.focusSkillId,
      phase: progress.phase?.phase ?? 'warmup',
      phaseIndex: input.session.phaseIndex,
      itemIndex: input.session.itemIndex,
      questionId: qid,
      kind: sameDay ? 'mid-session' : 'paused-yesterday',
      label: sameDay
        ? `${progress.label} ${progress.item}/${progress.count || 1} · ${skill}`
        : `${progress.label} ${progress.item}/${progress.count || 1} · ${skill}`,
      nextModuleId: next.moduleId,
      nextTopicId: next.topicId,
      nextLabel: next.reason === 'advance' ? next.name : skill,
    }
  }

  if (input.session.completed && isSameCalendarDay(input.mission.dateKey, now)) {
    return {
      savedAt: now.getTime(),
      dayKey: today,
      moduleId: input.parent.moduleId,
      topicId: input.parent.topicId,
      skillId: input.mission.focusSkillId,
      phase: 'idle',
      phaseIndex: input.session.phaseIndex,
      itemIndex: input.session.itemIndex,
      kind: next.reason === 'advance' ? 'next-topic' : 'today-done',
      label: next.reason === 'advance' ? `Next: ${next.name}` : `Done · ${skill}`,
      nextModuleId: next.moduleId,
      nextTopicId: next.topicId,
      nextLabel: next.reason === 'advance' ? next.name : skill,
    }
  }

  return {
    savedAt: now.getTime(),
    dayKey: today,
    moduleId: input.parent.moduleId,
    topicId: input.parent.topicId,
    skillId: input.mission.focusSkillId,
    phase: 'idle',
    phaseIndex: 0,
    itemIndex: 0,
    kind: 'fresh',
    label: skill,
    nextModuleId: next.moduleId,
    nextTopicId: next.topicId,
    nextLabel: skill,
  }
}

export function markPracticeDay(days: string[], key: string) {
  return days.includes(key) ? days : [...days, key].sort()
}

export function defaultBookmark(): ProgressBookmark {
  const step = currentTopicStep('m6', 'm6-t1')
  return {
    savedAt: 0,
    dayKey: '',
    moduleId: step.moduleId,
    topicId: step.topicId,
    skillId: step.skillId,
    phase: 'idle',
    phaseIndex: 0,
    itemIndex: 0,
    kind: 'fresh',
    label: step.name,
    nextLabel: step.name,
  }
}
