# Glitter Merge — Architecture

Phase 0 separates **pure game logic** from **presentation**. The merge engine, economy, timers, and persistence are deterministic TypeScript modules with no DOM, React, or storage side effects (except explicit persistence adapters).

```
src/
  game/                 Pure logic. Testable. No UI imports.
    catalog/            Item, family, currency, generator, area lookups
    data/               Data-only definitions (add families here)
    merge/              3 / 5 / N merge planner
    board/              Grid, stacks, moves
    economy/            Wallet + energy interfaces
    timers/             Injectable-clock timers
    collection/         Discovered-item set
    world/              Unlocked areas
    state/              GameState + reducer
    persistence/        Serialize, migrate, adapters
  app/                  React shell. Imports game, never the reverse.
```

## Stack

The repository was empty except for a title README. Phase 0 establishes:

- **TypeScript** for models and rules
- **Vite + React** for a minimal mobile-first playable shell
- **Vitest** for deterministic engine tests
- **localStorage** as the first persistence adapter

No native engine, backend, or monetization SDK is introduced.

## Design rules

1. **Data-driven items.** Families and items live in `src/game/data`. Adding a family does not require merge-engine changes.
2. **Pure reducer.** All player and time mutations go through `reduce(state, action, ctx)`.
3. **Injectable clock.** Tests freeze or advance time. UI uses `systemClock`.
4. **Deterministic ids.** Instance and timer ids come from `nextInstanceSeq`, not `Math.random`.
5. **Persistence-ready.** Saves are versioned JSON (`schemaVersion: 1`) with a `migrate()` hook.
6. **Presentation isolation.** Colors, marks, and copy layout live in `src/app/presentation.ts`.

## Core types

| Concern | Entry |
| --- | --- |
| Game state | `src/game/state/types.ts` → `GameState` |
| Items / families | `src/game/catalog/types.ts` → `ItemDefinition`, `MergeFamilyDefinition` |
| Board | `src/game/board/types.ts` → `BoardState`, `BoardCell` |
| Economy | `src/game/economy/types.ts` → `WalletState`, `EnergyState` |
| Timers | `src/game/timers/types.ts` → `TimerRecord` |
| Persistence | `src/game/persistence/types.ts` → `PersistedSave` |

## Context

```ts
interface GameContext {
  catalog: ItemCatalog;
  clock: Clock;
}
```

The catalog is a read-only index built once from data. The reducer never hard-codes item names.

## Actions

| Action | Purpose |
| --- | --- |
| `TICK` | Advance energy + production timers |
| `MOVE` | Move a stack to an empty cell |
| `STACK` | Combine identical stacks |
| `MERGE_CELL` | Apply 3/5/N merge rules to a stack |
| `COLLECT_GENERATOR` | Place one stored product on the board (**1 Energy**) |
| `RECLAIM` | Move an overflow vault item onto an empty cell only |
| `GRANT` | Economy hook for later rewards |
| `RESET` | New local game |

## Persistence path

1. `serialize(state, clock)` writes `{ schemaVersion, savedAt, state }`.
2. `deserialize` validates and `migrate`s.
3. Adapters: `createMemoryPersistence` (tests) and `createLocalStoragePersistence` (shell).
4. Future cloud / account saves implement `PersistenceAdapter` without changing `GameState`.

## What stays out of the engine

Characters, city simulation, events, ads, VIP, shops, social, and special-item rules. Those get their own modules later and should call the same reducer / catalog / timer / economy interfaces.
