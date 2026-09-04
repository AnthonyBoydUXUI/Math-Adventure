import type { ProgressBookmark } from '../engine/progress.ts'
import { usePlayerStore, type SessionSlice } from '../store.ts'
import type {
  AttemptRecord,
  ComplianceState,
  DailyMission,
  DimensionStats,
  ParentSettings,
  PermissionState,
  PlayerCosmetics,
} from '../types.ts'

export const CLOUD_VERSION = 5

export interface CloudSnapshot {
  version: number
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
  soundOn: boolean
  compliance: ComplianceState
  permissions: PermissionState
}

export function stripLocalOnly(snap: CloudSnapshot): CloudSnapshot {
  return {
    ...snap,
    parent: { ...snap.parent, pagePhoto: undefined },
    session: { ...snap.session, photo: undefined },
    attempts: snap.attempts.map((a) => ({ ...a, paperPhoto: undefined })),
  }
}

export function isCloudSnapshot(value: unknown): value is CloudSnapshot {
  if (!value || typeof value !== 'object') return false
  const v = value as CloudSnapshot
  return typeof v.lastActiveAt === 'number' && Array.isArray(v.attempts) && Array.isArray(v.practiceDays)
}

export function mergeSnapshots(local: CloudSnapshot, remote: CloudSnapshot): CloudSnapshot {
  const localScore = local.lastActiveAt || 0
  const remoteScore = remote.lastActiveAt || 0
  if (!remoteScore && localScore) return stripLocalOnly(local)
  if (!localScore && remoteScore) return stripLocalOnly(remote)
  const newer = localScore >= remoteScore ? local : remote
  const attemptMap = new Map<string, AttemptRecord>()
  for (const row of [...remote.attempts, ...local.attempts]) {
    attemptMap.set(row.id, row)
  }
  return stripLocalOnly({
    ...newer,
    practiceDays: [...new Set([...local.practiceDays, ...remote.practiceDays])].sort(),
    achievements: [...new Set([...local.achievements, ...remote.achievements])],
    attempts: [...attemptMap.values()].sort((a, b) => a.at - b.at).slice(-400),
    streak: Math.max(local.streak, remote.streak),
    xp: Math.max(local.xp, remote.xp),
  })
}

export function takeCloudSnapshot(): CloudSnapshot {
  const s = usePlayerStore.getState()
  return stripLocalOnly({
    version: CLOUD_VERSION,
    studentName: s.studentName,
    xp: s.xp,
    sparks: s.sparks,
    streak: s.streak,
    lastDay: s.lastDay,
    stats: s.stats,
    attempts: s.attempts,
    achievements: s.achievements,
    cosmetics: s.cosmetics,
    parent: s.parent,
    mission: s.mission,
    session: s.session,
    bookmark: s.bookmark,
    practiceDays: s.practiceDays,
    lastActiveAt: s.lastActiveAt,
    soundOn: s.soundOn,
    compliance: s.compliance,
    permissions: s.permissions,
  })
}

export function applyCloudSnapshot(snap: CloudSnapshot) {
  const clean = stripLocalOnly(snap)
  usePlayerStore.setState({
    studentName: clean.studentName,
    xp: clean.xp,
    sparks: clean.sparks,
    streak: clean.streak,
    lastDay: clean.lastDay,
    stats: clean.stats,
    attempts: clean.attempts,
    achievements: clean.achievements,
    cosmetics: clean.cosmetics,
    parent: clean.parent,
    mission: clean.mission,
    session: clean.session,
    bookmark: clean.bookmark,
    practiceDays: clean.practiceDays,
    lastActiveAt: clean.lastActiveAt,
    soundOn: clean.soundOn,
    compliance: clean.compliance,
    permissions: clean.permissions,
  })
}
