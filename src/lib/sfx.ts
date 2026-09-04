let ctx: AudioContext | null = null
let muted = false
let bed: { osc: OscillatorNode; gain: GainNode }[] = []
let bedTimer: ReturnType<typeof setInterval> | undefined

function audio() {
  if (typeof window === 'undefined') return null
  ctx ??= new AudioContext()
  return ctx
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
  osc.type = type
  osc.frequency.setValueAtTime(freq, start)
  g.gain.setValueAtTime(0.0001, start)
  g.gain.exponentialRampToValueAtTime(gain, start + 0.02)
  g.gain.exponentialRampToValueAtTime(0.0001, start + duration)
  osc.connect(g)
  g.connect(ac.destination)
  osc.start(start)
  osc.stop(start + duration + 0.02)
}

const WORLD_BED: Record<string, number[]> = {
  harbor: [196, 247, 294],
  market: [220, 277, 330],
  belowzero: [165, 196, 247],
  gallery: [247, 311, 370],
  gearworks: [185, 220, 277],
  bridge: [196, 247, 311],
  boundary: [174, 220, 261],
  plaza: [208, 262, 311],
  courtcrate: [196, 233, 294],
  arcade: [247, 311, 392],
  station: [165, 220, 262],
  groundlab: [185, 233, 277],
  peak: [147, 196, 247],
}

export const sfx = {
  whoosh() {
    tone(240, 0.16, 'sine', 0.04)
    tone(360, 0.14, 'sine', 0.03, 0.07)
  },
  correct() {
    tone(523, 0.12, 'triangle', 0.07)
    tone(659, 0.14, 'triangle', 0.06, 0.08)
    tone(784, 0.2, 'triangle', 0.05, 0.16)
  },
  miss() {
    tone(196, 0.22, 'sine', 0.05)
    tone(155, 0.18, 'sine', 0.04, 0.08)
  },
  lock() {
    tone(440, 0.09, 'square', 0.035)
    tone(660, 0.14, 'square', 0.03, 0.07)
  },
  xp() {
    tone(784, 0.1, 'sine', 0.045)
    tone(988, 0.12, 'sine', 0.04, 0.09)
    tone(1174, 0.18, 'sine', 0.035, 0.18)
  },
  start() {
    tone(392, 0.12, 'triangle', 0.05)
    tone(523, 0.12, 'triangle', 0.05, 0.11)
    tone(659, 0.2, 'triangle', 0.055, 0.22)
  },
  tap() {
    tone(880, 0.06, 'sine', 0.03)
  },
}

export function startAmbient(worldId: string) {
  stopAmbient()
  if (muted) return
  const ac = audio()
  if (!ac) return
  const notes = WORLD_BED[worldId] ?? WORLD_BED.harbor
  notes.forEach((freq, i) => {
    const osc = ac.createOscillator()
    const g = ac.createGain()
    osc.type = 'sine'
    osc.frequency.value = freq
    g.gain.value = 0.012 - i * 0.002
    osc.connect(g)
    g.connect(ac.destination)
    osc.start()
    bed.push({ osc, gain: g })
  })
  let step = 0
  bedTimer = setInterval(() => {
    if (muted) return
    const n = notes[step % notes.length] ?? 220
    tone(n * 2, 0.18, 'triangle', 0.018)
    step += 1
  }, 900)
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
