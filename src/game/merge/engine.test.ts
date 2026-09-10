import { describe, expect, it } from "vitest";
import { defaultCatalog } from "../catalog/defaultCatalog";
import { ITEM_IDS } from "../data/families";
import { canMerge, planMerge, planMergeCount } from "./engine";

describe("planMerge", () => {
  it("rejects an empty list", () => {
    const plan = planMerge([], defaultCatalog);
    expect(plan.valid).toBe(false);
    expect(plan.reason).toBe("empty");
  });

  it("rejects mixed item ids", () => {
    const plan = planMerge(
      [ITEM_IDS.lipBalm, ITEM_IDS.lipBalm, ITEM_IDS.basicShirt],
      defaultCatalog,
    );
    expect(plan.valid).toBe(false);
    expect(plan.reason).toBe("mixed_items");
  });

  it("rejects unknown items", () => {
    const plan = planMerge(["nope.thing", "nope.thing", "nope.thing"], defaultCatalog);
    expect(plan.valid).toBe(false);
    expect(plan.reason).toBe("unknown_item");
  });

  it("rejects fewer than 3 items", () => {
    const plan = planMergeCount(ITEM_IDS.lipBalm, 2, defaultCatalog);
    expect(plan.valid).toBe(false);
    expect(plan.reason).toBe("too_few");
  });

  it("turns 3 items into 1 next tier", () => {
    const plan = planMergeCount(ITEM_IDS.lipBalm, 3, defaultCatalog);
    expect(plan.valid).toBe(true);
    expect(plan.threeMerges).toBe(1);
    expect(plan.fiveMerges).toBe(0);
    expect(plan.leftoverCount).toBe(0);
    expect(plan.produced).toEqual([{ itemId: ITEM_IDS.lipGloss, count: 1 }]);
  });

  it("turns 5 items into 2 next tier", () => {
    const plan = planMergeCount(ITEM_IDS.lipBalm, 5, defaultCatalog);
    expect(plan.valid).toBe(true);
    expect(plan.fiveMerges).toBe(1);
    expect(plan.threeMerges).toBe(0);
    expect(plan.produced).toEqual([{ itemId: ITEM_IDS.lipGloss, count: 2 }]);
  });

  it("handles 4 as one 3-merge plus leftover", () => {
    const plan = planMergeCount(ITEM_IDS.lipBalm, 4, defaultCatalog);
    expect(plan.threeMerges).toBe(1);
    expect(plan.leftoverCount).toBe(1);
    expect(plan.produced).toEqual([{ itemId: ITEM_IDS.lipGloss, count: 1 }]);
  });

  it("prefers a 5-merge before a 3-merge", () => {
    const plan = planMergeCount(ITEM_IDS.lipBalm, 8, defaultCatalog);
    expect(plan.fiveMerges).toBe(1);
    expect(plan.threeMerges).toBe(1);
    expect(plan.leftoverCount).toBe(0);
    expect(plan.produced).toEqual([{ itemId: ITEM_IDS.lipGloss, count: 3 }]);
  });

  it("leaves 1 after a 5-merge from 6", () => {
    const plan = planMergeCount(ITEM_IDS.lipBalm, 6, defaultCatalog);
    expect(plan.fiveMerges).toBe(1);
    expect(plan.leftoverCount).toBe(1);
    expect(plan.produced).toEqual([{ itemId: ITEM_IDS.lipGloss, count: 2 }]);
  });

  it("rejects max-tier items", () => {
    const plan = planMergeCount(ITEM_IDS.coutureGloss, 5, defaultCatalog);
    expect(plan.valid).toBe(false);
    expect(plan.reason).toBe("max_tier");
  });

  it("works for any configured family", () => {
    const plan = planMergeCount(ITEM_IDS.basicShirt, 3, defaultCatalog);
    expect(plan.valid).toBe(true);
    expect(plan.produced[0]?.itemId).toBe(ITEM_IDS.cuteOutfit);
  });

  it("exposes canMerge as a boolean helper", () => {
    expect(canMerge([ITEM_IDS.lipBalm, ITEM_IDS.lipBalm], defaultCatalog)).toBe(
      false,
    );
    expect(
      canMerge(
        [ITEM_IDS.lipBalm, ITEM_IDS.lipBalm, ITEM_IDS.lipBalm],
        defaultCatalog,
      ),
    ).toBe(true);
  });
});
