let ctx: AudioContext | null = null
let muted = false
let bed: { osc: OscillatorNode; gain: GainNode }[] = []
let bedTimer: ReturnType<typeof setInterval> | undefined

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
  filter.frequency.setValueAtTime(Math.min(1400, freq * 3.2), start)
  g.gain.setValueAtTime(0.0001, start)
  g.gain.exponentialRampToValueAtTime(gain, start + 0.04)
  g.gain.exponentialRampToValueAtTime(0.0001, start + duration)
  osc.connect(filter)
  filter.connect(g)
  g.connect(ac.destination)
  osc.start(start)
  osc.stop(start + duration + 0.04)
}

/** Modal roots for each district — same arrangement, different key. */
const WORLD_BED: Record<string, number[]> = {
  harbor: [130.81, 196, 261.63],
  market: [146.83, 220, 293.66],
  belowzero: [123.47, 185, 246.94],
  gallery: [164.81, 246.94, 329.63],
  gearworks: [138.59, 207.65, 277.18],
  bridge: [130.81, 196, 246.94],
  boundary: [116.54, 174.61, 233.08],
  plaza: [146.83, 196, 293.66],
  courtcrate: [130.81, 174.61, 246.94],
  arcade: [164.81, 220, 329.63],
  station: [110, 165, 220],
  groundlab: [123.47, 185, 246.94],
  peak: [98, 147, 196],
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

export function startAmbient(worldId: string) {
  stopAmbient()
  if (muted) return
  const ac = audio()
  if (!ac) return
  const notes = WORLD_BED[worldId] ?? WORLD_BED.harbor
  const root = notes[0] ?? 130.81
  const fifth = notes[1] ?? 196
  const color = notes[2] ?? 261.63

  const master = ac.createGain()
  master.gain.value = 0.042
  master.connect(ac.destination)

  const filter = ac.createBiquadFilter()
  filter.type = 'lowpass'
  filter.frequency.value = 340
  filter.Q.value = 0.45
  filter.connect(master)

  const lfo = ac.createOscillator()
  const lfoGain = ac.createGain()
  lfo.type = 'sine'
  lfo.frequency.value = 0.06
  lfoGain.gain.value = 70
  lfo.connect(lfoGain)
  lfoGain.connect(filter.frequency)
  lfo.start()

  const swell = ac.createOscillator()
  const swellGain = ac.createGain()
  swell.type = 'sine'
  swell.frequency.value = 0.045
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

  let step = 0
  bedTimer = setInterval(() => {
    if (muted) return
    tone(root / 2, 0.3, 'sine', 0.01)
    if (step % 2 === 1) {
      const n = notes[step % notes.length] ?? root
      tone(n, 0.7, 'triangle', 0.01)
      tone(n * 1.5, 0.45, 'sine', 0.006, 0.22)
    }
    step += 1
  }, 1680)
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
  if (bedTimer) clearInterval(bedTimer)
  bedTimer = undefined
}

export async function resumeAudio() {
  const ac = audio()
  if (ac && ac.state !== 'running') await ac.resume()
}
