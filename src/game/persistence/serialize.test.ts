import { describe, expect, it } from "vitest";
import { defaultCatalog } from "../catalog/defaultCatalog";
import { controllableClock } from "../clock";
import { ITEM_IDS } from "../data/families";
import { GENERATOR_IDS } from "../data/generators";
import { createInitialState } from "../state/initial";
import { dispatchAll } from "../state/reducer";
import { createMemoryPersistence } from "./memory";
import { deserialize, serialize } from "./serialize";

describe("persistence", () => {
  it("round-trips game state", () => {
    const clock = controllableClock(42);
    const state = createInitialState(defaultCatalog, clock);
    const raw = serialize(state, clock);
    const save = deserialize(raw);
    expect(save.schemaVersion).toBe(1);
    expect(save.savedAt).toBe(42);
    expect(save.state.board.width).toBe(state.board.width);
    expect(save.state.economy.wallet.balances).toEqual(
      state.economy.wallet.balances,
    );
  });

  it("rejects garbage and unsupported schemas", () => {
    expect(() => deserialize("not-json")).toThrow(/valid JSON/);
    expect(() => deserialize("{}")).toThrow(/required fields/);
    expect(() =>
      deserialize(
        JSON.stringify({
          schemaVersion: 99,
          savedAt: 1,
          state: {
            schemaVersion: 99,
            board: {},
            economy: {},
            timers: {},
          },
        }),
      ),
    ).toThrow(/Unsupported save schema/);
  });

  it("stores and reloads through the memory adapter", () => {
    const clock = controllableClock(7);
    const persistence = createMemoryPersistence(clock);
    const state = createInitialState(defaultCatalog, clock);
    expect(persistence.load()).toBeNull();
    persistence.save(state);
    expect(persistence.load()?.state.seed).toBe(state.seed);
    persistence.clear();
    expect(persistence.load()).toBeNull();
  });

  it("persists merge, collect, energy spend, and reclaim", () => {
    const clock = controllableClock(0);
    const ctx = { catalog: defaultCatalog, clock };
    const start = {
      ...createInitialState(defaultCatalog, clock),
      inventory: [{ instanceId: "inv_1", itemId: ITEM_IDS.studio }],
    };
    const played = dispatchAll(
      start,
      [
        { type: "STACK", from: { row: 2, col: 1 }, to: { row: 2, col: 2 } },
        { type: "STACK", from: { row: 3, col: 2 }, to: { row: 2, col: 2 } },
        { type: "MERGE_CELL", at: { row: 2, col: 2 } },
        {
          type: "COLLECT_GENERATOR",
          generatorId: GENERATOR_IDS.vanityCase,
          to: { row: 0, col: 5 },
        },
        { type: "RECLAIM", inventoryIndex: 0, to: { row: 0, col: 0 } },
      ],
      ctx,
    );
    const save = deserialize(serialize(played.state, clock));
    expect(save.state.collection.discoveredItemIds).toContain(ITEM_IDS.lipGloss);
    expect(save.state.economy.energy.current).toBe(24);
    expect(save.state.inventory).toHaveLength(0);
    expect(
      save.state.board.cells[0]?.[0]?.items[0]?.itemId,
    ).toBe(ITEM_IDS.studio);
  });
});

describe("persistence", () => {
  it("round-trips game state", () => {
    const clock = controllableClock(42);
    const state = createInitialState(defaultCatalog, clock);
    const raw = serialize(state, clock);
    const save = deserialize(raw);
    expect(save.schemaVersion).toBe(1);
    expect(save.savedAt).toBe(42);
    expect(save.state.board.width).toBe(state.board.width);
    expect(save.state.economy.wallet.balances).toEqual(
      state.economy.wallet.balances,
    );
  });

  it("rejects garbage and unsupported schemas", () => {
    expect(() => deserialize("not-json")).toThrow(/valid JSON/);
    expect(() => deserialize("{}")).toThrow(/required fields/);
    expect(() =>
      deserialize(
        JSON.stringify({
          schemaVersion: 99,
          savedAt: 1,
          state: {
            schemaVersion: 99,
            board: {},
            economy: {},
            timers: {},
          },
        }),
      ),
    ).toThrow(/Unsupported save schema/);
  });

  it("stores and reloads through the memory adapter", () => {
    const clock = controllableClock(7);
    const persistence = createMemoryPersistence(clock);
    const state = createInitialState(defaultCatalog, clock);
    expect(persistence.load()).toBeNull();
    persistence.save(state);
    expect(persistence.load()?.state.seed).toBe(state.seed);
    persistence.clear();
    expect(persistence.load()).toBeNull();
  });
});
