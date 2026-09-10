import { describe, expect, it } from "vitest";
import { defaultCatalog } from "./defaultCatalog";
import { createCatalog } from "./createCatalog";
import { ITEM_IDS } from "../data/families";

describe("defaultCatalog", () => {
  it("loads six initial families of five tiers each", () => {
    expect(defaultCatalog.families()).toHaveLength(6);
    expect(defaultCatalog.items()).toHaveLength(30);
    for (const family of defaultCatalog.families()) {
      expect(family.chain).toHaveLength(5);
    }
  });

  it("walks tiers without hard-coded engine knowledge", () => {
    expect(defaultCatalog.nextTier(ITEM_IDS.lipBalm)?.id).toBe(ITEM_IDS.lipGloss);
    expect(defaultCatalog.previousTier(ITEM_IDS.lipGloss)?.id).toBe(
      ITEM_IDS.lipBalm,
    );
    expect(defaultCatalog.isMaxTier(ITEM_IDS.coutureGloss)).toBe(true);
    expect(defaultCatalog.chainOf(ITEM_IDS.lipBalm)).toHaveLength(5);
  });

  it("includes economy, generator, and area definitions", () => {
    expect(defaultCatalog.currencies().map((c) => c.id)).toEqual([
      "glitter_cash",
      "glitter_gems",
      "energy",
    ]);
    expect(defaultCatalog.generators()).toHaveLength(1);
    expect(defaultCatalog.getArea("glitter_neighborhood")?.implemented).toBe(
      true,
    );
    expect(defaultCatalog.getArea("billionaires_row")?.implemented).toBe(false);
  });

  it("rejects duplicate catalog ids", () => {
    expect(() =>
      createCatalog({
        items: [
          defaultCatalog.requireItem(ITEM_IDS.lipBalm),
          defaultCatalog.requireItem(ITEM_IDS.lipBalm),
        ],
        families: [],
        generators: [],
        currencies: [],
        areas: [],
      }),
    ).toThrow(/Duplicate catalog id/);
  });
});
