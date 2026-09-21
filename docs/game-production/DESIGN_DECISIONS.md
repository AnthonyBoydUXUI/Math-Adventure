# Decision log

All three agents may **add** an entry.  
Nobody silently changes another role’s specification.  
Anthony **locks** product/creative `DEC-*` lines.  
Questions that need Anthony go in [`OPEN_QUESTIONS.md`](./OPEN_QUESTIONS.md), not here.

| Marker | Meaning |
| --- | --- |
| `PROPOSED` | Logged; not locked |
| `LOCKED` | Binding |
| `SUPERSEDED` | Replaced by a later `DEC-*` |
| `OPEN` / `ANSWERED` | Inter-agent questions only |

---

## Locked

### DEC-001 — Web-native Rive

Status: `LOCKED`  
Call: World Journey ships as a web `.riv` in this Vite app. No Unity / Unreal / Godot.

### DEC-002 — Harbor RS is the car

Status: `LOCKED`  
Call: Locked Harbor RS (`harbor-rs`, `paint-volt`). No SVG stand-in, no second ghost car.

### DEC-003 — New file, not tap-to-rev

Status: `LOCKED`  
Call: `/rive/world-journey.riv`. Do not overwrite `/rive/vehicles.riv`.

### DEC-004 — App owns sound

Status: `LOCKED`  
Call: No audio inside the `.riv`.

### DEC-005 — View model is the React API

Status: `LOCKED`  
Call: `@rive-app/react-canvas` 4.34.2 + `WorldJourneyVM`. No `useStateMachineInput`, no deprecated Rive Events.

### DEC-006 — Signal and Harbor RS stay locked

Status: `LOCKED`  
Call: Player = Signal. Vehicle = Harbor RS, muted yellow. Collector look.

### DEC-007 — Sequence

Status: `LOCKED` (Anthony, 2026-09-21)  
Call: Cursor audit → Astra design → Codex Rive → Cursor integrate → PR → Vercel → QA → merge.  
Codex does not start the `.riv` until the board is `DESIGN_READY`.

---

## Inter-agent questions

Not for Anthony unless escalated to `OPEN_QUESTIONS.md`.

### Template

```
### IQ-00N — <title>
From: Astra | Codex | Cursor
To: Astra | Codex | Cursor
Status: OPEN
ENGINEERING QUESTION:   (Codex → Astra when the brief is not buildable)
Issue:
Why I am not changing your spec:
Options:
Reply:
```

(none open)
