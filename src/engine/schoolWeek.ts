import { skillById } from '../data/curriculum.ts'
import { weekDays } from '../lib/clock.ts'
import type { GradeBand, ParentSettings, SchoolPage, SchoolWeek } from '../types.ts'
import { identifyWeekSkills } from './homework.ts'

export const MAX_SCHOOL_PAGES = 8

export function weekKey(date = new Date()) {
  return weekDays(date)[0]!.key
}

export function emptySchoolWeek(date = new Date(), gradeBand: GradeBand = '7'): SchoolWeek {
  return {
    weekKey: weekKey(date),
    note: '',
    skillIds: [],
    gradeBand,
    pages: [],
  }
}

export function activeSchoolWeek(parent: ParentSettings, date = new Date()): SchoolWeek | undefined {
  const week = parent.schoolWeek
  if (!week?.weekKey) return undefined
  if (week.weekKey !== weekKey(date)) return undefined
  if (!week.note.trim() && week.skillIds.length === 0 && week.pages.length === 0) return undefined
  return week
}

export function schoolDaySkill(parent: ParentSettings, date = new Date()) {
  const week = activeSchoolWeek(parent, date)
  if (!week?.skillIds.length) return undefined
  const days = weekDays(date)
  const idx = Math.max(0, days.findIndex((d) => d.isToday))
  return week.skillIds[idx % week.skillIds.length]
}

export function schoolFocusFromNote(note: string, _gradeBand: GradeBand = '7') {
  const skillIds = identifyWeekSkills(note)
  const first = skillIds[0]
  const skill = first ? skillById(first) : undefined
  return {
    skillIds,
    moduleId: skill?.moduleId,
    topicId: skill?.topicId,
  }
}

export function withSchoolPage(week: SchoolWeek, page: SchoolPage): SchoolWeek {
  const pages = [...week.pages.filter((p) => p.id !== page.id), page].slice(-MAX_SCHOOL_PAGES)
  return { ...week, pages }
}

export function withoutSchoolPage(week: SchoolWeek, id: string): SchoolWeek {
  return { ...week, pages: week.pages.filter((p) => p.id !== id) }
}

export function schoolWeekLabel(week: SchoolWeek | undefined) {
  if (!week) return 'No school week set'
  if (week.note.trim()) return week.note.trim()
  if (week.skillIds.length) {
    const names = week.skillIds.map((id) => skillById(id)?.name).filter(Boolean)
    return names.join(' · ') || 'This week’s skills'
  }
  if (week.pages.length) return `${week.pages.length} class page${week.pages.length === 1 ? '' : 's'}`
  return 'No school week set'
}
