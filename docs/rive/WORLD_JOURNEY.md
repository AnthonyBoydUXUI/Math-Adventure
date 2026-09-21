# First production Rive asset — World Journey

**Authoritative technical contract.** Collaboration board: [`docs/game-production/MASTER_GAME_PLAN.md`](../game-production/MASTER_GAME_PLAN.md)

| Field | Value |
| --- | --- |
| Sprint status | `NEEDS_DESIGN` |
| Token | Astra |
| Who may change names in this file | Cursor only (or a `DEC-*`) |

**Status:** specification only. Do not swap this into `LiveWorld` until the `.riv` is delivered on a checklist-complete PR and names match this file exactly.

**Product:** Math Adventure (web-native Vite + React 19). Not Unity / Unreal.

**What this file is:** the interactive World Journey / moving vehicle — Sky Harbor courtyard camera with the locked Harbor RS driving. It replaces the JPEG pan + `/sheets/vehicle/map-rs.png` overlay inside `LiveWorld`. It does **not** replace the existing tap-to-rev companion (`/rive/vehicles.riv`, state machine `bumpy`, input `bump` used by `RivePlay`).

Working notes (must not contradict this contract):

- Astra: `world-journey/GAME_DESIGN.md`, `INTERACTION_DESIGN.md`, `ACCEPTANCE_CRITERIA.md`, `VISUAL_DIRECTION.md`
- Codex: `world-journey/RIVE_IMPLEMENTATION.md`, `RIVE_VALIDATION.md`, `ASSET_STATUS.md`
- Cursor: `world-journey/INTEGRATION.md`, `QA.md`, `PERFORMANCE.md`, `DEPLOYMENT.md`

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
| Nested map artboards | `Map_{worldId}` | Example: `Map_harbor`. |

React will hardcode these strings. Renaming in the editor will break the bind.

Runtime to target: `@rive-app/react-canvas` **4.34.2**. State-machine inputs and Rive Events are deprecated. **View model properties and view model triggers are the contract.**

---

## 2. What the file must look like

Locked canon from `src/engine/render/cast/canon.ts` and `src/engine/render/materials.ts`:

- Vehicle: **Harbor RS** (`harbor-rs`)
- Paint: **paint-volt**, vinyl `#c4a24a`
- Courtyard: `/sheets/worlds/harbor.live.jpg` language (painted car already removed) plus `/sheets/vehicle/map-rs.png` as the RS
- The car in the courtyard **is** the Harbor RS. No SVG stand-in, no second ghost car.
- Void / letterbox: `#05070b`
- Pack navy `#0e1a3a`, bone `#f3efe6`, volt gold `#e4c24a`
- Collector window-box lives **outside** the `.riv`. No stamps, titles, or HUD inside the artboard.

Camera language (production `LiveWorld` on `main`):

- The **car stays pinned**. The **courtyard moves**.
- Pin: **50% X**, **56% Y** full; **50% X**, **60% Y** compact.
- Map scale: **2.08** full, **2.35** compact.
- Heading: route tangent + **40°**. Bake into `HarborRS` rest pose.
- Light wander (full motion only): soft ellipse ~48%, 36% ±14 / ±11, warm `rgba(255,228,170,0.18)`.
- Edge vignette: `#05070b` at the rim.

Harbor loop (`WORLD_ROUTES.harbor`):

```
(50,80) → (50,62) → (50,40) → (64,28) → (76,44) → (70,70) → (58,82) → close
```

`progress` `0…1` walks this loop. Rive owns interpolation, wrap, and heading.

---

## 3. View model — `WorldJourneyVM`

### 3.1 Properties React writes

| Name | Type | Values / range | Source |
| --- | --- | --- | --- |
| `worldId` | enum | `harbor`, `market`, `belowzero`, `gallery`, `gearworks`, `bridge`, `boundary`, `plaza`, `courtcrate`, `arcade`, `station`, `groundlab`, `peak` | `LiveWorld` `worldId`. Missing map → `Map_harbor`. |
| `phase` | enum | `idle`, `warmup`, `builder`, `lab`, `boss`, `recap` | `MotionPhase` |
| `surge` | enum | `none`, `correct`, `miss` | `null` → `none` |
| `layout` | enum | `full`, `compact` | `compact ? 'compact' : 'full'` |
| `paint` | enum | `paint-volt` | Locked |
| `progress` | number | `0…1` | `sessionProgress` |
| `reducedMotion` | boolean | | `prefers-reduced-motion` |

Defaults: harbor, idle, none, full, paint-volt, progress `0.08`, reducedMotion false.

### 3.2 Triggers React → Rive

| Name | When |
| --- | --- |
| `fireCorrect` | lastResult flipped correct |
| `fireMiss` | lastResult flipped miss |
| `resetLap` | `worldId` change or new session |

No tap/rev trigger.

### 3.3 Triggers Rive → React

| Name | When | React |
| --- | --- | --- |
| `onReady` | First bound frame | Clear placeholder |
| `onLapComplete` | Wrap through 0 | `sfx.whoosh()` if `soundOn` |
| `onParked` | Recap or reduced-motion hold | No sound |
| `onSurgeCorrectDone` | Boost finished | No sound |
| `onSurgeMissDone` | Brake finished | No sound |

---

## 4. State machine — `WorldJourneySM`

**Drive:** `Parked` (recap or reducedMotion) · `Cruise` · `Boost` (`fireCorrect`, +0.035, ease 0.14, ~420ms) · `Brake` (`fireMiss`, −0.012, ease 0.075, ~280ms)

While `reducedMotion`, surges **snap** with no clips.

**Layout:** `Full` 50/56 · 2.08 · car ~26% · `Compact` 50/60 · 2.35 · car ~30%

**World:** `Map_{worldId}` · missing → `Map_harbor`

**Paint:** `paint-volt` only in v1

Phase drift / sec (`phasePace`): idle 0.016, warmup 0.020, builder 0.028, lab 0.036, boss 0.050, recap parked at `max(progress, 0.92)`.

Bob: `sin(elapsed * 2.2 * bob) * (compact ? 0.28 : 0.45)` percent. Kill when reduced motion.

Ease: 0.075 normally, 0.14 during Boost. Shortest-path wrap on `0…1`.

---

## 5. Responsive behavior

One 1080×1080 artboard. React sizes the host. `Fit.Cover`.

| Surface | Host | `layout` | Alignment |
| --- | --- | --- | --- |
| Home / Map `LiveDay` | `aspect-square` | `full` | `Center` |
| Train `LiveDay compact` | `h-52` | `compact` | `BottomCenter` |
| Circuit pit | `h-44` | `compact` | `BottomCenter` |
| `WorldScene` embed | `compact={embed}` | follows | compact → `BottomCenter` |

`shouldResizeCanvasToContainer: true`. Device pixel ratio on. Void `#05070b`. No UI in the file.

---

## 6. Worlds

v1 must author `Map_harbor`. Other `worldId` values need a nested artboard name; unfinished maps may instance Harbor.

---

## 7. Sound

**No audio inside the `.riv`.** App owns `startAmbient` and `sfx.*`. Do not replay correct/miss from `onSurge*Done`.

---

## 8. Reduced motion

React sets `reducedMotion` from `matchMedia`. File: park, correct heading, no drift/bob/light/wheels/Boost/Brake. Canvas cannot read the media query.

---

## 9. React API (later integration — not this PR)

Keep `LiveDay` as the store adapter. Same props. Swap inside `LiveWorld`.

```ts
export const WORLD_JOURNEY = {
  src: '/rive/world-journey.riv',
  artboard: 'WorldJourney',
  stateMachine: 'WorldJourneySM',
  viewModel: 'WorldJourneyVM',
  instance: 'WorldJourneyDefault',
} as const
```

`useRive` + view-model hooks. Bind in `onRiveReady` before the first frame. Fallback: current JPEG camera behind `RiveGate`. Do not pass frame-by-frame `x/y/angle`.

---

## 10. Codex delivery checklist

Copy into the `.riv` PR body ([`RIVE_PR_CHECKLIST.md`](../game-production/RIVE_PR_CHECKLIST.md)):

- [ ] Rive contract matches spec
- [ ] View Model names validated
- [ ] State Machine validated
- [ ] reduced-motion tested
- [ ] phone framing tested
- [ ] tablet tested
- [ ] desktop tested
- [ ] no duplicated audio
- [ ] exported `.riv` committed to `public/rive/world-journey.riv`
