import { afterEach, describe, expect, it } from 'vitest'
import { PRIVACY_SECTIONS, SUPPORT_ISSUES_URL, TERMS_SECTIONS, flattenLegal } from '../content/legal.ts'
import { PERSIST_KEY, clearLocalArchive, serializeLocalArchive } from './archive.ts'

describe('local archive', () => {
  afterEach(() => {
    localStorage.removeItem(PERSIST_KEY)
  })

  it('exports a dated Math Adventure JSON envelope', () => {
    localStorage.setItem(PERSIST_KEY, JSON.stringify({ state: { xp: 12 } }))
    const file = JSON.parse(serializeLocalArchive(new Date('2026-09-04T12:00:00.000Z')))
    expect(file.app).toBe('Math Adventure')
    expect(file.storageKey).toBe(PERSIST_KEY)
    expect(file.exportedAt).toBe('2026-09-04T12:00:00.000Z')
    expect(file.data).toEqual({ state: { xp: 12 } })
  })

  it('wipes the persist key', () => {
    localStorage.setItem(PERSIST_KEY, '{}')
    clearLocalArchive()
    expect(localStorage.getItem(PERSIST_KEY)).toBeNull()
  })
})

describe('App Store legal copy', () => {
  it('names a working support URL and forbids medical diagnosis claims', () => {
    const privacy = flattenLegal(PRIVACY_SECTIONS)
    const terms = flattenLegal(TERMS_SECTIONS)
    expect(privacy).toContain(SUPPORT_ISSUES_URL)
    expect(privacy).toMatch(/not a medical diagnosis/i)
    expect(privacy).toMatch(/Kids Category/)
    expect(privacy).toMatch(/do not sell data|no sale/i)
    expect(terms).toMatch(/not affiliated/i)
    expect(terms).toMatch(/12 or older/)
    expect(privacy).toMatch(/optional email login|If you create an account/i)
  })
})
