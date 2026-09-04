export type HapticKind = 'light' | 'success' | 'warn'

export function haptic(kind: HapticKind = 'light') {
  if (typeof navigator === 'undefined' || typeof navigator.vibrate !== 'function') return
  if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return
  }
  const pattern = kind === 'success' ? [8, 24, 8] : kind === 'warn' ? [16, 32, 16] : [10]
  navigator.vibrate(pattern)
}
