# INTERACTION DESIGN

**Who may edit:** Astra only.  
Status: `DESIGN_READY`

Names and triggers are locked in [`../WORLD_JOURNEY.md`](../WORLD_JOURNEY.md).

---

## Touch

World Journey itself remains non-interactive in v1. Do not add steering, tapping, dragging, or rev gestures to this artboard.

Touch belongs to the surrounding React learning UI. The journey should react to learning state, not compete for input.

## Spatial behavior

The **Harbor RS stays pinned** while the courtyard moves beneath it.

This should create the perception of driving through the world while preserving:
- visual stability
- mobile readability
- consistent crop behavior
- low cognitive load

The car is the visual anchor. The environment provides motion.

Use layered spatial cues where practical:
- background drift
- route motion
- subtle foreground/parallax differences
- controlled light movement
- wheel rotation

No excessive camera shake.

## Correct-answer behavior — `fireCorrect` / Boost

On trigger:
1. immediate acceleration cue
2. brief forward route gain
3. slight increase in wheel/environment velocity
4. optional restrained light sweep or highlight response
5. smooth return to Cruise

Target feel: responsive, confident, approximately one short beat.

Do not:
- flash the whole screen
- obscure the car
- use aggressive particles
- create a long celebration

## Miss behavior — `fireMiss` / Brake

On trigger:
1. subtle deceleration
2. small backward route correction per locked contract
3. brief wheel/environment slowdown
4. clean return to Cruise

No violent shake, spinout, collision, or “failure” spectacle.

## Boss behavior — `phase = boss`

Boss is the highest-energy state but must remain readable.

Increase:
- route pace
- environmental parallax
- wheel speed
- light energy

Keep:
- pinned car
- stable framing
- accessible contrast
- no flicker
- no unnecessary effects

The player should feel “locked in,” not overwhelmed.

## Idle / warmup / recap

### Idle
Slow ambient drift; car ready.

### Warmup
Gentle acceleration into session rhythm.

### Recap
Park at `max(progress, 0.92)`. Let the scene settle into a composed end pose.

If full motion is allowed, recap may retain only the contract-approved minimal rest behavior.

## Reduced motion

When `reducedMotion = true`:
- Parked immediately
- no wheel spin
- no bob
- no light wander
- no Boost/Brake animation
- preserve correct position and heading
- progress changes snap rather than animate

Reduced motion must still look intentional, not broken.

## Sound

No sound is embedded in the `.riv`.

Desired app-owned sound relationship:
- correct: existing correct cue at submit
- miss: existing miss cue at submit
- lap complete: optional whoosh if sound is enabled
- ambient: existing world/phase system

Do not duplicate any cue from Rive.
