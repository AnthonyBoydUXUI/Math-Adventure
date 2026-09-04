const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] as const
const WEEKDAYS_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const
const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
] as const
const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] as const

export function pad2(n: number) {
  return String(n).padStart(2, '0')
}

/** Local calendar day — not UTC — so an evening session still counts as today. */
export function localDayKey(date = new Date()) {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`
}

export function dayKey(date = new Date()) {
  return localDayKey(date)
}

export function missionDay(dateKey: string) {
  return dateKey.replace(/-plus$/, '')
}

export function isSameCalendarDay(dateKey: string, date = new Date()) {
  return missionDay(dateKey) === localDayKey(date)
}

export function formatClock(date = new Date()) {
  const weekday = WEEKDAYS[date.getDay()] ?? 'Friday'
  const month = MONTHS[date.getMonth()] ?? 'September'
  const year = date.getFullYear()
  const time = formatTime(date)
  return {
    weekday,
    weekdayShort: WEEKDAYS_SHORT[date.getDay()] ?? 'Fri',
    month,
    monthShort: MONTHS_SHORT[date.getMonth()] ?? 'Sep',
    day: date.getDate(),
    year,
    time,
    line: `${weekday} · ${month} ${date.getDate()}, ${year} · ${time}`,
    compact: `${WEEKDAYS_SHORT[date.getDay()]} · ${MONTHS_SHORT[date.getMonth()]} ${date.getDate()}, ${year} · ${time}`,
  }
}

export function formatTime(date = new Date()) {
  const hours = date.getHours()
  const ampm = hours >= 12 ? 'PM' : 'AM'
  const h12 = hours % 12 || 12
  return `${h12}:${pad2(date.getMinutes())} ${ampm}`
}

export interface WeekDay {
  key: string
  weekdayShort: string
  day: number
  isToday: boolean
  isFuture: boolean
}

/** Monday–Sunday of the week containing `date`, local calendar. */
export function weekDays(date = new Date()): WeekDay[] {
  const today = localDayKey(date)
  const monday = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  const weekday = monday.getDay()
  const offset = weekday === 0 ? -6 : 1 - weekday
  monday.setDate(monday.getDate() + offset)
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + i)
    const key = localDayKey(d)
    return {
      key,
      weekdayShort: WEEKDAYS_SHORT[d.getDay()] ?? 'Mon',
      day: d.getDate(),
      isToday: key === today,
      isFuture: key > today,
    }
  })
}

export function msUntilNextLocalMidnight(date = new Date()) {
  const next = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1)
  return next.getTime() - date.getTime()
}
