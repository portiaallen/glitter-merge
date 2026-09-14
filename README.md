# Glitter Merge

A mobile-first merge game and luxury LGBTQ+ world-building experience.

**GAY. RICH. LUX. FABULOUS.**

> Build the most fabulous LGBTQ+ luxury destination imaginable.

Glitter Merge is **our** version of a Fairyland-style merge destination: you merge on a living city block, discoveries dress the neighborhood, and the long game is building the most fabulous LGBTQ+ luxury destination imaginable.

It takes that genre's structure (merge-in-world, 3-and-5, energy harvest, quests, a place that grows). It does **not** take fairies, fog-kingdoms, or anyone else's art.

This repository is a playable destination prototype on the Phase 0 engine.

## Play the shell

```bash
npm install
npm test
npm run dev
```

Open the local Vite URL on a phone-width viewport.

- Tap a look to see matching destinations, then tap a match to stack.
- Drag works too: valid tiles glow, invalid tiles say "Can't."
- Stack **3** to merge, or keep going to **5** for a bonus (two upgrades).
- Collect from the Vanity Case for **1 Energy**. Energy regenerates.
- Open **Looks** to browse the collection. Undiscovered tiers stay locked.

## Project map

| Path | Role |
| --- | --- |
| `src/game/` | Pure, testable game logic |
| `src/game/data/` | Families, currencies, generators, areas |
| `src/app/` | Mobile-first presentation shell |
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

## Not built yet

Full city, characters, monetization, ads, VIP, events, social, hundreds of items/levels, or complicated specials.

Adding a merge family is a data change in `src/game/data/families.ts`. Do not hard-code items into the merge engine.
