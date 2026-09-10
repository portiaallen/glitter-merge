import {
  allBoardItemIds,
  findEmptyCells,
  getCell,
  isEmptyCell,
  moveItems,
  placeItems,
  stackItems,
} from "../board/board";
import type { Coord, ItemInstance } from "../board/types";
import { coordsEqual } from "../board/types";
import { discover } from "../collection/collection";
import { grant, tickEconomy } from "../economy/economy";
import { planMerge } from "../merge/engine";
import {
  getTimer,
  isComplete,
  restartTimer,
  tickTimers,
  upsertTimer,
} from "../timers/timers";
import { createInitialState } from "./initial";
import { spawnInstances } from "./spawn";
import {
  touch,
  type GameAction,
  type GameContext,
  type GameEvent,
  type GameState,
  type ReduceResult,
} from "./types";

function withEvents(state: GameState, events: GameEvent[]): ReduceResult {
  return { state, events };
}

function tickState(state: GameState, ctx: GameContext): GameState {
  const now = ctx.clock.now();
  let next = touch(state, now);
  next = { ...next, economy: tickEconomy(next.economy, now) };
  next = { ...next, timers: tickTimers(next.timers, now) };
  next = settleGenerators(next, ctx);
  return next;
}

function settleGenerators(state: GameState, ctx: GameContext): GameState {
  const now = ctx.clock.now();
  let timers = state.timers;
  let changed = false;
  const generators = state.generators.map((generator) => {
    const definition = ctx.catalog.getGenerator(generator.definitionId);
    if (!definition) return generator;
    const timer = getTimer(timers, generator.timerId);
    if (!timer || !isComplete(timer, now)) return generator;
    if (generator.storedCount >= definition.maxStored) {
      return generator;
    }
    const storedCount = generator.storedCount + 1;
    const shouldRestart = storedCount < definition.maxStored;
    timers = upsertTimer(
      timers,
      shouldRestart
        ? restartTimer(timer, definition.cooldownMs, ctx.clock)
        : { ...timer, completed: true },
    );
    changed = true;
    return { ...generator, storedCount };
  });
  if (!changed) return state;
  return { ...state, generators, timers };
}

function discoverFromBoard(state: GameState): GameState {
  const collection = discover(state.collection, [
    ...allBoardItemIds(state.board),
    ...state.inventory.map((item) => item.itemId),
  ]);
  if (collection === state.collection) return state;
  return { ...state, collection };
}

function placeOrInventory(
  state: GameState,
  items: readonly ItemInstance[],
  preferred: Coord | null,
): GameState {
  if (items.length === 0) return state;
  let board = state.board;
  const inventory = [...state.inventory];
  const candidates: Coord[] = [];
  const preferredCell = preferred ? getCell(board, preferred) : undefined;
  if (preferred && preferredCell && isEmptyCell(preferredCell)) {
    candidates.push(preferred);
  }
  for (const empty of findEmptyCells(board)) {
    if (preferred && coordsEqual(empty, preferred)) continue;
    candidates.push(empty);
  }

  items.forEach((item, index) => {
    const dest = candidates[index];
    if (dest) {
      board = placeItems(board, dest, [item]);
    } else {
      inventory.push(item);
    }
  });

  return { ...state, board, inventory };
}

function applyMergeCell(
  state: GameState,
  at: Coord,
  ctx: GameContext,
): ReduceResult {
  const cell = getCell(state.board, at);
  if (!cell || cell.items.length === 0) {
    return withEvents(state, [
      { kind: "merge_failed", message: "Nothing to merge here." },
    ]);
  }

  const itemIds = cell.items.map((item) => item.itemId);
  const plan = planMerge(itemIds, ctx.catalog);
  if (!plan.valid || !plan.sourceItemId) {
    return withEvents(state, [
      {
        kind: "merge_failed",
        message:
          plan.reason === "too_few"
            ? "Stack 3 of the same look to merge. Stack 5 for extra glam."
            : plan.reason === "max_tier"
              ? "This look is already couture — no higher tier."
              : "That merge is not valid.",
      },
    ]);
  }

  const leftoverItems = cell.items.slice(0, plan.leftoverCount);
  let next = { ...state, board: placeItems(state.board, at, leftoverItems) };

  const produced: ItemInstance[] = [];
  for (const stack of plan.produced) {
    const spawned = spawnInstances(next, stack.itemId, stack.count);
    next = spawned.state;
    produced.push(...spawned.instances);
  }

  const leftoverOnCell = leftoverItems.length > 0;
  next = placeOrInventory(next, produced, leftoverOnCell ? null : at);
  next = discoverFromBoard(next);
  next = touch(next, ctx.clock.now());

  const producedLabel = plan.produced
    .map((stack) => {
      const item = ctx.catalog.getItem(stack.itemId);
      return `${stack.count}× ${item?.name ?? stack.itemId}`;
    })
    .join(", ");

  const producedItemId = plan.produced[0]?.itemId;
  const producedCount = plan.produced[0]?.count;
  return withEvents(next, [
    {
      kind: "merged",
      message:
        plan.fiveMerges > 0
          ? `Fabulous five-merge! ${producedLabel}.`
          : `Merged into ${producedLabel}.`,
      ...(producedItemId !== undefined ? { itemId: producedItemId } : {}),
      ...(producedCount !== undefined ? { count: producedCount } : {}),
    },
  ]);
}

function applyDrop(
  state: GameState,
  from: Coord,
  to: Coord,
  mode: "MOVE" | "STACK",
): ReduceResult {
  const result =
    mode === "MOVE" ? moveItems(state.board, from, to) : stackItems(state.board, from, to);
  if (!result) {
    return withEvents(state, [
      { kind: "drop_failed", message: "That space cannot take this look." },
    ]);
  }
  return withEvents(
    { ...state, board: result },
    [
      {
        kind: mode === "MOVE" ? "moved" : "stacked",
        message: mode === "MOVE" ? "Moved." : "Stacked. Tap the stack to merge when ready.",
      },
    ],
  );
}

function applyCollect(
  state: GameState,
  generatorId: string,
  to: Coord | null,
  ctx: GameContext,
): ReduceResult {
  const index = state.generators.findIndex(
    (generator) =>
      generator.instanceId === generatorId || generator.definitionId === generatorId,
  );
  const generator = index >= 0 ? state.generators[index] : undefined;
  if (!generator) {
    return withEvents(state, [
      { kind: "collect_failed", message: "No generator found." },
    ]);
  }
  const definition = ctx.catalog.getGenerator(generator.definitionId);
  if (!definition || generator.storedCount <= 0) {
    return withEvents(state, [
      { kind: "collect_failed", message: "Nothing ready yet. Time is the ultimate luxury." },
    ]);
  }

  const spawned = spawnInstances(state, definition.outputItemId, 1);
  let next = spawned.state;
  const item = spawned.instances[0];
  if (!item) {
    return withEvents(state, [
      { kind: "collect_failed", message: "Could not create that item." },
    ]);
  }

  const preferred =
    to && getCell(next.board, to) && isEmptyCell(getCell(next.board, to)!)
      ? to
      : findEmptyCells(next.board)[0] ?? null;

  next = placeOrInventory(next, [item], preferred);
  const updatedGenerators = next.generators.map((entry, entryIndex) =>
    entryIndex === index ? { ...entry, storedCount: entry.storedCount - 1 } : entry,
  );
  next = { ...next, generators: updatedGenerators };

  const timer = getTimer(next.timers, generator.timerId);
  if (timer && generator.storedCount - 1 < definition.maxStored && isComplete(timer, ctx.clock.now())) {
    next = {
      ...next,
      timers: upsertTimer(
        next.timers,
        restartTimer(timer, definition.cooldownMs, ctx.clock),
      ),
    };
  }

  next = discoverFromBoard(next);
  next = touch(next, ctx.clock.now());

  return withEvents(next, [
    {
      kind: "collected",
      message: `Collected ${ctx.catalog.getItem(definition.outputItemId)?.name ?? "an item"}.`,
      itemId: definition.outputItemId,
      count: 1,
    },
  ]);
}

export function reduce(
  state: GameState,
  action: GameAction,
  ctx: GameContext,
): ReduceResult {
  const ticked = action.type === "RESET" ? state : tickState(state, ctx);

  switch (action.type) {
    case "TICK":
      return withEvents(ticked, [{ kind: "ticked", message: "Time passed." }]);
    case "MOVE":
      return applyDrop(ticked, action.from, action.to, "MOVE");
    case "STACK":
      return applyDrop(ticked, action.from, action.to, "STACK");
    case "MERGE_CELL":
      return applyMergeCell(ticked, action.at, ctx);
    case "COLLECT_GENERATOR":
      return applyCollect(ticked, action.generatorId, action.to, ctx);
    case "GRANT": {
      const granted = grant(
        ticked.economy.wallet,
        action.currencyId,
        action.amount,
        ctx.catalog,
      );
      if (!granted.ok) {
        return withEvents(ticked, [
          { kind: "granted", message: "Could not grant that currency." },
        ]);
      }
      return withEvents(
        {
          ...ticked,
          economy: { ...ticked.economy, wallet: granted.value },
        },
        [{ kind: "granted", message: `Granted ${action.amount} ${action.currencyId}.` }],
      );
    }
    case "RESET":
      return withEvents(createInitialState(ctx.catalog, ctx.clock, state.seed), [
        { kind: "reset", message: "A fresh Glitter City corner." },
      ]);
    default: {
      const _exhaustive: never = action;
      return withEvents(state, [
        { kind: "drop_failed", message: `Unhandled action: ${JSON.stringify(_exhaustive)}` },
      ]);
    }
  }
}

export function dispatchAll(
  state: GameState,
  actions: readonly GameAction[],
  ctx: GameContext,
): ReduceResult {
  let current = state;
  const events: GameEvent[] = [];
  for (const action of actions) {
    const result = reduce(current, action, ctx);
    current = result.state;
    events.push(...result.events);
  }
  return { state: current, events };
}
