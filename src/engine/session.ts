import { SKILLS, skillsForTopic } from '../data/curriculum.ts'
import { familiesForSkill, questionById, QUESTIONS, questionsForFamily } from '../data/questions.ts'
import { dayKey, hashString, mulberry32, pick, shuffle } from '../lib/hash.ts'
import type { DailyMission, MissionPhase, ParentSettings, Question } from '../types.ts'
import { compositeMastery, emptyStats, weakestSkills } from './mastery.ts'
import type { DimensionStats } from '../types.ts'

const PHASE_MINUTES = { warmup: 3, builder: 4, lab: 4, boss: 3, recap: 1 } as const

export function generateDailyMission(
  stats: Record<string, DimensionStats>,
  parent: ParentSettings,
  date = new Date(),
  extra = false,
): DailyMission {
  const key = extra ? `${dayKey(date)}-plus` : dayKey(date)
  const rng = mulberry32(hashString(`${key}:${parent.moduleId}:${parent.topicId}`))

  const classroomIds = skillsForTopic(parent.moduleId, parent.topicId)
  const classroomSkill =
    classroomIds[0] ??
    weakestSkills(stats, 'classroom', 1)[0]?.skill.id ??
    'two-step-eq'

  const foundationSkill =
    weakestSkills(stats, 'foundation', 3)[Math.floor(rng() * 3)]?.skill.id ?? 'fractions'

  const nextCandidates = SKILLS.filter((s) => s.track === 'next')
  const classroomMastery = compositeMastery(stats[classroomSkill] ?? emptyStats())
  const nextSkill =
    classroomMastery >= 58
      ? (pick(rng, nextCandidates).id as string)
      : weakestSkills(stats, 'next', 1)[0]?.skill.id ?? 'slope-linear'

  const families = familiesForSkill(classroomSkill)
  const familyId = families.length ? pick(rng, families) : 'hoodie-equation'

  const warmup = pickN(
    rng,
    QUESTIONS.filter(
      (q) =>
        !q.id.startsWith('boss') &&
        q.difficulty <= 2 &&
        (q.skillId === foundationSkill || q.skillId === classroomSkill || q.track === 'foundation'),
    ),
    4,
  )

  const builder = pickN(
    rng,
    QUESTIONS.filter((q) => q.skillId === classroomSkill && !q.id.startsWith('boss')),
    2,
  )

  const lab = labSequence(familyId, rng)

  const bosses = QUESTIONS.filter(
    (q) =>
      (q.id.startsWith('boss') || q.format === 'multistep') &&
      (q.skillId === classroomSkill || q.skillId === nextSkill || q.skillId === foundationSkill),
  )
  const fallbackBoss = QUESTIONS.filter((q) => q.id.startsWith('boss'))
  const boss = pickN(rng, bosses.length ? bosses : fallbackBoss, 1)

  const phases: MissionPhase[] = [
    {
      phase: 'warmup',
      minutes: PHASE_MINUTES.warmup,
      questionIds: warmup.map((q) => q.id),
      label: 'Warm-Up',
      coachLine: 'Easy ignition. Get a couple right and feel the board.',
    },
    {
      phase: 'builder',
      minutes: PHASE_MINUTES.builder,
      questionIds: builder.map((q) => q.id),
      label: 'Skill Builder',
      coachLine: 'Paper nearby. This is today’s classroom move, visually.',
    },
    {
      phase: 'lab',
      minutes: PHASE_MINUTES.lab,
      questionIds: lab.map((q) => q.id),
      label: 'Test Lab',
      coachLine: 'Same math, different look. Don’t let the wrapper fool you.',
    },
    {
      phase: 'boss',
      minutes: PHASE_MINUTES.boss,
      questionIds: boss.map((q) => q.id),
      label: 'Boss Problem',
      coachLine: 'One meaty item. Write it. Lock it. Walk away proud.',
    },
    {
      phase: 'recap',
      minutes: PHASE_MINUTES.recap,
      questionIds: [],
      label: 'Recap',
      coachLine: 'Land the flight. Name what was real vs what was nerves.',
    },
  ]

  const classroomName = SKILLS.find((s) => s.id === classroomSkill)?.name ?? 'today’s skill'
  return {
    dateKey: key,
    title: extra ? `Keep Flying · ${classroomName}` : `Today’s Flight · ${classroomName}`,
    focusSkillId: classroomSkill,
    foundationSkillId: foundationSkill,
    nextSkillId: nextSkill,
    familyId,
    phases,
  }
}

export function labSequence(familyId: string, rng: () => number): Question[] {
  const fam = questionsForFamily(familyId).filter((q) => !q.id.startsWith('boss'))
  const preferred = ['word', 'equation', 'graph', 'table', 'diagram', 'missing', 'mcq'] as const
  const picked: Question[] = []
  for (const format of preferred) {
    const hit = fam.find((q) => q.format === format && !picked.includes(q))
    if (hit) picked.push(hit)
    if (picked.length >= 3) break
  }
  if (picked.length < 3) {
    for (const q of shuffle(rng, fam)) {
      if (!picked.includes(q)) picked.push(q)
      if (picked.length >= 3) break
    }
  }
  return picked.slice(0, 4)
}

function pickN(rng: () => number, pool: Question[], n: number) {
  const unique = shuffle(rng, pool)
  const out: Question[] = []
  for (const q of unique) {
    if (!out.some((x) => x.id === q.id)) out.push(q)
    if (out.length >= n) break
  }
  if (out.length < n) {
    const more = shuffle(rng, QUESTIONS.filter((q) => !q.id.startsWith('boss')))
    for (const q of more) {
      if (!out.some((x) => x.id === q.id)) out.push(q)
      if (out.length >= n) break
    }
  }
  return out
}

export function missionQuestionCount(mission: DailyMission) {
  return mission.phases.reduce((n, p) => n + p.questionIds.length, 0)
}

export function missionMinutes(mission: DailyMission) {
  return mission.phases.reduce((n, p) => n + p.minutes, 0)
}

export function resolveQuestions(ids: string[]) {
  return ids.map((id) => questionById(id)).filter((q): q is Question => Boolean(q))
}
