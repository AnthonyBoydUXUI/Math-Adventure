# ACCEPTANCE CRITERIA

**Who may edit:** Astra only.  
Status: `DESIGN_READY`

These are pass/fail checks for Codex and Cursor.

---

## Home — square

- Harbor RS is immediately readable as the visual anchor.
- The courtyard moves beneath the pinned vehicle.
- Important action stays inside the center safe area.
- Motion feels premium and smooth, not like a CSS sprite.
- No HUD, stamps, labels, or duplicate UI are drawn in the Rive file.
- The Harbor scene remains legible at common phone widths.

## Train — compact `h-52`

- Car remains visible and visually dominant in the lower half.
- Bottom-center composition does not crop the vehicle body.
- Route/world motion still reads clearly despite reduced height.
- Decorative environment may crop; critical vehicle/route context may not.

## Circuit active pit — `h-44`

- Vehicle remains readable at the shortest supported production crop.
- No essential visual information depends on top/bottom edges.
- Motion does not feel cramped or jittery.

## Correct lock-in

- `fireCorrect` produces one clear Boost response.
- Boost is noticeable on mobile without becoming distracting.
- Boost returns cleanly to Cruise.
- `onSurgeCorrectDone` fires once per completed Boost.

## Miss

- `fireMiss` produces a restrained Brake response.
- Miss feedback never resembles a crash or punishment.
- Brake returns cleanly to Cruise.
- `onSurgeMissDone` fires once per completed Brake.

## Recap

- Car resolves to Parked.
- Scene communicates arrival/completion through composition and settling motion.
- No embedded celebration sound or HUD appears.
- `onParked` fires once on entry.

## Reduced motion

- No drift, bob, wheel spin, light wander, Boost, or Brake clips.
- Current progress position and heading remain correct.
- Progress changes may snap without animation.
- Scene still looks intentionally composed.

## Responsive / performance

- One 1080×1080 artboard supports full and compact layouts.
- No separate mobile artboard is required.
- Fit/Cover cropping does not expose unintended empty edges.
- Visual quality remains sharp at phone DPR.
- Animation remains smooth enough for ordinary consumer mobile hardware.

## Must never happen

- No second/ghost Harbor RS.
- No painted-in car inside the Harbor map.
- No audio embedded in `.riv`.
- No tap-to-rev behavior in World Journey.
- No renaming of locked artboard, view model, state machine, properties, enum values, or triggers.
- No red punitive flash, crash, spinout, or aggressive camera shake after a miss.
- No dependency on hover for essential presentation.
