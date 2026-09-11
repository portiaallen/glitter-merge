import type { BoardState, Coord, ItemInstance } from "../board/types";
import type { CollectionState } from "../collection/collection";
import type { EconomyState } from "../economy/types";
import type { Clock } from "../clock";
import type { ItemCatalog } from "../catalog/types";
import type { GeneratorDefId, ItemId, TimerId } from "../ids";
import type { TimerState } from "../timers/types";
import type { WorldState } from "../world/world";

export const GAME_STATE_SCHEMA_VERSION = 1;

export interface GeneratorInstance {
  readonly instanceId: string;
  readonly definitionId: GeneratorDefId;
  readonly storedCount: number;
  readonly timerId: TimerId;
}

export interface GameState {
  readonly schemaVersion: number;
  readonly createdAt: number;
  readonly updatedAt: number;
  readonly nextInstanceSeq: number;
  readonly seed: number;
  readonly board: BoardState;
  readonly inventory: readonly ItemInstance[];
  readonly economy: EconomyState;
  readonly timers: TimerState;
  readonly generators: readonly GeneratorInstance[];
  readonly collection: CollectionState;
  readonly world: WorldState;
}

export interface GameContext {
  readonly catalog: ItemCatalog;
  readonly clock: Clock;
}

export type GameAction =
  | { type: "TICK" }
  | { type: "MOVE"; from: Coord; to: Coord }
  | { type: "STACK"; from: Coord; to: Coord }
  | { type: "MERGE_CELL"; at: Coord }
  | { type: "COLLECT_GENERATOR"; generatorId: string; to: Coord | null }
  | { type: "RECLAIM"; inventoryIndex: number; to: Coord | null }
  | { type: "GRANT"; currencyId: string; amount: number }
  | { type: "RESET" };

export type GameEventKind =
  | "moved"
  | "stacked"
  | "merged"
  | "merge_failed"
  | "drop_failed"
  | "generated"
  | "collected"
  | "collect_failed"
  | "ticked"
  | "granted"
  | "reset"
  | "discovered"
  | "rewarded"
  | "energy_failed"
  | "reclaimed"
  | "reclaim_failed";

export interface GameEvent {
  readonly kind: GameEventKind;
  readonly message: string;
  readonly itemId?: ItemId;
  readonly count?: number;
  readonly fiveMerges?: number;
  readonly threeMerges?: number;
  readonly currencyId?: string;
  readonly amount?: number;
}

export interface ReduceResult {
  readonly state: GameState;
  readonly events: readonly GameEvent[];
}

export function touch(state: GameState, now: number): GameState {
  if (state.updatedAt === now) return state;
  return { ...state, updatedAt: now };
}

export function eventWith(
  kind: GameEventKind,
  message: string,
  extra: Omit<GameEvent, "kind" | "message"> = {},
): GameEvent {
  return { kind, message, ...extra };
}
