# Glitter Merge — Data Model

## Identifiers

| Kind | Convention | Example |
| --- | --- | --- |
| Family | `snake` | `beauty` |
| Item | `{family}.{slug}` | `beauty.lip_balm` |
| Currency | `snake` | `glitter_cash` |
| Area | `snake` | `glitter_neighborhood` |
| Instance | `inst_{seq}` | `inst_14` |
| Timer | `timer_{seq}` | `timer_8` |

## Item

```ts
interface ItemDefinition {
  id: ItemId;
  familyId: FamilyId;
  tier: number;          // 1-based position in the family chain
  name: string;
  shortName: string;
  description: string;
  tags: readonly string[];
  discoverable: boolean;
  specialKind: SpecialItemKind | null; // reserved, unused in Phase 0
}
```

A family is an ordered `chain` of item ids. `catalog.nextTier(id)` is the only way the merge engine advances tiers.

## Board

```ts
interface ItemInstance { instanceId: InstanceId; itemId: ItemId }
interface BoardCell { items: readonly ItemInstance[] } // empty or same itemId
interface BoardState { width: number; height: number; cells: BoardCell[][] }
```

Stacks are a Phase 0 merge-staging model. A later one-item-per-cell presentation can still call `planMerge(itemIds)`.

Overflow that cannot fit on the board goes to `GameState.inventory`.

## Economy

```ts
interface WalletState { balances: Record<string, number> }
interface EnergyState {
  current: number;
  max: number;
  regenPerMs: number;
  lastUpdatedAt: number;
}
```

Known currencies: `glitter_cash` (soft), `glitter_gems` (premium), `energy` (pacing). Event currencies can be added as catalog data.

Operations: `grant`, `spend`, `canAfford`, `tickEnergy`, `spendEnergy`. No shop or IAP yet.

## Timers

```ts
type TimerKind = "production" | "construction" | "upgrade" | "activity" | "event";

interface TimerRecord {
  id: TimerId;
  kind: TimerKind;
  startedAt: number;
  durationMs: number;
  pausedAt: number | null;
  pausedElapsedMs: number;
  speedMultiplier: number;
  subjectId: string | null;
  completed: boolean;
}
```

Helpers exist for pause/resume, speed boosts, and instant complete (future premium skip). Only production is wired in Phase 0 (Vanity Case).

## Collection

```ts
interface CollectionState { discoveredItemIds: readonly ItemId[] }
```

Any item that appears on the board or in inventory is marked discovered. A full collection UI is later work.

## World

```ts
interface WorldState { unlockedAreaIds: readonly AreaId[] }
```

Phase 0 unlocks `glitter_neighborhood` only. Other districts are catalogued with `implemented: false`.

## Game state

```ts
interface GameState {
  schemaVersion: 1;
  createdAt: number;
  updatedAt: number;
  nextInstanceSeq: number;
  seed: number;
  board: BoardState;
  inventory: ItemInstance[];
  economy: EconomyState;
  timers: TimerState;
  generators: GeneratorInstance[];
  collection: CollectionState;
  world: WorldState;
}
```

## Save file

```ts
interface PersistedSave {
  schemaVersion: number;
  savedAt: number;
  state: GameState;
}
```

Unsupported schema versions fail closed. Add migrations in `migrate()` when the schema changes.
