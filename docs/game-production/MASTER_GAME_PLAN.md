# Math Adventure — Game Production Master

**Maintained by:** Cursor (Senior Engineer).  
**This file is the operating system.** It does not replace `/docs/rive/*` contracts.  
**Production app behavior is unchanged.** No `LiveWorld` swap until a later PR.

Folder: https://github.com/AnthonyBoydUXUI/Math-Adventure/tree/cursor/world-journey-rive-spec-64b2/docs/game-production  
PR: https://github.com/AnthonyBoydUXUI/Math-Adventure/pull/13

---

## Product goal

Interactive 15-minute-a-day math training that improves diagnostic/test performance, confidence, visual learning, written process, and long-term mastery — without leaving the existing Vite app, design system, learning engine, accessibility, GitHub, or Vercel path.

**Who may change this paragraph:** Anthony.

---

## Roles

### Astra — Game Director / Game Designer

Owns experience design, game feel, interaction design, spatial design, motion intent, touch behavior, world behavior, visual direction, and acceptance criteria.

Writes only in Astra-owned design files. Does not rename locked Rive/React strings. Does not edit Codex notes or Cursor integration notes.

### Codex — Gameplay / Rive Engineer

Owns Rive Editor/CLI implementation, artboards, components, state machines, view models, scripting, animation, triggers, responsive Rive behavior, reduced motion, and `.riv` production assets.

Writes only in Codex-owned files. Delivers `.riv` files on a GitHub PR. Does not silently redesign Astra’s brief. If the brief is technically problematic, files an **ENGINEERING QUESTION** (see below) and stops.

### Cursor — Senior Engineer

Owns repository architecture, current-app analysis, deciding Rive vs React/Three.js, contract validation, React integration, accessibility, performance, GitHub PRs, testing, and Vercel.

Writes only in Cursor-owned files. Does not guess whether a `.riv` is complete — Codex’s PR checklist must be filled. If an asset will hurt mobile performance or break the contract, Cursor records the issue and sends the PR back. Does not silently edit the `.riv`.

### Anthony — Product Owner / Creative Director

Resolves product/creative decisions that cannot be determined from existing requirements. Reads **only** [`OPEN_QUESTIONS.md`](./OPEN_QUESTIONS.md) for those. Does not need to follow engineering chatter.

---

## Workflow

```
CURRENT APP
    ↓
CURSOR
  current-state audit
  what exists / what should use Rive vs React
  locked names + contract in /docs/rive
    ↓
ASTRA
  design the improved experience
  (must not start until Cursor’s audit is in this file)
    ↓
CODEX
  build that in Rive
  open a deliverable PR with checklist + .riv
    ↓
CURSOR
  validate / integrate (only if checklist is complete)
    ↓
GitHub PR → Vercel Preview → QA → merge
```

One asset at a time. Nobody edits another role’s specification. Disagree with a question, not a silent rewrite.

**These docs coordinate. They do not schedule agents.** A 7:00–15:00 window is the production day, not a promise that Astra, Codex, and Cursor run themselves. Each environment still needs its own execution hook that reads latest GitHub and does its lane.

---

## Status markers

Use these exact strings on the board and in the manifest.

| Status | Meaning | Next |
| --- | --- | --- |
| `NEEDS_DESIGN` | Cursor audit/contract is in. Astra has not signed design. | Astra |
| `DESIGN_READY` | Astra finished. Codex may start the `.riv`. | Codex |
| `RIVE_IN_PROGRESS` | Codex is building. | Codex |
| `RIVE_READY` | Codex PR checklist complete. Cursor may review. | Cursor |
| `INTEGRATION_IN_PROGRESS` | Cursor is wiring React. | Cursor |
| `PREVIEW_READY` | Vercel preview URL posted. | QA |
| `QA_PASS` | Phone / tablet / desktop / a11y / reduced-motion pass. | merge |
| `BLOCKED` | Waiting on a question. If it needs Anthony, it is in `OPEN_QUESTIONS.md`. | named owner |

---

## Production window (local)

Treat as a day shape, not an eight-hour autonomous run.

| Time | Beat |
| --- | --- |
| 07:00 | Sprint begins — read board + standup |
| 07:15 | Design / engineering sync (status only) |
| 07:30–12:00 | Production in owned files / PRs |
| 12:00 | Midday integration checkpoint |
| 12:30–14:30 | Implementation + QA |
| 14:30 | Vercel preview review |
| 15:00 | Standup + **hard stop** |

Nothing after 15:00.

---

## Questions and decisions (async)

**Do not silently change another role’s spec.**

| Kind | Where | Who writes | Who answers |
| --- | --- | --- | --- |
| Product / creative call | [`OPEN_QUESTIONS.md`](./OPEN_QUESTIONS.md) **only** | Any agent | Anthony |
| ENGINEERING QUESTION (brief not buildable) | [`DESIGN_DECISIONS.md`](./DESIGN_DECISIONS.md) inter-agent log | Codex | Astra (or Anthony if it becomes product) |
| Integration / performance send-back | same log | Cursor | Codex |
| Design clarification for Cursor | same log | Astra | Cursor |
| Locked product call | [`DESIGN_DECISIONS.md`](./DESIGN_DECISIONS.md) `DEC-*` | Anthony (lock) · others may propose | — |

Inter-agent template (not for Anthony):

```
### IQ-00N — <title>
From: Astra | Codex | Cursor
To: Astra | Codex | Cursor
Status: OPEN | ANSWERED
ENGINEERING QUESTION:   (Codex only, when used)
Issue:
Why I am not changing your spec:
Options:
Reply:
```

---

## Deliverables live on GitHub PRs

Docs are the board. Assets ship on PRs.

World Journey `.riv` branch: `cursor/rive-world-journey-64b2`  
Checklist Codex must paste: [`RIVE_PR_CHECKLIST.md`](./RIVE_PR_CHECKLIST.md)

```
[ ] Rive contract matches spec
[ ] View Model names validated
[ ] State Machine validated
[ ] reduced-motion tested
[ ] phone framing tested
[ ] tablet tested
[ ] desktop tested
[ ] no duplicated audio
[ ] exported .riv committed
```

Unchecked = not complete. Cursor does not integrate.

---

## Current-state audit (Cursor) — before any Rive work

Authoritative contract: [`docs/rive/WORLD_JOURNEY.md`](../rive/WORLD_JOURNEY.md)

### What the app already does

| Surface | Implementation today | Keep? |
| --- | --- | --- |
| Home / Map hero | `LiveDay` → `LiveWorld`: JPEG courtyard pans under pinned `/sheets/vehicle/map-rs.png` | Visual to be replaced by `.riv`; **props stay** |
| Train HUD | `LiveDay compact` (`h-52`) | Same |
| Circuit active pit | `LiveWorld` compact + `h-44` | Same |
| `WorldScene` map | `LiveWorld` | Same |
| Tap-to-rev companion | `RivePlay` + `/rive/vehicles.riv` (`bumpy` / `bump`) | **Keep. Not this sprint.** |
| Motion math | `src/engine/motion.ts` — phase drift, surge, routes, camera frame | React still owns `progress` / `phase` / `surge`; Rive owns the picture |
| Sound | `src/lib/sfx.ts` ambient + one-shots | **Keep in app. No audio in `.riv`.** |
| Reduced motion | `LiveWorld` parks; CSS + haptics no-op | React sets `reducedMotion`; Rive parks |
| HUD | `Shell` chips (readiness, streak, mute, sparks) | **Stay React. Not in the `.riv`.** |
| Coach / homework | Help page, `SchoolWeekDesk`, tiny steps | Later asset. Not Harbor. |
| Math visuals | SVG `VisualMath` | Later asset. Not Harbor. |
| Rewards | sparks, stars, locker cosmetics | Later asset. Not Harbor. |
| Cast | Signal + Harbor RS `paint-volt` locked | Must match |

Rive vs stay-in-React for **this** sprint:

- **Rive:** courtyard + Harbor RS + camera + phase/surge motion (one file: `world-journey.riv`)
- **React:** session, scoring, HUD, sound, WindowBox, routing, fallback JPEG if the `.riv` fails
- **Three.js:** not used for this drive (existing 3D cast pipeline stays out of the journey)

### What Astra needs to design

Using the locked names in `WORLD_JOURNEY.md` (do not rename):

- Game feel of Cruise / Boost / Brake / Parked
- Spatial read of the pinned car vs moving courtyard
- Boss / recap / idle intent (daylight Harbor is the current production look)
- Compact vs full crop priority (what must stay on screen at `h-52` / `h-44`)
- Acceptance criteria Cursor and Codex can pass/fail
- Visual direction that stays collector Harbor RS, not a new car

Write in:

- `docs/rive/world-journey/GAME_DESIGN.md`
- `docs/rive/world-journey/INTERACTION_DESIGN.md`
- `docs/rive/world-journey/ACCEPTANCE_CRITERIA.md`
- `docs/rive/world-journey/VISUAL_DIRECTION.md`

Then set this board to `DESIGN_READY`.

### What Codex needs to produce

Only after `DESIGN_READY`:

- `public/rive/world-journey.riv` on PR `cursor/rive-world-journey-64b2`
- Artboard `WorldJourney`, SM `WorldJourneySM`, VM `WorldJourneyVM`
- Nested `HarborRS` + `Map_harbor` (other `Map_*` may instance Harbor)
- View-model properties/triggers exactly as in the contract
- Reduced-motion park, no embedded audio
- Filled validation + PR checklist

Do not overwrite `vehicles.riv`.

---

## Active sprint

| Field | Value |
| --- | --- |
| Asset | World Journey — Harbor |
| Contract | [`docs/rive/WORLD_JOURNEY.md`](../rive/WORLD_JOURNEY.md) |
| Status | `DESIGN_READY` |
| Token | Codex |
| Vercel preview | none (docs-only PR) |
| Merge | not requested — board + contract only |

Later Rive slots (`COACH_CHARACTER`, `SKILL_MAP`, `MATH_INTERACTIONS`, `HUD_SYSTEM`, `REWARDS`) stay closed until Harbor is `QA_PASS`.

---

## Next

| Who | Do | Do not |
| --- | --- | --- |
| Astra | Design Harbor against the contract | Rename inputs; start Codex’s file |
| Codex | Wait for `DESIGN_READY` | Start `.riv` from names alone; overwrite `vehicles.riv` |
| Cursor | Wait for `RIVE_READY` + complete checklist | Integrate incomplete assets; change production this PR |
| Anthony | Answer `OPEN_QUESTIONS.md` if a `Q-*` is `WAITING` | Read Codex/Cursor chatter unless escalated |
