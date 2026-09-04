export const PERSIST_KEY = 'aero-math-adventure'

export interface ArchiveFile {
  app: 'Aero'
  exportedAt: string
  storageKey: string
  data: unknown
}

export function serializeLocalArchive(now = new Date()): string {
  const raw = typeof localStorage === 'undefined' ? null : localStorage.getItem(PERSIST_KEY)
  let data: unknown = null
  if (raw) {
    try {
      data = JSON.parse(raw)
    } catch {
      data = { unparsed: raw }
    }
  }
  const file: ArchiveFile = {
    app: 'Aero',
    exportedAt: now.toISOString(),
    storageKey: PERSIST_KEY,
    data,
  }
  return JSON.stringify(file, null, 2)
}

export function downloadTextFile(contents: string, filename: string) {
  const blob = new Blob([contents], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.rel = 'noopener'
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

export function clearLocalArchive() {
  if (typeof localStorage === 'undefined') return
  localStorage.removeItem(PERSIST_KEY)
}
