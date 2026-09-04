export function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace('#', '')
  const n = Number.parseInt(clean.length === 3 ? clean.split('').map((c) => c + c).join('') : clean, 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

/** Pull saturation down so district colors feel like night lighting, not stickers. */
export function nightHex(hex: string, sat = 0.42, value = 0.38): string {
  const [r, g, b] = hexToRgb(hex)
  const max = Math.max(r, g, b) || 1
  const mix = (c: number) => Math.round(c * sat + (c / max) * 255 * value * (1 - sat))
  const nr = Math.min(255, mix(r))
  const ng = Math.min(255, mix(g))
  const nb = Math.min(255, mix(b))
  return `#${[nr, ng, nb].map((c) => c.toString(16).padStart(2, '0')).join('')}`
}

export function sectorCode(name: string) {
  const parts = name.split(/[\s-]+/).filter(Boolean)
  if (parts.length >= 2) return `${parts[0]![0] ?? ''}${parts[1]![0] ?? ''}`.toUpperCase()
  return name.slice(0, 2).toUpperCase()
}
