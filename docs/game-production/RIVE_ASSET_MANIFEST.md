# Rive Asset Manifest

**Cursor** owns path / artboard / SM / VM / host columns.  
**Codex** owns the status columns after a `.riv` exists.  
**Astra** does not edit this table — design status lives on the master board.

Contracts live under `/docs/rive/`. This file is inventory only.

Statuses: `NEEDS_DESIGN` · `DESIGN_READY` · `RIVE_IN_PROGRESS` · `RIVE_READY` · `INTEGRATION_IN_PROGRESS` · `PREVIEW_READY` · `QA_PASS` · `BLOCKED`

---

| File | Artboard | SM | VM | Host | Contract | Status |
| --- | --- | --- | --- | --- | --- | --- |
| `/rive/world-journey.riv` | `WorldJourney` | `WorldJourneySM` | `WorldJourneyVM` | `LiveWorld` | [`WORLD_JOURNEY.md`](../rive/WORLD_JOURNEY.md) | `NEEDS_DESIGN` |
| `/rive/vehicles.riv` | (placeholder) | `bumpy` | — | `RivePlay` only | none (companion) | shipped placeholder — **do not reuse** |
| (later) coach | TBD | TBD | TBD | Coach / Help | [`COACH_CHARACTER.md`](../rive/COACH_CHARACTER.md) | closed until Harbor `QA_PASS` |
| (later) skill map | TBD | TBD | TBD | Map / Circuit | [`SKILL_MAP.md`](../rive/SKILL_MAP.md) | closed |
| (later) math interactions | TBD | TBD | TBD | `VisualMath` | [`MATH_INTERACTIONS.md`](../rive/MATH_INTERACTIONS.md) | closed |
| (later) HUD | TBD | TBD | TBD | `Shell` | [`HUD_SYSTEM.md`](../rive/HUD_SYSTEM.md) | closed — HUD stays React for Harbor |
| (later) rewards | TBD | TBD | TBD | locker / toasts | [`REWARDS.md`](../rive/REWARDS.md) | closed |
