import { describe, expect, it } from "vitest";
import { defaultCatalog } from "../catalog/defaultCatalog";
import { ITEM_IDS } from "../data/families";
import { discover, emptyCollection } from "./collection";
import { familyProgress } from "./progress";

describe("familyProgress", () => {
  it("counts discovered vs locked tiers per family", () => {
    const collection = discover(emptyCollection(), [
      ITEM_IDS.lipBalm,
      ITEM_IDS.lipGloss,
    ]);
    const beauty = familyProgress(defaultCatalog, collection).find(
      (entry) => entry.family.id === "beauty",
    );
    expect(beauty?.discovered).toBe(2);
    expect(beauty?.total).toBe(5);
    expect(beauty?.entries.map((entry) => entry.discovered)).toEqual([
      true,
      true,
      false,
      false,
      false,
    ]);
  });
});
