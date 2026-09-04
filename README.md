# Aero · Math Adventure

Fifteen focused minutes a day for a seventh-grader who already thinks mathematically in class and needs that same mind on timed tests, transfer, and paper.

Aero is a personal coach, a game, a visual lab, and a paper companion — not a remediation worksheet, not an answer key, and not a medical or official school diagnosis.

## Daily flight

- 3 min Warm-Up
- 4 min Skill Builder
- 4 min Test Lab (same math, different look)
- 3 min Boss Problem
- 1 min Recap
- Optional Keep Playing — never required

## Three tracks

1. **Classroom** — original items on typical Grade 7 course topics (never copied pages or publisher banks; not an official partnership)
2. **Foundation** — precision work on recommended gaps, without treating a practice score as a grade-level identity
3. **Next Level** — 8th grade and Algebra I ideas when mastery says go

## Run

```bash
npm install
npm test
npm run dev
```

Then open the printed local URL. On a phone-sized viewport the library covers, HUD, and 15-minute session are the core loop.

The HUD clock always shows the local weekday, calendar date, current year, and time. The week strip marks practiced days. If you quit mid-session, Home says **Continue where you left off** and does not regenerate the flight. A new calendar day keeps the same topic (or advances it after a strong finish) so learning moves forward, not sideways.

## Adventures that connect

Each classroom module is a district (Ratio Runway, Tip Market, Balance Bridge…). Warm-ups pull a bridge skill from the previous district so the next subject is not a reset.

## App Store readiness

Aero is written to ship as an iOS Education app for students 12+ (not Kids Category). First launch is a parent / student-12+ gate. Privacy, Terms, and Support exist in-app and as static pages (`/privacy.html`, `/terms.html`, `/support.html`) so App Store Connect URLs work without JavaScript. Privacy Center exports or deletes the on-device save. See `APP_STORE.md` and `native/ios/README.md`.

## Vercel

This repo is **not live on Vercel yet**. The project includes `vercel.json` and a deploy workflow, but no Hobby account has been connected from this environment (Vercel CLI is logged out; GitHub has no Vercel deployments).

Tap once to connect the GitHub repo to a free Vercel Hobby account and deploy:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/import?s=https://github.com/AnthonyBoydUXUI/Math-Adventure)

In the import screen, set the production branch to `cursor/console-hud-64b2` until [PR #2](https://github.com/AnthonyBoydUXUI/Math-Adventure/pull/2) is merged into `main`. Framework: Vite. Hobby is enough (static app, no server).

After the first import, later pushes can auto-deploy. Optional GitHub secrets for the included workflow: `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`.

Tap the speaker in the app HUD to start moving world sound. Browsers block audio until a tap.

## Architecture — local first, optional cloud

Aero is a **static Vite app**. Math still runs in the browser. Optional **Supabase Auth + one `profiles` table** backs up the same JSON blob so phone, tablet, laptop, and the `/watch` glance share a save.

| What | Where it lives |
| --- | --- |
| Questions, curriculum, worlds | Bundled TypeScript (`src/data/`) |
| Adaptive session, practice feedback, scoring | Client engine (`src/engine/`) |
| XP, streak, mastery, cosmetics, parent settings | Device `localStorage` (`aero-math-adventure`) and, if signed in, `profiles.payload` |
| Voice | Browser Speech Synthesis / Speech Recognition |
| Homework photos | Stay on the device that captured them (stripped from cloud) |

**One-time setup:** run `supabase/schema.sql` in the Supabase SQL editor. Env: `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` (see `.env.example`).

Sign in under System → Account + sync. After clearing site data, sign in again to restore.

The 15-minute session is built for phone, tablet, and web. `/watch` is a glance (streak, clock, left-off, resume) for a watch-sized browser — not a full lesson on the wrist.

Test Lab writes the same attempt log. The **test-readiness** readout is derived from those plays. The cloud profile stores that log; it is not a second scoring engine.

## Parent desk

Choose this week’s Grade 7 module and topic. That week’s flight overweight that concept. Upload a class page photo (it stays on this device) to keep the coach pointed at the right room.

## Voice

Browser-native speech first (`BrowserVoiceProvider`). Premium voices are a `VoiceProvider` swap (`FuturePremiumVoiceProvider`) — nothing is hard-wired to a single vendor.
