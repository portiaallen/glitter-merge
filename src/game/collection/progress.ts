import type { ItemCatalog } from "../catalog/types";
import type { ItemDefinition, MergeFamilyDefinition } from "../catalog/types";
import type { CollectionState } from "./collection";
import { isDiscovered } from "./collection";

export interface FamilyProgressEntry {
  readonly item: ItemDefinition;
  readonly discovered: boolean;
}

export interface FamilyProgress {
  readonly family: MergeFamilyDefinition;
  readonly discovered: number;
  readonly total: number;
  readonly entries: readonly FamilyProgressEntry[];
}

export function familyProgress(
  catalog: ItemCatalog,
  collection: CollectionState,
): readonly FamilyProgress[] {
  return catalog.families().map((family) => {
    const entries = family.chain.map((itemId) => {
      const item = catalog.requireItem(itemId);
      return { item, discovered: isDiscovered(collection, item.id) };
    });
    return {
      family,
      discovered: entries.filter((entry) => entry.discovered).length,
      total: entries.length,
      entries,
    };
  });
}
