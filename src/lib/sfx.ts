import type { Phase } from '../types.ts'

export type AmbientPhase = Phase | 'idle'

export interface WorldScore {
  notes: [number, number, number]
  pulseMs: number
  filter: number
  lfo: number
  gain: number
  motif: 'runway' | 'neon' | 'ice' | 'paint' | 'gears' | 'balance' | 'tide' | 'plaza' | 'bounce' | 'spin' | 'plot' | 'calibrate' | 'climb'
}

/** Each district has its own arrangement — not just a key change. */
export const WORLD_SCORES: Record<string, WorldScore> = {
  harbor: { notes: [130.81, 196, 261.63], pulseMs: 1680, filter: 360, lfo: 0.055, gain: 0.04, motif: 'runway' },
  market: { notes: [146.83, 220, 293.66], pulseMs: 1320, filter: 520, lfo: 0.09, gain: 0.038, motif: 'neon' },
  belowzero: { notes: [123.47, 185, 246.94], pulseMs: 1980, filter: 280, lfo: 0.04, gain: 0.036, motif: 'ice' },
  gallery: { notes: [164.81, 246.94, 329.63], pulseMs: 1760, filter: 440, lfo: 0.05, gain: 0.038, motif: 'paint' },
  gearworks: { notes: [138.59, 207.65, 277.18], pulseMs: 1040, filter: 400, lfo: 0.07, gain: 0.037, motif: 'gears' },
  bridge: { notes: [130.81, 196, 246.94], pulseMs: 1600, filter: 340, lfo: 0.048, gain: 0.04, motif: 'balance' },
  boundary: { notes: [116.54, 174.61, 233.08], pulseMs: 2100, filter: 300, lfo: 0.035, gain: 0.036, motif: 'tide' },
  plaza: { notes: [146.83, 196, 293.66], pulseMs: 1540, filter: 380, lfo: 0.052, gain: 0.038, motif: 'plaza' },
  courtcrate: { notes: [130.81, 174.61, 246.94], pulseMs: 1180, filter: 420, lfo: 0.08, gain: 0.04, motif: 'bounce' },
  arcade: { notes: [164.81, 220, 329.63], pulseMs: 980, filter: 560, lfo: 0.11, gain: 0.036, motif: 'spin' },
  station: { notes: [110, 165, 220], pulseMs: 1880, filter: 320, lfo: 0.042, gain: 0.037, motif: 'plot' },
  groundlab: { notes: [123.47, 185, 246.94], pulseMs: 1440, filter: 330, lfo: 0.05, gain: 0.035, motif: 'calibrate' },
  peak: { notes: [98, 147, 196], pulseMs: 1720, filter: 300, lfo: 0.038, gain: 0.042, motif: 'climb' },
}

export function worldScore(id: string) {
  return WORLD_SCORES[id] ?? WORLD_SCORES.harbor!
}

let ctx: AudioContext | null = null
let muted = false
let bed: { osc: OscillatorNode; gain: GainNode }[] = []
let bedTimer: ReturnType<typeof setInterval> | undefined
let bedWorld = ''
let bedPhase: AmbientPhase = 'idle'

function audio() {
  if (typeof window === 'undefined') return null
  try {
    ctx ??= new AudioContext()
    return ctx
  } catch {
    return null
  }
}

export function isMuted() {
  return muted
}

export function setMuted(next: boolean) {
  muted = next
  if (muted) stopAmbient()
}

function tone(freq: number, duration: number, type: OscillatorType, gain = 0.06, delay = 0) {
  if (muted) return
  const ac = audio()
  if (!ac) return
  const start = ac.currentTime + delay
  const osc = ac.createOscillator()
  const g = ac.createGain()
  const filter = ac.createBiquadFilter()
  osc.type = type
  osc.frequency.setValueAtTime(freq, start)
  filter.type = 'lowpass'
  filter.frequency.setValueAtTime(Math.min(1600, freq * 3.2), start)
  g.gain.setValueAtTime(0.0001, start)
  g.gain.exponentialRampToValueAtTime(gain, start + 0.04)
  g.gain.exponentialRampToValueAtTime(0.0001, start + duration)
  osc.connect(filter)
  filter.connect(g)
  g.connect(ac.destination)
  osc.start(start)
  osc.stop(start + duration + 0.04)
}

function intensity(phase: AmbientPhase) {
  if (phase === 'boss') return { gain: 1.18, pulse: 0.82 }
  if (phase === 'lab') return { gain: 1.06, pulse: 0.92 }
  if (phase === 'recap' || phase === 'idle') return { gain: 0.82, pulse: 1.18 }
  return { gain: 1, pulse: 1 }
}

function playMotif(score: WorldScore, step: number, hot: boolean) {
  const [root, fifth, color] = score.notes
  const g = hot ? 0.014 : 0.009
  switch (score.motif) {
    case 'runway':
      tone(root / 2, 0.28, 'sine', g)
      if (step % 2) tone(fifth, 0.55, 'triangle', g * 0.7, 0.18)
      break
    case 'neon':
      tone(color, 0.12, 'triangle', g * 0.55)
      if (step % 2) tone(fifth * 2, 0.1, 'sine', g * 0.35, 0.16)
      break
    case 'ice':
      tone(root / 2, 0.7, 'sine', g * 0.8)
      tone(color, 0.9, 'triangle', g * 0.35, 0.4)
      break
    case 'paint':
      tone(step % 2 ? color : fifth, 0.5, 'triangle', g * 0.7)
      tone(root, 0.35, 'sine', g * 0.4, 0.2)
      break
    case 'gears':
      tone(root, 0.08, 'triangle', g)
      tone(fifth, 0.08, 'triangle', g * 0.6, 0.12)
      if (step % 3 === 0) tone(color, 0.16, 'sine', g * 0.5, 0.24)
      break
    case 'balance':
      tone(step % 2 ? fifth : root, 0.4, 'sine', g)
      tone(step % 2 ? root : fifth, 0.4, 'sine', g * 0.55, 0.2)
      break
    case 'tide':
      tone(root / 2, 0.85, 'sine', g * 0.9)
      if (step % 2) tone(fifth / 2, 0.7, 'triangle', g * 0.4, 0.35)
      break
    case 'plaza':
      tone(fifth, 0.45, 'triangle', g * 0.65)
      tone(color, 0.3, 'sine', g * 0.35, 0.22)
      break
    case 'bounce':
      tone(root, 0.12, 'triangle', g)
      tone(fifth, 0.14, 'sine', g * 0.7, 0.14)
      if (hot) tone(color, 0.1, 'sine', g * 0.4, 0.28)
      break
    case 'spin':
      tone(score.notes[step % 3] ?? root, 0.16, 'triangle', g * 0.5)
      tone(root / 2, 0.2, 'sine', g * 0.5, 0.1)
      break
    case 'plot':
      tone(root / 2, 0.35, 'sine', g)
      if (step % 3 === 0) tone(fifth, 0.5, 'triangle', g * 0.45, 0.25)
      break
    case 'calibrate':
      tone(fifth, 0.07, 'sine', g * 0.8)
      if (step % 4 === 0) tone(root, 0.2, 'triangle', g * 0.5)
      break
    case 'climb':
      tone(score.notes[step % 3] ?? root, 0.55, 'sine', g * 0.7)
      tone((score.notes[step % 3] ?? root) * 1.5, 0.28, 'triangle', g * 0.3, 0.2)
      break
  }
}

export const sfx = {
  whoosh() {
    tone(196, 0.22, 'sine', 0.03)
    tone(262, 0.2, 'sine', 0.022, 0.08)
  },
  correct() {
    tone(392, 0.16, 'sine', 0.045)
    tone(523, 0.22, 'triangle', 0.038, 0.1)
    tone(659, 0.32, 'sine', 0.028, 0.2)
  },
  miss() {
    tone(174, 0.28, 'sine', 0.032)
    tone(146, 0.24, 'triangle', 0.024, 0.1)
  },
  lock() {
    tone(330, 0.12, 'sine', 0.03)
    tone(494, 0.18, 'triangle', 0.025, 0.08)
  },
  xp() {
    tone(523, 0.14, 'sine', 0.032)
    tone(659, 0.18, 'sine', 0.028, 0.1)
    tone(784, 0.26, 'triangle', 0.022, 0.2)
  },
  start() {
    tone(262, 0.18, 'sine', 0.036)
    tone(392, 0.2, 'sine', 0.032, 0.14)
    tone(523, 0.34, 'triangle', 0.03, 0.28)
  },
  tap() {
    tone(523, 0.07, 'sine', 0.02)
  },
}

export function startAmbient(worldId: string, phase: AmbientPhase = 'idle') {
  if (muted) {
    stopAmbient()
    return
  }
  if (bedWorld === worldId && bedPhase === phase && bed.length) return
  stopAmbient()
  const ac = audio()
  if (!ac) return
  const score = worldScore(worldId)
  const mix = intensity(phase)
  const [root, fifth, color] = score.notes

  const master = ac.createGain()
  master.gain.value = score.gain * mix.gain
  master.connect(ac.destination)

  const filter = ac.createBiquadFilter()
  filter.type = 'lowpass'
  filter.frequency.value = score.filter * (phase === 'boss' ? 1.15 : 1)
  filter.Q.value = 0.45
  filter.connect(master)

  const lfo = ac.createOscillator()
  const lfoGain = ac.createGain()
  lfo.type = 'sine'
  lfo.frequency.value = score.lfo
  lfoGain.gain.value = 70
  lfo.connect(lfoGain)
  lfoGain.connect(filter.frequency)
  lfo.start()

  const swell = ac.createOscillator()
  const swellGain = ac.createGain()
  swell.type = 'sine'
  swell.frequency.value = score.lfo * 0.75
  swellGain.gain.value = 0.01
  swell.connect(swellGain)
  swellGain.connect(master.gain)
  swell.start()

  function pad(freq: number, type: OscillatorType, vol: number, detune = 0) {
    const osc = ac.createOscillator()
    const g = ac.createGain()
    osc.type = type
    osc.frequency.value = freq
    osc.detune.value = detune
    g.gain.value = vol
    osc.connect(g)
    g.connect(filter)
    osc.start()
    bed.push({ osc, gain: g })
  }

  pad(root, 'sine', 0.2, -5)
  pad(root, 'sine', 0.16, 6)
  pad(root / 2, 'sine', 0.18, 0)
  pad(fifth / 2, 'triangle', 0.08, -3)
  pad(color / 2, 'sine', 0.05, 4)

  bed.push({ osc: lfo, gain: lfoGain })
  bed.push({ osc: swell, gain: swellGain })
  bedWorld = worldId
  bedPhase = phase

  let step = 0
  bedTimer = setInterval(() => {
    if (muted) return
    playMotif(score, step, phase === 'boss' || phase === 'lab')
    step += 1
  }, Math.round(score.pulseMs * mix.pulse))
}

export function stopAmbient() {
  for (const node of bed) {
    try {
      node.osc.stop()
    } catch {
      /* already stopped */
    }
  }
  bed = []
  bedWorld = ''
  bedPhase = 'idle'
  if (bedTimer) clearInterval(bedTimer)
  bedTimer = undefined
}

export async function resumeAudio() {
  const ac = audio()
  if (ac && ac.state !== 'running') await ac.resume()
}
