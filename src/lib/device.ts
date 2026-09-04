export type Surface = 'watch' | 'phone' | 'tablet' | 'desktop'

export function surfaceFromSize(width: number, height: number): Surface {
  if (width > 0 && width <= 360 && height <= 480) return 'watch'
  if (width < 768) return 'phone'
  if (width < 1100) return 'tablet'
  return 'desktop'
}

export function readSurface() {
  if (typeof window === 'undefined') return 'phone' as const
  return surfaceFromSize(window.innerWidth, window.innerHeight)
}
