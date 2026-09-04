import { pickDeviceVoice, speakable } from './talk.ts'

export interface VoiceProvider {
  readonly id: string
  readonly label: string
  speak(text: string, opts?: { rate?: number; interrupt?: boolean }): Promise<void>
  listen(onResult: (transcript: string, isFinal: boolean) => void): () => void
  stop(): void
  supported(): { speak: boolean; listen: boolean }
}

type BrowserRec = {
  lang: string
  continuous: boolean
  interimResults: boolean
  onresult: ((event: { results: ArrayLike<{ isFinal: boolean; 0?: { transcript: string } }> }) => void) | null
  start: () => void
  stop: () => void
}

type RecCtor = { new (): BrowserRec }

export class BrowserVoiceProvider implements VoiceProvider {
  readonly id = 'browser'
  readonly label = 'Browser voice'
  private rec: BrowserRec | null = null

  supported() {
    const speak = typeof window !== 'undefined' && 'speechSynthesis' in window
    const listen =
      typeof window !== 'undefined' &&
      Boolean(window.SpeechRecognition || window.webkitSpeechRecognition)
    return { speak, listen }
  }

  async speak(text: string, opts?: { rate?: number; interrupt?: boolean }) {
    if (!this.supported().speak) return
    if (opts?.interrupt !== false) window.speechSynthesis.cancel()
    const utter = new SpeechSynthesisUtterance(speakable(text))
    utter.rate = opts?.rate ?? 0.92
    utter.pitch = 1
    const voices = window.speechSynthesis.getVoices()
    const preferred = pickDeviceVoice(voices)
    if (preferred) utter.voice = preferred
    await new Promise<void>((resolve) => {
      utter.onend = () => resolve()
      utter.onerror = () => resolve()
      window.speechSynthesis.speak(utter)
    })
  }

  listen(onResult: (transcript: string, isFinal: boolean) => void) {
    const Ctor = (window.SpeechRecognition || window.webkitSpeechRecognition) as RecCtor | undefined
    if (!Ctor) return () => {}
    const rec = new Ctor()
    rec.lang = 'en-US'
    rec.continuous = false
    rec.interimResults = true
    rec.onresult = (event) => {
      const last = event.results[event.results.length - 1]
      if (!last) return
      onResult(last[0]?.transcript ?? '', last.isFinal)
    }
    rec.start()
    this.rec = rec
    return () => rec.stop()
  }

  stop() {
    this.rec?.stop()
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel()
    }
  }
}

export class FuturePremiumVoiceProvider implements VoiceProvider {
  readonly id = 'premium-future'
  readonly label = 'Premium voice (future)'
  private fallback: VoiceProvider

  constructor(fallback: VoiceProvider = new BrowserVoiceProvider()) {
    this.fallback = fallback
  }

  supported() {
    return this.fallback.supported()
  }

  speak(text: string, opts?: { rate?: number; interrupt?: boolean }) {
    return this.fallback.speak(text, opts)
  }

  listen(onResult: (transcript: string, isFinal: boolean) => void) {
    return this.fallback.listen(onResult)
  }

  stop() {
    this.fallback.stop()
  }
}

export type VoiceProviderKind = 'browser' | 'premium-future'

export function createVoiceProvider(kind: VoiceProviderKind = 'browser'): VoiceProvider {
  if (kind === 'premium-future') return new FuturePremiumVoiceProvider()
  return new BrowserVoiceProvider()
}

export function parseVoice(transcript: string): {
  intent: 'confused' | 'another_way' | 'why' | 'example' | 'answer' | 'hint' | 'unknown'
  number?: number
} {
  const t = transcript.toLowerCase().trim()
  const num = t.match(/(-?\d+(?:\.\d+)?)/)
  const number = num ? Number(num[1]) : undefined
  if (/don'?t get|confused|stuck|no idea/.test(t)) return { intent: 'confused' }
  if (/another way|different way|explain.*else|rephrase/.test(t)) return { intent: 'another_way' }
  if (/why (did|do|we)|why divide|why multiply|why subtract/.test(t)) return { intent: 'why' }
  if (/another example|try another|new one/.test(t)) return { intent: 'example' }
  if (/hint|help me|nudge/.test(t)) return { intent: 'hint' }
  if (/i got|my answer|i think|it'?s|answer is/.test(t) && number !== undefined) {
    return { intent: 'answer', number }
  }
  if (number !== undefined && t.length < 12) return { intent: 'answer', number }
  return { intent: 'unknown' }
}

declare global {
  interface Window {
    SpeechRecognition?: RecCtor
    webkitSpeechRecognition?: RecCtor
  }
}
