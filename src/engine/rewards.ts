import { WORLDS } from '../data/worlds.ts'
import { compositeMastery, emptyStats } from './mastery.ts'
import type { DimensionStats, Phase } from '../types.ts'

export interface RewardBook {
  stages: string[]
  lessons: string[]
  worlds: string[]
}

export const emptyRewards = (): RewardBook => ({ stages: [], lessons: [], worlds: [] })

export const STAGE_SPARKS: Partial<Record<Phase, number>> = {
  warmup: 6,
  builder: 8,
  lab: 10,
  boss: 14,
}

export const LESSON_SPARKS = 18
export const WORLD_SPARKS = 36
export const LESSON_MASTERY = 70

export function stageClearId(worldId: string, phase: string) {
  return `${worldId}:${phase}`
}

export function worldStars(rewards: RewardBook, worldId: string) {
  const stages = ['warmup', 'builder', 'lab', 'boss']
  return stages.filter((p) => rewards.stages.includes(stageClearId(worldId, p))).length
}

export function lessonCleared(rewards: RewardBook, skillId: string) {
  return rewards.lessons.includes(skillId)
}

export function applyStageClear(rewards: RewardBook, worldId: string, phase: Phase) {
  if (phase === 'recap') return { rewards, sparks: 0, toast: undefined as string | undefined }
  const id = stageClearId(worldId, phase)
  if (rewards.stages.includes(id)) return { rewards, sparks: 0, toast: undefined as string | undefined }
  const sparks = STAGE_SPARKS[phase] ?? 0
  const label = phase === 'warmup' ? 'Warm-Up' : phase === 'builder' ? 'Skill Builder' : phase === 'lab' ? 'Test Lab' : 'Boss'
  return {
    rewards: { ...rewards, stages: [...rewards.stages, id] },
    sparks,
    toast: `${label} clear · +${sparks} sparks`,
  }
}

export function applyLessonClear(rewards: RewardBook, skillId: string, skillName: string) {
  if (rewards.lessons.includes(skillId)) return { rewards, sparks: 0, toast: undefined as string | undefined }
  return {
    rewards: { ...rewards, lessons: [...rewards.lessons, skillId] },
    sparks: LESSON_SPARKS,
    toast: `Lesson clear · ${skillName} · +${LESSON_SPARKS} sparks`,
  }
}

export function applyWorldClear(rewards: RewardBook, worldId: string, worldName: string) {
  if (rewards.worlds.includes(worldId)) return { rewards, sparks: 0, toast: undefined as string | undefined }
  return {
    rewards: { ...rewards, worlds: [...rewards.worlds, worldId] },
    sparks: WORLD_SPARKS,
    toast: `${worldName} clear · +${WORLD_SPARKS} sparks`,
  }
}

export function worldReadyToClear(stats: Record<string, DimensionStats>, worldId: string) {
  const world = WORLDS.find((w) => w.id === worldId)
  if (!world?.skillIds.length) return false
  return world.skillIds.every((id) => compositeMastery(stats[id] ?? emptyStats()) >= LESSON_MASTERY)
}

export function mergeRewards(a: RewardBook, b: RewardBook): RewardBook {
  return {
    stages: [...new Set([...a.stages, ...b.stages])],
    lessons: [...new Set([...a.lessons, ...b.lessons])],
    worlds: [...new Set([...a.worlds, ...b.worlds])],
  }
}
