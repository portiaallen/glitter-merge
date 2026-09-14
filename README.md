# Glitter Merge

A mobile-first merge game and luxury LGBTQ+ world-building experience.

**GAY. RICH. LUX. FABULOUS.**

> Build the most fabulous LGBTQ+ luxury destination imaginable.

This repository is in **Phase 0**: architecture, data models, and a minimal playable board shell. It is inspired by the progression patterns of successful merge games, not by their characters, art, story, or UI.

## Play the shell

```bash
npm install
npm test
npm run dev
```

Open the local Vite URL on a phone-width viewport. Stack three matching looks to merge. Stack five for a bonus. Collect from the Vanity Case when it is ready.

## Project map

| Path | Role |
| --- | --- |
| `src/game/` | Pure, testable game logic |
| `src/game/data/` | Families, currencies, generators, areas |
| `src/app/` | Minimal React presentation shell |
| `docs/GAME_DESIGN.md` | Creative direction and rules |
| `docs/ARCHITECTURE.md` | Engine / UI split |
| `docs/DATA_MODEL.md` | State and catalog shapes |
| `docs/ROADMAP.md` | What is next — and what is not |

## Scripts

| Command | Purpose |
| --- | --- |
| `npm test` | Deterministic engine tests |
| `npm run dev` | Local playable shell |
| `npm run build` | Typecheck + production bundle |

## Phase 0 boundaries

Not built yet: the full city, characters, monetization, ads, VIP, events, social, hundreds of items/levels, or complicated specials.

Adding a merge family is a data change in `src/game/data/families.ts`. Do not hard-code items into the merge engine.
