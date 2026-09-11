import { describe, expect, it } from "vitest";
import { defaultCatalog } from "../catalog/defaultCatalog";
import { ITEM_IDS } from "../data/families";
import { previewStack } from "./preview";

describe("previewStack", () => {
  it("hides undiscovered next-tier names", () => {
    const preview = previewStack(ITEM_IDS.lipBalm, 3, defaultCatalog, [
      ITEM_IDS.lipBalm,
    ]);
    expect(preview.canMerge).toBe(true);
    expect(preview.bonus).toBe(false);
    expect(preview.nextRevealed).toBe(false);
    expect(preview.nextName).toBeNull();
    expect(preview.hint).toContain("new Beauty look");
    expect(preview.hint).not.toContain("Lip Gloss");
  });

  it("names the next look once it has been discovered", () => {
    const preview = previewStack(ITEM_IDS.lipBalm, 3, defaultCatalog, [
      ITEM_IDS.lipBalm,
      ITEM_IDS.lipGloss,
    ]);
    expect(preview.nextRevealed).toBe(true);
    expect(preview.nextName).toBe("Lip Gloss");
    expect(preview.hint).toContain("Lip Gloss");
  });

  it("calls out the 5-merge bonus and double yield", () => {
    const preview = previewStack(ITEM_IDS.lipBalm, 5, defaultCatalog, [
      ITEM_IDS.lipBalm,
      ITEM_IDS.lipGloss,
    ]);
    expect(preview.bonus).toBe(true);
    expect(preview.producedCount).toBe(2);
    expect(preview.hint).toContain("5 MERGE BONUS");
    expect(preview.hint).toContain("2×");
  });
});
