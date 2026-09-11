import type { ItemCatalog } from "../catalog/types";
import type { ItemId } from "../ids";
import { BONUS_MERGE_COUNT, MIN_MERGE_COUNT } from "./types";
import { planMergeCount } from "./engine";

export interface MergePreview {
  readonly canMerge: boolean;
  readonly bonus: boolean;
  readonly leftoverCount: number;
  readonly producedCount: number;
  readonly nextTier: number | null;
  readonly nextRevealed: boolean;
  readonly nextName: string | null;
  readonly familyName: string;
  readonly hint: string;
}

/**
 * Preview what a stack will produce without naming undiscovered next tiers.
 */
export function previewStack(
  itemId: ItemId,
  count: number,
  catalog: ItemCatalog,
  discoveredItemIds: readonly ItemId[],
): MergePreview {
  const source = catalog.getItem(itemId);
  const family = source ? catalog.getFamily(source.familyId) : undefined;
  const familyName = family?.name ?? "this family";
  const next = catalog.nextTier(itemId);
  const plan = planMergeCount(itemId, count, catalog);
  const discovered = new Set(discoveredItemIds);
  const nextRevealed = next ? discovered.has(next.id) : false;

  let hint = `Stack ${MIN_MERGE_COUNT} to merge.`;
  if (count >= BONUS_MERGE_COUNT && plan.valid) {
    hint = "✨ 5 MERGE BONUS!";
  } else if (count === 4 && next) {
    hint = "One more for a 5 MERGE BONUS!";
  } else if (count >= MIN_MERGE_COUNT && plan.valid) {
    hint = "3 to merge";
  } else if (count === 2) {
    hint = `Need 1 more to merge.`;
  }

  if (plan.valid && next && count >= MIN_MERGE_COUNT) {
    const qty = plan.produced[0]?.count ?? 1;
    if (nextRevealed) {
      hint =
        count >= BONUS_MERGE_COUNT
          ? `✨ 5 MERGE BONUS! ${qty}× ${next.name}`
          : `3 to merge → ${next.name}`;
    } else {
      hint =
        count >= BONUS_MERGE_COUNT
          ? `✨ 5 MERGE BONUS! ${qty}× a new ${familyName} look`
          : `3 to merge → a new ${familyName} look`;
    }
  }

  return {
    canMerge: plan.valid,
    bonus: plan.fiveMerges > 0,
    leftoverCount: plan.leftoverCount,
    producedCount: plan.produced[0]?.count ?? 0,
    nextTier: next?.tier ?? null,
    nextRevealed,
    nextName: nextRevealed ? (next?.name ?? null) : null,
    familyName,
    hint,
  };
}
