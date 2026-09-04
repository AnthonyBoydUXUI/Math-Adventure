# Aero · Math Adventure

Fifteen focused minutes a day for a seventh-grader who already thinks mathematically in class and needs that same mind on diagnostics, transfer, and paper.

Aero is a personal coach, a game, a visual lab, and a paper companion — not a remediation worksheet and not an answer key.

## Daily flight

- 3 min Warm-Up
- 4 min Skill Builder
- 4 min Test Lab (same math, different look)
- 3 min Boss Problem
- 1 min Recap
- Optional Keep Playing — never required

## Three tracks

1. **Classroom** — original items aligned to McGraw Hill Reveal Math Course 2 concepts (never copied pages or publisher banks)
2. **Foundation** — precision work on recommended gaps, without treating a diagnostic as a grade-level identity
3. **Next Level** — 8th grade and Algebra I ideas when mastery says go

## Run

```bash
npm install
npm test
npm run dev
```

Then open the printed local URL. On a phone-sized viewport the library covers, HUD, and 15-minute session are the core loop.

## Adventures that connect

Each Reveal module is a district (Ratio Runway, Tip Market, Balance Bridge…). Warm-ups pull a bridge skill from the previous district so the next subject is not a reset.

## Vercel

This repo is **not live on Vercel yet**. The project includes `vercel.json` and a deploy workflow, but no Hobby account has been connected from this environment (Vercel CLI is logged out; GitHub has no Vercel deployments).

Tap once to connect the GitHub repo to a free Vercel Hobby account and deploy:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/import?s=https://github.com/AnthonyBoydUXUI/Math-Adventure)

In the import screen, set the production branch to `cursor/adaptive-math-trainer-64b2` until that PR is merged into `main`. Framework: Vite. Hobby is enough (static app, no server).

After the first import, later pushes can auto-deploy. Optional GitHub secrets for the included workflow: `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`.

Tap the speaker in the app HUD to start moving world sound. Browsers block audio until a tap.

## Parent desk

Choose Reveal Math → Module → Topic. That week’s flight overweight that concept. Upload a class page photo to keep the coach pointed at the right room.

## Voice

Browser-native speech first (`BrowserVoiceProvider`). Premium voices are a `VoiceProvider` swap (`FuturePremiumVoiceProvider`) — nothing is hard-wired to a single vendor.
