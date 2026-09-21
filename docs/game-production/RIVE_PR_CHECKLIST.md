# Rive deliverable PR checklist

**This is how Codex hands work to Cursor.**  
Notes in `/docs` are not enough. Open a GitHub PR.

## Branch

Repo policy: `cursor/<name>-64b2`.  
World Journey deliverable: `cursor/rive-world-journey-64b2`  
(Anthony’s example name `feature/rive-world-journey` maps to that.)

## Codex puts in the PR

1. `public/rive/world-journey.riv` (never overwrite `vehicles.riv`)
2. Notes in Codex-owned files only:
   - `docs/rive/world-journey/RIVE_IMPLEMENTATION.md`
   - `docs/rive/world-journey/RIVE_VALIDATION.md`
   - `docs/rive/world-journey/ASSET_STATUS.md`
3. This checklist, filled, in the PR body

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

Cursor does **not** integrate until every box is checked or explicitly `skip` with a reason.  
Unchecked = incomplete. Cursor sends the PR back. Board stays `RIVE_IN_PROGRESS` until every box is checked, then Codex sets `RIVE_READY`.

## Cursor after review

1. Comment PASS or NEEDS CHANGES on the PR
2. If NEEDS CHANGES: write the issue in `INTEGRATION.md` / `PERFORMANCE.md` / `QA.md` and assign Codex. Do not silently edit the `.riv`.
3. If PASS: integrate `LiveWorld`, push, let Vercel build the preview, paste the URL in `DEPLOYMENT.md` and that day’s standup.
