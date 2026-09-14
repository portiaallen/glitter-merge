import type { ItemCatalog } from "../catalog/types";
import type { ItemId } from "../ids";
import {
  BONUS_MERGE_COUNT,
  EMPTY_MERGE_PLAN,
  MIN_MERGE_COUNT,
  type MergePlan,
  type MergeRejectReason,
} from "./types";

function reject(
  reason: MergeRejectReason,
  sourceItemId: ItemId | null,
  sourceCount: number,
): MergePlan {
  return {
    ...EMPTY_MERGE_PLAN,
    reason,
    sourceItemId,
    sourceCount,
    leftoverCount: sourceCount,
  };
}

/**
 * Pure merge planner.
 *
 * Rules:
 * - All inputs must share one item id.
 * - At least 3 items are required.
 * - Spend as many 5-merges as possible, then 3-merges.
 * - A 3-merge yields 1 next-tier item.
 * - A 5-merge yields 2 next-tier items (bonus).
 * - Remainder 0–2 of the source tier is leftover.
 * - Max-tier items cannot merge (no next definition).
 *
 * The engine never reads family names or presentation data.
 */
export function planMerge(
  itemIds: readonly ItemId[],
  catalog: ItemCatalog,
): MergePlan {
  if (itemIds.length === 0) {
    return reject("empty", null, 0);
  }

  const sourceItemId = itemIds[0];
  if (sourceItemId === undefined) {
    return reject("empty", null, 0);
  }

  for (const id of itemIds) {
    if (id !== sourceItemId) {
      return reject("mixed_items", sourceItemId, itemIds.length);
    }
  }

  const source = catalog.getItem(sourceItemId);
  if (!source) {
    return reject("unknown_item", sourceItemId, itemIds.length);
  }

  if (itemIds.length < MIN_MERGE_COUNT) {
    return reject("too_few", sourceItemId, itemIds.length);
  }

  const next = catalog.nextTier(sourceItemId);
  if (!next) {
    return reject("max_tier", sourceItemId, itemIds.length);
  }

  let remaining = itemIds.length;
  let fiveMerges = 0;
  let threeMerges = 0;

  while (remaining >= BONUS_MERGE_COUNT) {
    remaining -= BONUS_MERGE_COUNT;
    fiveMerges += 1;
  }
  while (remaining >= MIN_MERGE_COUNT) {
    remaining -= MIN_MERGE_COUNT;
    threeMerges += 1;
  }

  const producedCount = fiveMerges * 2 + threeMerges;
  const usedCount = itemIds.length - remaining;

  return {
    valid: producedCount > 0,
    reason: producedCount > 0 ? null : "too_few",
    sourceItemId,
    sourceCount: itemIds.length,
    usedCount,
    leftoverCount: remaining,
    threeMerges,
    fiveMerges,
    produced: producedCount > 0 ? [{ itemId: next.id, count: producedCount }] : [],
  };
}

export function planMergeCount(
  itemId: ItemId,
  count: number,
  catalog: ItemCatalog,
): MergePlan {
  if (count <= 0) return planMerge([], catalog);
  return planMerge(Array.from({ length: count }, () => itemId), catalog);
}

export function canMerge(
  itemIds: readonly ItemId[],
  catalog: ItemCatalog,
): boolean {
  return planMerge(itemIds, catalog).valid;
}
