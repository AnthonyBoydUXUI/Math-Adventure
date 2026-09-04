import { describe, expect, it } from 'vitest'
import { pickDeviceVoice, speakable, talkHeard, talkHint } from './talk.ts'

describe('conversational device talk', () => {
  it('reads math symbols out loud instead of barking them', () => {
    expect(speakable('8 × 12 =')).toMatch(/8 times 12, equals what/)
    expect(speakable('15% of 40')).toMatch(/15 percent of 40/)
    expect(speakable('Write KNOW and FIND.')).toMatch(/what you know/)
  })

  it('keeps a device voice and skips named-human voices', () => {
    const picked = pickDeviceVoice([
      { name: 'Samantha', lang: 'en-US' },
      { name: 'Google US English', lang: 'en-US' },
      { name: 'Aria Neural', lang: 'en-US' },
    ])
    expect(picked?.name).toBe('Google US English')
    expect(talkHint('Find the per-one.')).toMatch(/^Okay\./)
    expect(talkHeard(24)).toMatch(/I heard 24/)
  })
})
