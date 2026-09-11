import { describe, expect, it } from "vitest";
import { mergeCashReward } from "./rewards";
import { COLLECT_ENERGY_COST } from "./costs";

describe("mergeCashReward", () => {
  it("pays more for a 5-merge than a 3-merge", () => {
    expect(mergeCashReward(1, 0, 1)).toBe(5);
    expect(mergeCashReward(1, 1, 0)).toBe(15);
    expect(mergeCashReward(2, 1, 0)).toBe(30);
  });
});

describe("collect energy cost", () => {
  it("is a single, modest spend", () => {
    expect(COLLECT_ENERGY_COST).toBe(1);
  });
});
