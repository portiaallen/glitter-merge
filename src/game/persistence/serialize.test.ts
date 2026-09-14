import { describe, expect, it } from "vitest";
import { defaultCatalog } from "../catalog/defaultCatalog";
import { controllableClock } from "../clock";
import { createInitialState } from "../state/initial";
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
});
