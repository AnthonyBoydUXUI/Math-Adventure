export const TRACKS = ['classroom', 'foundation', 'next'] as const
export type Track = (typeof TRACKS)[number]

export const FORMATS = [
  'word',
  'equation',
  'graph',
  'table',
  'diagram',
  'missing',
  'mcq',
  'multistep',
] as const
export type Format = (typeof FORMATS)[number]

export const THEMES = [
  'basketball',
  'gaming',
  'art',
  'sky',
  'money',
  'science',
  'music',
  'real',
] as const
export type Theme = (typeof THEMES)[number]

export const PHASES = ['warmup', 'builder', 'lab', 'boss', 'recap'] as const
export type Phase = (typeof PHASES)[number]

export const SCOREBOARDS = ['word', 'equation', 'multistep'] as const
export type ScoreboardKind = (typeof SCOREBOARDS)[number]

export const DIAGNOSES = [
  'knowledge_gap',
  'arithmetic_slip',
  'format_confusion',
  'pacing',
  'confidence',
  'second_guessing',
  'test_anxiety',
  'skipped_writing',
  'transfer_difficulty',
  'solid',
] as const
export type Diagnosis = (typeof DIAGNOSES)[number]

export const DIMENSIONS = [
  'knowledge',
  'recall',
  'transfer',
  'accuracy',
  'writtenProcess',
  'confidence',
  'responseTime',
] as const
export type Dimension = (typeof DIMENSIONS)[number]

export type VisualSpec =
  | {
      kind: 'number-line'
      min: number
      max: number
      tick: number
      points?: { value: number; label?: string; color?: string }[]
      highlight?: [number, number]
      askValue?: number
    }
  | {
      kind: 'fraction-bar'
      parts: number
      filled: number
      label?: string
      second?: { parts: number; filled: number; label?: string }
    }
  | {
      kind: 'ratio-grid'
      rows: number
      cols: number
      filled: number
      filledLabel?: string
      restLabel?: string
    }
  | {
      kind: 'graph'
      xLabel: string
      yLabel: string
      points: [number, number][]
      line?: boolean
      xMax?: number
      yMax?: number
    }
  | {
      kind: 'table'
      headers: string[]
      rows: (string | number)[][]
      highlightRow?: number
    }
  | {
      kind: 'shape'
      figure: 'rectangle' | 'triangle' | 'circle' | 'parallelogram' | 'trapezoid' | 'prism'
      labels: Record<string, string | number>
    }
  | {
      kind: 'balance'
      left: string[]
      right: string[]
    }
  | {
      kind: 'court'
      made: number
      attempts: number
    }
  | {
      kind: 'money'
      dollars: number
      cents?: number
      note?: string
    }
  | {
      kind: 'line-plot'
      values: number[]
      unit: string
      missing?: number
    }
  | {
      kind: 'angles'
      rays: { deg: number; label: string }[]
      unknown?: string
    }

export type AnswerSpec =
  | { type: 'number'; value: number; tolerance?: number; unit?: string }
  | { type: 'fraction'; n: number; d: number }
  | { type: 'choice'; correct: string; choices: string[] }
  | { type: 'text'; accept: string[] }
  | { type: 'inequality'; accept: string[] }

export interface Question {
  id: string
  familyId: string
  skillId: string
  track: Track
  format: Format
  theme: Theme
  prompt: string
  stem?: string
  visual?: VisualSpec
  answer: AnswerSpec
  paperFirst: boolean
  scoreboard: ScoreboardKind
  hints: string[]
  why: string
  anotherWay: string
  timeTargetSec: number
  difficulty: 1 | 2 | 3 | 4 | 5
  tags?: string[]
}

export interface SkillDef {
  id: string
  name: string
  track: Track
  domain:
    | 'ratios'
    | 'number'
    | 'expressions'
    | 'geometry'
    | 'stats'
    | 'foundation'
    | 'algebra'
  moduleId?: string
  topicId?: string
  blurb: string
}

export interface TopicDef {
  id: string
  name: string
  skillIds: string[]
}

export interface ModuleDef {
  id: string
  volume: 1 | 2
  number: number
  name: string
  topics: TopicDef[]
}

export interface DimensionStats {
  knowledge: number
  recall: number
  transfer: number
  accuracy: number
  writtenProcess: number
  confidence: number
  responseTime: number
  attempts: number
  correct: number
  lastSeen: number
}

export interface AttemptRecord {
  id: string
  at: number
  questionId: string
  skillId: string
  familyId: string
  format: Format
  phase: Phase
  correct: boolean
  firstDraftCorrect: boolean
  changed: boolean
  lockedIn: boolean
  usedHint: boolean
  usedPaper: boolean
  paperPhoto?: string
  confidence: number
  timeMs: number
  diagnosis: Diagnosis
  answerGiven: string
}

export interface AchievementDef {
  id: string
  name: string
  description: string
  icon: string
}

export interface CosmeticDef {
  id: string
  name: string
  slot: 'goggles' | 'hoodie' | 'kicks' | 'figure' | 'paint' | 'wheels' | 'wing'
  subtitle: string
  unlock: string
}

export interface SessionLike {
  active: boolean
  completed: boolean
  phaseIndex: number
  itemIndex: number
}

export interface DailyMission {
  dateKey: string
  title: string
  focusSkillId: string
  foundationSkillId: string
  nextSkillId: string
  familyId: string
  phases: MissionPhase[]
}

export interface MissionPhase {
  phase: Phase
  minutes: number
  questionIds: string[]
  label: string
  coachLine: string
}

export interface PlayerCosmetics {
  goggles: string
  hoodie: string
  kicks: string
  paint: string
  wheels: string
  wing: string
  unlocked: string[]
}

export interface ParentSettings {
  moduleId: string
  topicId: string
  themes: Theme[]
  pressureLab: boolean
  studentName: string
  pagePhoto?: string
  pageNote?: string
}

export interface ComplianceState {
  acknowledgedAt: number | null
  ageBand: '12plus' | null
  role: 'parent' | 'student12' | null
}

export interface PermissionState {
  cameraExplained: boolean
  micExplained: boolean
}

export type VoiceIntent =
  | 'confused'
  | 'another_way'
  | 'why'
  | 'example'
  | 'answer'
  | 'hint'
  | 'unknown'

export interface VoiceResult {
  intent: VoiceIntent
  transcript: string
  number?: number
}
