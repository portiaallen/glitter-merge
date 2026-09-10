import type { ItemId } from "../ids";

export const MIN_MERGE_COUNT = 3;
export const BONUS_MERGE_COUNT = 5;

export type MergeRejectReason =
  | "empty"
  | "too_few"
  | "mixed_items"
  | "max_tier"
  | "unknown_item";

export interface ProducedStack {
  readonly itemId: ItemId;
  readonly count: number;
}

export interface MergePlan {
  readonly valid: boolean;
  readonly reason: MergeRejectReason | null;
  readonly sourceItemId: ItemId | null;
  readonly sourceCount: number;
  readonly usedCount: number;
  readonly leftoverCount: number;
  readonly threeMerges: number;
  readonly fiveMerges: number;
  readonly produced: readonly ProducedStack[];
}

export const EMPTY_MERGE_PLAN: MergePlan = {
  valid: false,
  reason: "empty",
  sourceItemId: null,
  sourceCount: 0,
  usedCount: 0,
  leftoverCount: 0,
  threeMerges: 0,
  fiveMerges: 0,
  produced: [],
};
