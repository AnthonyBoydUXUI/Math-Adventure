let ctx: AudioContext | null = null

function audio() {
  if (typeof window === 'undefined') return null
  ctx ??= new AudioContext()
  return ctx
}

function beep(freq: number, duration: number, type: OscillatorType, gain = 0.05) {
  const ac = audio()
  if (!ac) return
  const osc = ac.createOscillator()
  const g = ac.createGain()
  osc.type = type
  osc.frequency.value = freq
  g.gain.value = gain
  g.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + duration)
  osc.connect(g)
  g.connect(ac.destination)
  osc.start()
  osc.stop(ac.currentTime + duration)
}

export const sfx = {
  whoosh() {
    beep(220, 0.18, 'sine', 0.04)
    setTimeout(() => beep(330, 0.12, 'sine', 0.03), 80)
  },
  correct() {
    beep(523, 0.09, 'triangle', 0.05)
    setTimeout(() => beep(784, 0.16, 'triangle', 0.05), 90)
  },
  miss() {
    beep(196, 0.2, 'sine', 0.04)
  },
  lock() {
    beep(440, 0.08, 'square', 0.03)
    setTimeout(() => beep(660, 0.12, 'square', 0.03), 70)
  },
  xp() {
    beep(880, 0.08, 'sine', 0.035)
    setTimeout(() => beep(1174, 0.14, 'sine', 0.03), 100)
  },
  start() {
    beep(392, 0.1, 'triangle', 0.04)
    setTimeout(() => beep(523, 0.1, 'triangle', 0.04), 110)
    setTimeout(() => beep(659, 0.18, 'triangle', 0.045), 220)
  },
}

export function resumeAudio() {
  void audio()?.resume()
}
