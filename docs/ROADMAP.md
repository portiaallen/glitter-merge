# Glitter Merge — Build Roadmap

## Phase 0 — Foundation (this work)

- Inspect empty repository and choose a web TypeScript stack
- Game-state, item, board, economy, and timer models
- Data-driven catalog for six starter families
- Deterministic merge planner (3 / 5 / N)
- Persistence interfaces + localStorage adapter
- Documentation
- Minimal playable board shell to prove the architecture

## Phase 1 — Merge feel (recommended next)

- Tune board size, starter layout, and generator pacing
- Stronger drag ghost / drop highlights
- Merge juice (short, original motion — not copied from other games)
- Clearer 3-vs-5 teaching
- Inventory reclaim onto empty tiles
- Collection screen: discovered / undiscovered / family progress
- Energy spend on selected actions

## Phase 2 — City start

- Glitter Neighborhood map with a handful of plots
- Spend merged resources / Glitter Cash to develop one or two businesses
- Construction timers using the existing timer module
- Unlock rules that stay data-driven

## Phase 3 — Content & retention

- Additional families via data files
- Characters and story beats (luxury / queer culture — not fantasy prophecy)
- Recurring events and event currencies
- Daily cadence without overbuilding monetization

## Phase 4 — Live ops & economy

- Glitter Gem sinks that feel luxurious, not predatory
- Boosts and time skips on the existing timer API
- Account / cloud saves implementing `PersistenceAdapter`
- Analytics hooks around reducer events

## Intentionally later

Full city, all listed districts, characters, ads, VIP, social, hundreds of items/levels, complicated specials, and heavy animation.
