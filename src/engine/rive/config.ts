/** Public Rive runtime. Override with VITE_RIVE_* if a private .riv is added as a secret. */

export function riveSrc() {
  return import.meta.env.VITE_RIVE_SRC || '/rive/vehicles.riv'
}

export function riveStateMachine() {
  return import.meta.env.VITE_RIVE_STATE_MACHINE || 'bumpy'
}

export function riveInputName() {
  return import.meta.env.VITE_RIVE_INPUT || 'bump'
}

export type RiveMood = 'idle' | 'talk' | 'correct' | 'miss'
