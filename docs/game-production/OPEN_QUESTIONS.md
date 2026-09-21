# Questions Requiring Anthony

Cursor maintains this file.  
**Only product/creative decisions that cannot be settled from existing requirements.**  
Engineering back-and-forth stays in [`DESIGN_DECISIONS.md`](./DESIGN_DECISIONS.md) (inter-agent log).  
Do not edit another person’s Question block. Add a dated comment under it.

Status: `WAITING` · `ANSWERED` · `DROPPED`

---

## Format

```
## Q-00N — <short title>

Asked by:
Astra | Codex | Cursor

Context:
...

Why this needs Anthony:
Creative-direction | Product scope | Priority

Option A:
...

Option B:
...

Team recommendation:
A | B | ...

Status:
WAITING

Anthony decision:
```

---

## Q-001 — Codex start vs Design first

Asked by:  
Cursor

Context:  
Harbor names are locked in `WORLD_JOURNEY.md`. Codex could start the `.riv` in parallel with Astra’s brief.

Why this needs Anthony:  
Production sequence.

Option A:  
Design first. Token stays with Astra until `DESIGN_READY`.

Option B:  
Codex builds to locked names now. Astra may change feel only.

Team recommendation:  
A (matches the Cursor → Astra → Codex → Cursor workflow).

Status:  
ANSWERED

Anthony decision:  
A — Cursor current-state audit → Astra design → Codex Rive → Cursor integrate. Codex waits for `DESIGN_READY`. Logged as DEC-007.

---

(No other `WAITING` questions.)
