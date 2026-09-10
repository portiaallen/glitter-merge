import { describe, expect, it } from "vitest";
import { getCell, placeItems } from "../board/board";
import { defaultCatalog } from "../catalog/defaultCatalog";
import { controllableClock } from "../clock";
import { CURRENCY_IDS } from "../data/currencies";
import { ITEM_IDS } from "../data/families";
import { GENERATOR_IDS } from "../data/generators";
import { createInitialState } from "./initial";
import { dispatchAll, reduce } from "./reducer";
import type { GameContext } from "./types";

function ctxAt(at = 0): GameContext {
  return { catalog: defaultCatalog, clock: controllableClock(at) };
}

describe("reduce", () => {
  it("seeds a playable Glitter Neighborhood board", () => {
    const state = createInitialState(defaultCatalog, controllableClock(0));
    expect(state.world.unlockedAreaIds).toEqual(["glitter_neighborhood"]);
    expect(state.economy.wallet.balances[CURRENCY_IDS.glitterCash]).toBe(250);
    expect(state.generators[0]?.definitionId).toBe(GENERATOR_IDS.vanityCase);
    expect(state.collection.discoveredItemIds).toContain(ITEM_IDS.lipBalm);
  });

  it("stacks matching items and merges three into the next tier", () => {
    const ctx = ctxAt();
    const state = createInitialState(defaultCatalog, ctx.clock);
    const stacked = dispatchAll(
      state,
      [
        { type: "STACK", from: { row: 2, col: 1 }, to: { row: 2, col: 2 } },
        { type: "STACK", from: { row: 3, col: 2 }, to: { row: 2, col: 2 } },
        { type: "MERGE_CELL", at: { row: 2, col: 2 } },
      ],
      ctx,
    );
    expect(stacked.events.some((event) => event.kind === "merged")).toBe(true);
    const cell = getCell(stacked.state.board, { row: 2, col: 2 });
    expect(cell?.items.map((item) => item.itemId)).toEqual([ITEM_IDS.lipGloss]);
    expect(stacked.state.collection.discoveredItemIds).toContain(ITEM_IDS.lipGloss);
  });

  it("does not merge a stack of two", () => {
    const ctx = ctxAt();
    const state = createInitialState(defaultCatalog, ctx.clock);
    const stacked = reduce(
      state,
      { type: "STACK", from: { row: 2, col: 1 }, to: { row: 2, col: 2 } },
      ctx,
    );
    const failed = reduce(
      stacked.state,
      { type: "MERGE_CELL", at: { row: 2, col: 2 } },
      ctx,
    );
    expect(failed.events[0]?.kind).toBe("merge_failed");
    expect(getCell(failed.state.board, { row: 2, col: 2 })?.items).toHaveLength(2);
  });

  it("produces two next-tier items from a five-merge", () => {
    const ctx = ctxAt();
    let state = createInitialState(defaultCatalog, ctx.clock);
    state = {
      ...state,
      board: placeItems(state.board, { row: 0, col: 0 }, [
        { instanceId: "extra_1", itemId: ITEM_IDS.lipBalm },
      ]),
    };
    const result = dispatchAll(
      state,
      [
        { type: "STACK", from: { row: 2, col: 1 }, to: { row: 0, col: 0 } },
        { type: "STACK", from: { row: 2, col: 2 }, to: { row: 0, col: 0 } },
        { type: "STACK", from: { row: 3, col: 2 }, to: { row: 0, col: 0 } },
        { type: "STACK", from: { row: 3, col: 3 }, to: { row: 0, col: 0 } },
        { type: "MERGE_CELL", at: { row: 0, col: 0 } },
      ],
      ctx,
    );
    const glossOnBoard = result.state.board.cells
      .flat()
      .flatMap((cell) => cell.items)
      .filter((item) => item.itemId === ITEM_IDS.lipGloss);
    expect(glossOnBoard).toHaveLength(2);
    expect(result.events.some((event) => event.message.includes("five-merge"))).toBe(
      true,
    );
  });

  it("collects a ready generator output onto an empty cell", () => {
    const ctx = ctxAt();
    const state = createInitialState(defaultCatalog, ctx.clock);
    const before = state.board.cells
      .flat()
      .flatMap((cell) => cell.items)
      .filter((item) => item.itemId === ITEM_IDS.lipBalm).length;
    const collected = reduce(
      state,
      {
        type: "COLLECT_GENERATOR",
        generatorId: GENERATOR_IDS.vanityCase,
        to: { row: 0, col: 5 },
      },
      ctx,
    );
    expect(collected.events[0]?.kind).toBe("collected");
    expect(getCell(collected.state.board, { row: 0, col: 5 })?.items[0]?.itemId).toBe(
      ITEM_IDS.lipBalm,
    );
    expect(collected.state.generators[0]?.storedCount).toBe(0);
    const after = collected.state.board.cells
      .flat()
      .flatMap((cell) => cell.items)
      .filter((item) => item.itemId === ITEM_IDS.lipBalm).length;
    expect(after).toBe(before + 1);
  });

  it("stores generator output after the production timer completes", () => {
    const clock = controllableClock(0);
    const ctx = { catalog: defaultCatalog, clock };
    let state = createInitialState(defaultCatalog, clock);
    state = reduce(
      state,
      {
        type: "COLLECT_GENERATOR",
        generatorId: GENERATOR_IDS.vanityCase,
        to: { row: 0, col: 5 },
      },
      ctx,
    ).state;
    expect(state.generators[0]?.storedCount).toBe(0);
    clock.advance(8_000);
    state = reduce(state, { type: "TICK" }, ctx).state;
    expect(state.generators[0]?.storedCount).toBe(1);
  });
});
