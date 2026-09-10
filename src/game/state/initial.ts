import { createEmptyBoard, placeItems } from "../board/board";
import type { BoardState } from "../board/types";
import type { Clock } from "../clock";
import type { ItemCatalog } from "../catalog/types";
import { discover, emptyCollection } from "../collection/collection";
import { CURRENCY_IDS } from "../data/currencies";
import { ITEM_IDS } from "../data/families";
import { GENERATOR_IDS } from "../data/generators";
import { instanceId, timerId } from "../ids";
import { createTimer, upsertTimer } from "../timers/timers";
import { emptyTimerState } from "../timers/types";
import { createStartingWorld } from "../world/world";
import {
  GAME_STATE_SCHEMA_VERSION,
  type GameState,
  type GeneratorInstance,
} from "./types";

export const DEFAULT_BOARD_WIDTH = 6;
export const DEFAULT_BOARD_HEIGHT = 7;

const STARTER_PLACEMENTS: ReadonlyArray<{
  row: number;
  col: number;
  itemId: string;
}> = [
  { row: 2, col: 1, itemId: ITEM_IDS.lipBalm },
  { row: 2, col: 2, itemId: ITEM_IDS.lipBalm },
  { row: 3, col: 2, itemId: ITEM_IDS.lipBalm },
  { row: 3, col: 3, itemId: ITEM_IDS.lipBalm },
  { row: 4, col: 1, itemId: ITEM_IDS.basicShirt },
  { row: 4, col: 2, itemId: ITEM_IDS.basicShirt },
  { row: 5, col: 3, itemId: ITEM_IDS.beads },
];

function seedBoard(
  catalog: ItemCatalog,
): { board: BoardState; nextSeq: number; discovered: string[] } {
  let board = createEmptyBoard(DEFAULT_BOARD_WIDTH, DEFAULT_BOARD_HEIGHT);
  let seq = 1;
  const discovered: string[] = [];

  for (const placement of STARTER_PLACEMENTS) {
    if (!catalog.getItem(placement.itemId)) continue;
    const instance = { instanceId: instanceId(seq), itemId: placement.itemId };
    seq += 1;
    board = placeItems(board, { row: placement.row, col: placement.col }, [
      instance,
    ]);
    discovered.push(placement.itemId);
  }

  return { board, nextSeq: seq, discovered };
}

export function createInitialState(
  catalog: ItemCatalog,
  clock: Clock,
  seed = 1,
): GameState {
  const now = clock.now();
  const { board, nextSeq, discovered } = seedBoard(catalog);

  const vanity = catalog.getGenerator(GENERATOR_IDS.vanityCase);
  let timers = emptyTimerState();
  const generators: GeneratorInstance[] = [];
  let seq = nextSeq;

  if (vanity) {
    const genTimer = createTimer(
      {
        id: timerId(seq),
        kind: "production",
        durationMs: vanity.cooldownMs,
        subjectId: GENERATOR_IDS.vanityCase,
      },
      clock,
    );
    seq += 1;
    timers = upsertTimer(timers, genTimer);
    generators.push({
      instanceId: `gen_${GENERATOR_IDS.vanityCase}`,
      definitionId: vanity.id,
      storedCount: 1,
      timerId: genTimer.id,
    });
  }

  const draft: GameState = {
    schemaVersion: GAME_STATE_SCHEMA_VERSION,
    createdAt: now,
    updatedAt: now,
    nextInstanceSeq: seq,
    seed,
    board,
    inventory: [],
    economy: {
      wallet: {
        balances: {
          [CURRENCY_IDS.glitterCash]: 250,
          [CURRENCY_IDS.glitterGems]: 12,
        },
      },
      energy: {
        current: 25,
        max: 25,
        regenPerMs: 1 / 60_000,
        lastUpdatedAt: now,
      },
    },
    timers,
    generators,
    collection: discover(emptyCollection(), discovered),
    world: createStartingWorld(),
  };

  return draft;
}
