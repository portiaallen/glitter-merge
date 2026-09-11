/**
 * Public game-logic API. Presentation code should import from here
 * (or from the specific module) and never invert that dependency.
 */

export { systemClock, fixedClock, controllableClock } from "./clock";
export type { Clock, ControllableClock } from "./clock";

export { defaultCatalog } from "./catalog/defaultCatalog";
export { createCatalog } from "./catalog/createCatalog";
export type {
  AreaDefinition,
  CurrencyDefinition,
  GeneratorDefinition,
  ItemCatalog,
  ItemDefinition,
  MergeFamilyDefinition,
} from "./catalog/types";

export { ITEM_IDS } from "./data/families";
export { CURRENCY_IDS } from "./data/currencies";
export { GENERATOR_IDS } from "./data/generators";
export { AREA_IDS } from "./data/areas";

export { planMerge, planMergeCount, canMerge } from "./merge/engine";
export { previewStack } from "./merge/preview";
export type { MergePreview } from "./merge/preview";
export {
  MIN_MERGE_COUNT,
  BONUS_MERGE_COUNT,
  EMPTY_MERGE_PLAN,
} from "./merge/types";
export type { MergePlan, MergeRejectReason, ProducedStack } from "./merge/types";

export {
  createEmptyBoard,
  getCell,
  findEmptyCells,
  inBounds,
  isEmptyCell,
  cellItemId,
} from "./board/board";
export {
  describeDrop,
  matchingCoords,
  mergeCoach,
  stackCountAt,
  itemIdAt,
  potentialMatchCount,
} from "./board/intent";
export type { DropKind, CoachHint, CoachTone } from "./board/intent";
export type { BoardState, BoardCell, Coord, ItemInstance } from "./board/types";
export { coordsEqual } from "./board/types";

export { grant, spend, canAfford, tickEnergy, spendEnergy } from "./economy/economy";
export { COLLECT_ENERGY_COST } from "./economy/costs";
export { mergeCashReward } from "./economy/rewards";
export type { EconomyState, WalletState, EnergyState } from "./economy/types";
export { walletBalance } from "./economy/types";

export {
  createTimer,
  remainingMs,
  isComplete,
  progress01,
  pauseTimer,
  resumeTimer,
  applySpeed,
  completeTimer,
} from "./timers/timers";
export type { TimerRecord, TimerState, TimerKind } from "./timers/types";

export { createInitialState } from "./state/initial";
export { reduce, dispatchAll } from "./state/reducer";
export { GAME_STATE_SCHEMA_VERSION } from "./state/types";
export type {
  GameAction,
  GameContext,
  GameEvent,
  GameState,
  ReduceResult,
  GeneratorInstance,
} from "./state/types";

export { serialize, deserialize, migrate } from "./persistence/serialize";
export { createMemoryPersistence } from "./persistence/memory";
export {
  createLocalStoragePersistence,
  browserStorage,
} from "./persistence/localStorage";
export { SAVE_KEY } from "./persistence/types";
export type { PersistenceAdapter, PersistedSave } from "./persistence/types";

export { isDiscovered } from "./collection/collection";
export { familyProgress } from "./collection/progress";
export type { CollectionState } from "./collection/collection";
export type { FamilyProgress, FamilyProgressEntry } from "./collection/progress";
export { isAreaUnlocked } from "./world/world";
