# First production Rive asset — World Journey

**Status:** specification only. Do not swap this into `LiveWorld` until the `.riv` is delivered and names match this file exactly.

**Product:** Math Adventure (web-native Vite + React 19). Not Unity / Unreal.

**What this file is:** the interactive World Journey / moving vehicle — Sky Harbor courtyard camera with the locked Harbor RS driving. It replaces the JPEG pan + `/sheets/vehicle/map-rs.png` overlay inside `LiveWorld`. It does **not** replace the existing tap-to-rev companion (`/rive/vehicles.riv`, state machine `bumpy`, input `bump` used by `RivePlay`).

---

## 1. Exact names (copy these into Rive)

| Slot | Value | Notes |
| --- | --- | --- |
| Public file | `/rive/world-journey.riv` | New file. Do not overwrite `vehicles.riv`. |
| Env override | `VITE_RIVE_WORLD_SRC` | Optional later; default is the public path above. |
| Artboard | `WorldJourney` | Only artboard the React runtime will request. |
| Artboard size | `1080 × 1080` | Square. Compact layouts crop this, they do not use a second artboard. |
| State machine | `WorldJourneySM` | Default (and only) state machine on `WorldJourney`. |
| View model | `WorldJourneyVM` | Assigned as the **default** view model on the artboard. |
| Default instance | `WorldJourneyDefault` | Marked **Default** in the editor so `autoBind` can be used as a fallback. |
| Nested car artboard | `HarborRS` | Top-down Harbor RS, muted yellow, rest pose already facing the drive heading. |
| Nested map artboards | `Map_{worldId}` | Example: `Map_harbor`. See §6. |

React will hardcode these strings. Renaming in the editor will break the bind.

Runtime to target: `@rive-app/react-canvas` **4.34.2** (already in `package.json`). State-machine inputs and Rive Events are deprecated in this runtime. **View model properties and view model triggers are the contract.** The state machine exists to animate; the view model is how React talks to it.

---

## 2. What the file must look like

Locked canon from `src/engine/render/cast/canon.ts` and `src/engine/render/materials.ts`:

- Vehicle: **Harbor RS** (`harbor-rs`)
- Paint: **paint-volt**, vinyl `#c4a24a` (not chrome, not toy plastic)
- Courtyard: Sky Harbor live map. Production currently uses `/sheets/worlds/harbor.live.jpg` (the painted car already removed) plus `/sheets/vehicle/map-rs.png` as the sprite.
- The car in the courtyard **is** the Harbor RS. No SVG stand-in, no second ghost car.
- Void / letterbox: `#05070b`
- Pack navy `#0e1a3a`, bone `#f3efe6`, volt gold `#e4c24a`
- Collector window-box lives **outside** the `.riv` (`WindowBox` in React). Do not draw stamps, titles, or HUD inside the artboard.

Camera language (must match production `LiveWorld` on `main`):

- The **car stays pinned** in the viewport. The **courtyard moves** under it.
- Pin: **50% X**, **56% Y** on full square; **50% X**, **60% Y** on compact.
- Map scale: **2.08** full, **2.35** compact (the courtyard is larger than the window so the camera can pan).
- Heading: route tangent + **40°**. Today `map-rs.png` points ~11 o’clock; bake that offset into `HarborRS` rest pose so React does not send a heading number.
- Light wander (full motion only): soft ellipse around ~48%, 36% drifting ±14 / ±11. Mix soft-light, warm `rgba(255,228,170,0.18)`.
- Edge vignette: radial, transparent center, `#05070b` at ~50% on the rim.

Bake the Harbor loop into `Map_harbor` (percent of the 1080 square, same points `WORLD_ROUTES.harbor` uses today):

```
(50,80) → (50,62) → (50,40) → (64,28) → (76,44) → (70,70) → (58,82) → close
```

`progress` `0…1` walks this closed loop. Rive owns interpolation, shortest-path wrap, and heading. React only sends `progress` plus phase/surge.

---

## 3. View model — `WorldJourneyVM`

These property **names and types** are the React API. Enum values are lowercase and match `src/data/worlds.ts` / `src/types.ts`.

### 3.1 Properties React writes

| Name | Type | Values / range | Source in the app |
| --- | --- | --- | --- |
| `worldId` | enum | `harbor`, `market`, `belowzero`, `gallery`, `gearworks`, `bridge`, `boundary`, `plaza`, `courtcrate`, `arcade`, `station`, `groundlab`, `peak` | `LiveWorld` `worldId`. Fallback nested map: `Map_harbor`. |
| `phase` | enum | `idle`, `warmup`, `builder`, `lab`, `boss`, `recap` | `MotionPhase`. `LiveDay` maps store → this. |
| `surge` | enum | `none`, `correct`, `miss` | `MotionSurge`. `null` in React becomes `none`. |
| `layout` | enum | `full`, `compact` | `compact ? 'compact' : 'full'` |
| `paint` | enum | `paint-volt` | Locked. Extra paints may be added later; v1 ships one value. |
| `progress` | number | `0…1` | `sessionProgress(mission, session)`. Idle ≈ `0.06`, active capped at `0.98`, recap `1`. |
| `reducedMotion` | boolean | `false` default | `matchMedia('(prefers-reduced-motion: reduce)')` |

Default instance values (first frame before React binds):

- `worldId = harbor`
- `phase = idle`
- `surge = none`
- `layout = full`
- `paint = paint-volt`
- `progress = 0.08`
- `reducedMotion = false`

### 3.2 Triggers React fires (React → Rive)

`surge` can sit on `correct` across several items. A trigger is required so the boost clip plays on the **edge**, not the level.

| Name | When React fires it |
| --- | --- |
| `fireCorrect` | `session.lastResult` flipped to correct. Same moment `sfx.correct()` already plays. |
| `fireMiss` | `session.lastResult` flipped to miss. Same moment `sfx.miss()` already plays. |
| `resetLap` | `worldId` changed, or a new 15-minute session started. Snaps the drive onto the new `progress` without playing a surge. |

Do **not** add a tap/rev trigger on this artboard. Pointer events stay off. Tap-to-rev remains `RivePlay`.

### 3.3 Triggers Rive fires (Rive → React)

Use view-model triggers with `onTrigger` in React. **Do not** use deprecated Rive Events / `automaticallyHandleEvents`.

| Name | When the file fires it | React response |
| --- | --- | --- |
| `onReady` | First frame after bind, once the car is on the route | Clear any loading placeholder |
| `onLapComplete` | `progress` + drift wrapped through `0` | `sfx.whoosh()` if `soundOn` |
| `onParked` | Entered parked pose (recap, or reduced-motion hold) | No sound. Optional analytics later. |
| `onSurgeCorrectDone` | Boost clip finished | No sound (correct SFX already played on submit) |
| `onSurgeMissDone` | Brake clip finished | No sound |

---

## 4. State machine — `WorldJourneySM`

The view model drives listeners. Designers may also expose mirrored SM inputs with the **same names** for timeline wiring, but React will not call `useStateMachineInput`. If both exist, the view model is canonical.

### 4.1 Layers

**Layer `Drive`** (mutually exclusive)

| State | Enter when | Motion |
| --- | --- | --- |
| `Parked` | `phase == recap` **or** `reducedMotion == true` | Hold pose at `progress`. Wheels still. No camera drift. Recap without reduced-motion may keep a 1–2px rest bob; reduced-motion must not. |
| `Cruise` | default | Follow route. Add phase drift (below). Wheel rotate + light wander. |
| `Boost` | `fireCorrect` | +0.035 along the route, ease ~0.14, ~420ms. Return to `Cruise` (or `Parked` if recap). Fire `onSurgeCorrectDone`. |
| `Brake` | `fireMiss` | −0.012 along the route, ease ~0.075, ~280ms. Return to `Cruise`. Fire `onSurgeMissDone`. |

While `reducedMotion` is true, `fireCorrect` / `fireMiss` **snap** `progress` with no Boost/Brake clip.

**Layer `Layout`**

| State | Enter when | Framing |
| --- | --- | --- |
| `Full` | `layout == full` | Pin 50 / 56, scale 2.08, car visual width ~26% of the window |
| `Compact` | `layout == compact` | Pin 50 / 60, scale 2.35, car visual width ~30% of the window |

**Layer `World`**

Switch nested artboard `Map_{worldId}`. Missing map → `Map_harbor`.

**Layer `Paint`**

v1: `paint-volt` only on `HarborRS`. Keep the enum so locker paints can bind later without renaming.

### 4.2 Phase pace (Cruise drift)

Match `phasePace()` in `src/engine/motion.ts`. `drift` is added to `progress` per second. `bob` is a sine on the map (not the car pin).

| `phase` | drift / sec | bob | parked |
| --- | --- | --- | --- |
| `idle` | 0.016 | 0.85 | no |
| `warmup` | 0.020 | 1.00 | no |
| `builder` | 0.028 | 1.00 | no |
| `lab` | 0.036 | 1.10 | no |
| `boss` | 0.050 | 1.25 | no |
| `recap` | 0 | 1.35 | **yes** — hold at `max(progress, 0.92)` |

Bob: `sin(elapsed * 2.2 * bob) * (compact ? 0.28 : 0.45)` percent of the artboard. Kill bob when `reducedMotion`.

Ease toward the motion goal: `0.075` normally, `0.14` during Boost. Use shortest-path wrap on `0…1` (do not lerp across the seam).

---

## 5. Responsive behavior

React sizes the **canvas host**. The `.riv` is always 1080×1080. Crop with Rive `Layout`, not a second artboard.

| Surface | Host size today | `layout` | Rive `Fit` | Rive `Alignment` |
| --- | --- | --- | --- | --- |
| Home `LiveDay` | `aspect-square` inside `WindowBox` | `full` | `Cover` | `Center` |
| Map hero `LiveDay` | `aspect-square` | `full` | `Cover` | `Center` |
| Train HUD `LiveDay compact` | `h-52` (208px), full width of the card | `compact` | `Cover` | `BottomCenter` |
| Circuit active pit | `compact` + `className="h-44"` (176px) | `compact` | `Cover` | `BottomCenter` |
| `WorldScene` map embed | `compact={embed}` | follows `embed` | `Cover` | compact → `BottomCenter`, else `Center` |

Rules:

- `shouldResizeCanvasToContainer: true`. Follow device pixel ratio so the vinyl and courtyard do not go soft on phones.
- Host CSS stays `overflow-hidden bg-[#05070b]`. If Cover still letterboxes, the void must be `#05070b`.
- No UI, captions, or “tap to rev” inside the file.
- Safe action stays in the center 70%. Compact bottom-aligns so the car sits in the lower half of the short HUD.
- Phone-first. Square on Home/Map; short strip on Train. Do not author a landscape artboard for v1.

---

## 6. Worlds / nested maps

v1 **must** fully author `Map_harbor` (the live courtyard with the car painted out).

Include nested artboards named `Map_{id}` for every `worldId` enum value so React can pass any district without a code change. Unfinished maps may instance `Map_harbor` as a placeholder. Do not rename ids — they are the curriculum keys:

`harbor` · `market` · `belowzero` · `gallery` · `gearworks` · `bridge` · `boundary` · `plaza` · `courtcrate` · `arcade` · `station` · `groundlab` · `peak`

When a later map is authored, drop it in under the same name. React will not need a new prop.

---

## 7. Sound requirements

**No audio inside the `.riv`.** Math Adventure owns sound in `src/lib/sfx.ts`. The HUD speaker already starts district ambient. Submitting an answer already plays `sfx.correct()` / `sfx.miss()`.

| Cue | Owner | World Journey file |
| --- | --- | --- |
| District bed + motif | `startAmbient(worldId, phase)` | none |
| Mute | `soundOn` / `setMuted` | none — keep animating |
| Correct / miss | store, on submit | visual Boost/Brake only; do **not** fire SFX from `onSurge*Done` |
| Lap wrap | React on `onLapComplete` | fire the trigger only |
| Whoosh on drive-to / phase change | store (`sfx.whoosh`) | none |
| Reduced motion | n/a | still fire `onLapComplete` if a wrap happens via snapped `progress`; React may ignore it |

If `soundOn` is false, React will not call `sfx.*`. The file must not assume speakers exist.

---

## 8. Reduced-motion behavior

Mirror production `LiveWorld` (`matchMedia('(prefers-reduced-motion: reduce)')`) plus `src/index.css` and `src/lib/haptics.ts` (haptics already no-op).

When `reducedMotion === true`:

1. Jump to layer `Drive / Parked`.
2. Place the car at the current `progress` pose (correct heading). Do not add idle drift.
3. No map bob, no light wander, no wheel spin, no Boost/Brake clips.
4. `fireCorrect` / `fireMiss` may update `progress` instantly; no juice animation.
5. Recap still uses the parked pose; skip the celebration bob.
6. Keep `onReady`. Skip looping visual noise. `onParked` may fire once on enter, not every frame.

React will set the boolean on mount and on `change` of the media query. The file must not read `prefers-reduced-motion` itself (canvas cannot).

---

## 9. React API (what we will wire when the file comes back)

Keep **`LiveDay` as the store adapter**. Do not change its props. Swap the **inside** of `LiveWorld`.

### 9.1 Unchanged host contract

```ts
export function LiveWorld({
  worldId,
  phase = 'idle',
  progress = 0.08,
  surge = null,
  compact,
  className,
}: {
  worldId: string
  phase?: MotionPhase          // Phase | 'idle'
  progress?: number            // 0…1
  surge?: MotionSurge          // 'correct' | 'miss' | null
  compact?: boolean
  className?: string
}): JSX.Element

export function LiveDay({
  compact,
  className,
}: {
  compact?: boolean
  className?: string
}): JSX.Element
```

`LiveDay` today:

- `worldId` ← `worldForModule(parent.moduleId).id`
- `phase` ← idle / recap / `mission.phases[session.phaseIndex].phase`
- `progress` ← `sessionProgress(mission, session)`
- `surge` ← `lastResult.correct ? 'correct' : 'miss'` or `null`

Surfaces that must keep working: Home, Map hero, Train compact HUD, CircuitTrack active pit, `WorldScene` map sheet.

### 9.2 Constants to add (`src/engine/rive/worldJourney.ts`)

```ts
export const WORLD_JOURNEY = {
  src: '/rive/world-journey.riv',
  artboard: 'WorldJourney',
  stateMachine: 'WorldJourneySM',
  viewModel: 'WorldJourneyVM',
  instance: 'WorldJourneyDefault',
} as const

export const WORLD_JOURNEY_ENUMS = {
  worldId: [
    'harbor', 'market', 'belowzero', 'gallery', 'gearworks', 'bridge',
    'boundary', 'plaza', 'courtcrate', 'arcade', 'station', 'groundlab', 'peak',
  ],
  phase: ['idle', 'warmup', 'builder', 'lab', 'boss', 'recap'],
  surge: ['none', 'correct', 'miss'],
  layout: ['full', 'compact'],
  paint: ['paint-volt'],
} as const
```

### 9.3 `useRive` bind (implementation sketch — not shipping yet)

```ts
import {
  Alignment,
  Fit,
  Layout,
  useRive,
  useViewModel,
  useViewModelInstance,
  useViewModelInstanceBoolean,
  useViewModelInstanceEnum,
  useViewModelInstanceNumber,
  useViewModelInstanceTrigger,
} from '@rive-app/react-canvas'

const { rive, RiveComponent } = useRive({
  src: WORLD_JOURNEY.src,
  artboard: WORLD_JOURNEY.artboard,
  stateMachine: WORLD_JOURNEY.stateMachine,
  autoplay: true,
  autoBind: false,
  shouldResizeCanvasToContainer: true,
  layout: new Layout({
    fit: Fit.Cover,
    alignment: compact ? Alignment.BottomCenter : Alignment.Center,
  }),
  onRiveReady: (ready) => {
    const vm = ready.viewModelByName(WORLD_JOURNEY.viewModel)
    const instance = vm?.defaultInstance()
    if (!instance) return
    instance.enum('worldId').value = worldId
    instance.enum('phase').value = phase
    instance.enum('surge').value = surge ?? 'none'
    instance.enum('layout').value = compact ? 'compact' : 'full'
    instance.enum('paint').value = 'paint-volt'
    instance.number('progress').value = progress
    instance.boolean('reducedMotion').value = reduced
    ready.setViewModelInstance(instance)
    ready.bind()
  },
})
```

After load, property hooks write on change (`worldId`, `phase`, `progress`, `layout`, `reducedMotion`, `surge`). Trigger hooks:

- React → Rive: `fireCorrect`, `fireMiss`, `resetLap`
- Rive → React: `onReady`, `onLapComplete`, `onParked`, `onSurgeCorrectDone`, `onSurgeMissDone`

Do **not** use `useStateMachineInput`. Do **not** listen to deprecated Rive Events.

### 9.4 Fallback

Keep the current JPEG + `map-rs.png` camera behind a `RiveGate` error boundary (same pattern as `RivePlay`). If the `.riv` 404s or a name mismatches, the live drive still works.

`RivePlay` / `vehicles.riv` / env `VITE_RIVE_SRC` stay on the companion tap-to-rev control.

### 9.5 What we will not pass

- Frame-by-frame `x`, `y`, `angle` — Rive owns the route.
- `soundOn` — React already gates `sfx`.
- Pointer / tap handlers on `LiveWorld`.
- Paint other than `paint-volt` in v1.

---

## 10. Artist delivery checklist

- [ ] File named so it can be saved as `public/rive/world-journey.riv`
- [ ] Artboard `WorldJourney`, 1080×1080
- [ ] State machine `WorldJourneySM` is the artboard default
- [ ] View model `WorldJourneyVM` is the artboard default; instance `WorldJourneyDefault` marked Default
- [ ] Every property / trigger in §3 exists with **exact** spelling and enum values
- [ ] Nested `HarborRS` is the locked muted-yellow top-down car (rest pose includes the +40° map heading)
- [ ] Nested `Map_harbor` is the courtyard **without** a painted-in car
- [ ] Camera: car pinned, world pans, scales 2.08 / 2.35, pins 56% / 60%
- [ ] Phase drift and bob match the table in §4.2
- [ ] `reducedMotion` parks with no drift / bob / surge clips
- [ ] No sounds, no HUD, no tap-to-rev in the file
- [ ] First frame at default instance shows Harbor, idle, progress 0.08, car on route
- [ ] `onReady` fires once after bind

When this file is in the repo, implementation is: drop the `.riv` at `/rive/world-journey.riv`, add `src/engine/rive/worldJourney.ts`, and point `LiveWorld` at the bind in §9. Until then, production stays on the JPEG camera.
