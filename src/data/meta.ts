import type { AchievementDef, CosmeticDef } from '../types.ts'

export const ACHIEVEMENTS: AchievementDef[] = [
  { id: 'trust-yourself', name: 'Trust Yourself', description: 'Kept a correct answer instead of changing it.', icon: 'lock' },
  { id: 'different-look', name: 'Different Look, Same Math', description: 'Recognized one concept in multiple formats.', icon: 'layers' },
  { id: 'comeback', name: 'Comeback', description: 'Correctly solved a problem after an initial mistake.', icon: 'rotate' },
  { id: 'locked-in', name: 'Locked In', description: 'Got five Test Lab plays right in one session.', icon: 'target' },
  { id: 'paper-work', name: 'Paper Work', description: 'Completed a full problem using written steps.', icon: 'pen' },
  { id: 'flight-complete', name: 'Clean Flight', description: 'Finished a full 15-minute mission.', icon: 'plane' },
  { id: 'open-road', name: 'Open Road', description: 'Drove the RS into the next subject’s adventure.', icon: 'car' },
  { id: 'streak-3', name: 'Three-Day Sky', description: 'Finished three daily 15s in a row.', icon: 'flame' },
  { id: 'streak-7', name: 'Week in the Air', description: 'Finished seven daily 15s in a row.', icon: 'flame' },
  { id: 'boss-down', name: 'Boss Down', description: 'Beat a boss problem on paper.', icon: 'crown' },
  { id: 'voice-ask', name: 'Ask out loud', description: 'Used voice to ask for another way.', icon: 'mic' },
]

export const COSMETICS: CosmeticDef[] = [
  { id: 'goggles-base', name: 'Signal chevron', slot: 'goggles', subtitle: 'Locked gold', unlock: 'start' },
  { id: 'goggles-gold', name: 'Amber chevron', slot: 'goggles', subtitle: 'Focus', unlock: 'locked-in' },
  { id: 'goggles-paint', name: 'Gallery chevron', slot: 'goggles', subtitle: 'Paint', unlock: 'paper-work' },
  { id: 'hoodie-base', name: 'Signal suit', slot: 'hoodie', subtitle: 'Bone hood · locked', unlock: 'start' },
  { id: 'hoodie-court', name: 'Lane suit', slot: 'hoodie', subtitle: 'Terracotta', unlock: 'flight-complete' },
  { id: 'hoodie-signal', name: 'Signal bone', slot: 'hoodie', subtitle: 'Same locked hood', unlock: 'different-look' },
  { id: 'kicks-base', name: 'Signal boots', slot: 'kicks', subtitle: 'Bone / navy · locked', unlock: 'start' },
  { id: 'kicks-volt', name: 'Volt High-Tops', slot: 'kicks', subtitle: 'Boss-clear energy', unlock: 'boss-down' },
  { id: 'figure-base', name: 'Signal', slot: 'figure', subtitle: 'Locked player', unlock: 'start' },
  { id: 'figure-lockin', name: 'Locked in', slot: 'figure', subtitle: 'KEEP THE FIRST ANSWER', unlock: 'trust-yourself' },
  { id: 'figure-gallery', name: 'Gallery form', slot: 'figure', subtitle: 'SAME MATH, NEW FRAME', unlock: 'comeback' },
  { id: 'figure-peak', name: 'Peak form', slot: 'figure', subtitle: 'ALGEBRA I APPROACHING', unlock: 'streak-7' },
  { id: 'paint-volt', name: 'Harbor RS', slot: 'paint', subtitle: 'Muted yellow · locked', unlock: 'start' },
  { id: 'paint-night', name: 'Night Harbor', slot: 'paint', subtitle: 'Deep navy wrap', unlock: 'flight-complete' },
  { id: 'paint-leaf', name: 'Locked-In Green', slot: 'paint', subtitle: 'Clean-flight wrap', unlock: 'streak-3' },
  { id: 'wheels-bronze', name: 'Bronze Spokes', slot: 'wheels', subtitle: 'Starter rims', unlock: 'start' },
  { id: 'wheels-gold', name: 'Gold Mesh', slot: 'wheels', subtitle: 'Trust-yourself rims', unlock: 'trust-yourself' },
  { id: 'wing-black', name: 'Matte Wing', slot: 'wing', subtitle: 'Factory aero', unlock: 'start' },
  { id: 'wing-gold', name: 'Gold Wing', slot: 'wing', subtitle: 'Boss-clear aero', unlock: 'boss-down' },
]
