import type { AnswerSpec } from '../types.ts'

function simplify(n: number, d: number) {
  const g = gcd(Math.abs(n), Math.abs(d))
  return [n / g, d / g] as const
}

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b)
}

export function normalizeText(raw: string) {
  return raw.trim().toLowerCase().replace(/,/g, '').replace(/\s+/g, ' ')
}

function parseNumberish(raw: string): number | null {
  const t = normalizeText(raw).replace(/[$%]/g, '').replace(/units?/, '').trim()
  const frac = t.match(/^(-?\d+)\s*\/\s*(-?\d+)$/)
  if (frac) {
    const n = Number(frac[1])
    const d = Number(frac[2])
    if (d !== 0) return n / d
  }
  const mixed = t.match(/^(-?\d+)\s+(\d+)\s*\/\s*(\d+)$/)
  if (mixed) {
    const whole = Number(mixed[1])
    const n = Number(mixed[2])
    const d = Number(mixed[3])
    if (d !== 0) return whole + (Math.sign(whole || 1) * n) / d
  }
  const num = Number(t)
  return Number.isFinite(num) ? num : null
}

export function checkAnswer(spec: AnswerSpec, raw: string): boolean {
  const given = normalizeText(raw)
  if (!given) return false

  if (spec.type === 'number') {
    const n = parseNumberish(given)
    if (n === null) return false
    const tol = spec.tolerance ?? 0.01
    return Math.abs(n - spec.value) <= tol
  }

  if (spec.type === 'fraction') {
    const frac = given.match(/^(-?\d+)\s*\/\s*(-?\d+)$/)
    if (frac) {
      const [n, d] = simplify(Number(frac[1]), Number(frac[2]))
      const [tn, td] = simplify(spec.n, spec.d)
      return n === tn && d === td
    }
    const n = parseNumberish(given)
    if (n === null) return false
    return Math.abs(n - spec.n / spec.d) <= 0.01
  }

  if (spec.type === 'choice') {
    const letter = given.replace(/[^a-d]/g, '')
    if (letter && letter === spec.correct.toLowerCase()) return true
    const choice = spec.choices.find((c, i) => {
      const tag = String.fromCharCode(97 + i)
      return (
        normalizeText(c) === given ||
        given === tag ||
        given === `${tag})` ||
        given.endsWith(normalizeText(c))
      )
    })
    return Boolean(choice)
  }

  if (spec.type === 'text' || spec.type === 'inequality') {
    const compact = given.replace(/\s+/g, '')
    return spec.accept.some((a) => compact === normalizeText(a).replace(/\s+/g, ''))
  }

  return false
}

export function formatAnswer(spec: AnswerSpec) {
  if (spec.type === 'number') {
    const v = spec.value
    const shown = Number.isInteger(v) ? String(v) : String(Math.round(v * 100) / 100)
    return spec.unit ? `${shown} ${spec.unit}` : shown
  }
  if (spec.type === 'fraction') return `${spec.n}/${spec.d}`
  if (spec.type === 'choice') return spec.correct.toUpperCase()
  return spec.accept[0] ?? ''
}
