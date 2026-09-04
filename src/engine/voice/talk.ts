/** Make on-device speech read like talk, not a command stack. */

export function speakable(text: string) {
  return text
    .replace(/×/g, ' times ')
    .replace(/÷/g, ' divided by ')
    .replace(/→/g, ', then ')
    .replace(/≥/g, ' at least ')
    .replace(/≤/g, ' at most ')
    .replace(/≠/g, ' not equal to ')
    .replace(/√/g, ' square root of ')
    .replace(/π/g, ' pi ')
    .replace(/%/g, ' percent ')
    .replace(/\bKNOW\b/g, 'what you know')
    .replace(/\bFIND\b/g, 'what you need to find')
    .replace(/\bMOVE\b/g, 'the math move')
    .replace(/\bCHECK\b/g, 'check')
    .replace(/\s=\s*$/g, ', equals what?')
    .replace(/\s=\s/g, ' equals ')
    .replace(/\s{2,}/g, ' ')
    .replace(/\s+([,.!?])/g, '$1')
    .trim()
}

export function talkHint(text: string) {
  return `Okay. ${speakable(text)}`
}

export function talkWhy(text: string) {
  return `Here's why. ${speakable(text)}`
}

export function talkAnother(text: string) {
  return `Another way to see it. ${speakable(text)}`
}

export function talkHeard(n: number) {
  return `Got it. I heard ${n}. Lock it if that's the one you want.`
}

const HUMANISH = /samantha|aria|jenny|allison|susan|karen|moira|tessa|victoria|natural|premium|neural|wavenet|studio|enhanced/i

export function pickDeviceVoice<T extends { name: string; lang: string }>(voices: T[]): T | undefined {
  return (
    voices.find((v) => /en-US/i.test(v.lang) && !HUMANISH.test(v.name)) ??
    voices.find((v) => /en/i.test(v.lang) && !HUMANISH.test(v.name)) ??
    voices.find((v) => /en/i.test(v.lang)) ??
    voices[0]
  )
}
