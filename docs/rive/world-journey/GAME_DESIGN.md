# GAME DESIGN

**Who may edit:** Astra only.  
Status: `DESIGN_READY`

Contract: [`../WORLD_JOURNEY.md`](../WORLD_JOURNEY.md) — locked strings remain authoritative.

---

## Experience goal

World Journey is the living game layer that makes each 15-minute math session feel like forward motion through a premium interactive world. It should reward focus and progress without competing with the math.

The Harbor scene is the proof-of-quality environment: visually polished enough to feel like a real game, restrained enough to remain a learning surface, and legible on phone, tablet, and desktop.

## Player feeling

- **Idle:** anticipation; the world is alive but calm.
- **Warmup:** easy momentum; “I can do this.”
- **Builder:** steady progress; the car feels purposeful.
- **Lab:** sharper concentration; pace rises without becoming stressful.
- **Boss:** focused intensity; strongest motion language of the session, never chaotic.
- **Recap:** arrival and accomplishment; motion resolves cleanly.

The player should feel that correct work moves the journey forward, while a miss is a brief adjustment rather than punishment.

## World / stage fantasy — Harbor / Ratio Runway

Harbor is a contemporary coastal/industrial courtyard interpreted as a collectible game world. The Harbor RS remains pinned while the environment moves beneath it, creating a strong sense of travel without requiring free driving controls.

The world should feel:
- contemporary, premium, and original
- influenced by game-console polish and anime energy without copying any IP
- tactile enough to feel like a designed object/world, not a flat educational background
- visually interesting at a glance, but quiet enough behind math UI

## Phase story

### idle
Slow environmental drift. The car is composed and ready. No urgency.

### warmup
Slightly faster world motion. Small visual energy increase. The session is “starting to roll.”

### builder
Confident cruise. The route feels stable and consistent. This should be the baseline game-feel state.

### lab
More focused pace. Slightly tighter motion rhythm and stronger parallax/light response. Avoid alarm-like effects.

### boss
Fastest sanctioned phase. Increase perceived speed through world movement, wheel motion, parallax, and camera energy rather than screen shake. The car remains readable and centered.

### recap
Resolve to Parked. The world settles. The arrival should communicate “session complete” without confetti inside the Rive file.

## Correct answer / win language

A correct answer produces a short, satisfying forward surge:
- immediate but controlled
- noticeable on mobile
- no giant flash
- no loss of route readability
- resolves naturally back to Cruise

The emotional message is: **good work created momentum.**

## Miss language

A miss produces a subtle brake/hesitation:
- short reverse/slow response
- no red punishment blast
- no aggressive shake
- no humiliation or failure language

The emotional message is: **adjust and keep moving.**

## What “winning a lap” means

A lap is symbolic progress through the learning journey, not a score. A completed loop may trigger app-owned sound or progression feedback in React, but the Rive world only communicates the completed route visually and fires the required trigger.

## Out of scope this sprint

- tap-to-drive or steering controls
- free-roam driving
- embedded HUD
- embedded audio
- new vehicle customization
- 3D engine migration
- additional fully authored districts beyond Harbor
- character dialogue
- math manipulatives
