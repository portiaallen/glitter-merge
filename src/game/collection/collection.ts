import type { ItemId } from "../ids";

export interface CollectionState {
  readonly discoveredItemIds: readonly ItemId[];
}

export function emptyCollection(): CollectionState {
  return { discoveredItemIds: [] };
}

export function discover(
  collection: CollectionState,
  itemIds: readonly ItemId[],
): CollectionState {
  if (itemIds.length === 0) return collection;
  const set = new Set(collection.discoveredItemIds);
  let changed = false;
  for (const id of itemIds) {
    if (!set.has(id)) {
      set.add(id);
      changed = true;
    }
  }
  if (!changed) return collection;
  return { discoveredItemIds: [...set].sort() };
}

export function isDiscovered(
  collection: CollectionState,
  itemId: ItemId,
): boolean {
  return collection.discoveredItemIds.includes(itemId);
}
