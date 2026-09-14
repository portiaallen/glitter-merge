import type {
  AreaDefinition,
  CurrencyDefinition,
  GeneratorDefinition,
  ItemCatalog,
  ItemDefinition,
  MergeFamilyDefinition,
} from "./types";
import type { AreaId, CurrencyId, FamilyId, GeneratorDefId, ItemId } from "../ids";

export interface CatalogData {
  readonly items: readonly ItemDefinition[];
  readonly families: readonly MergeFamilyDefinition[];
  readonly generators: readonly GeneratorDefinition[];
  readonly currencies: readonly CurrencyDefinition[];
  readonly areas: readonly AreaDefinition[];
}

function indexById<T extends { readonly id: string }>(
  entries: readonly T[],
): Map<string, T> {
  const map = new Map<string, T>();
  for (const entry of entries) {
    if (map.has(entry.id)) {
      throw new Error(`Duplicate catalog id: ${entry.id}`);
    }
    map.set(entry.id, entry);
  }
  return map;
}

export function createCatalog(data: CatalogData): ItemCatalog {
  const itemsById = indexById(data.items);
  const familiesById = indexById(data.families);
  const generatorsById = indexById(data.generators);
  const currenciesById = indexById(data.currencies);
  const areasById = indexById(data.areas);

  const nextByItem = new Map<ItemId, ItemId>();
  const prevByItem = new Map<ItemId, ItemId>();

  for (const family of data.families) {
    for (let i = 0; i < family.chain.length; i += 1) {
      const current = family.chain[i];
      if (current === undefined) continue;
      const item = itemsById.get(current);
      if (!item) {
        throw new Error(`Family ${family.id} references missing item ${current}`);
      }
      if (item.familyId !== family.id) {
        throw new Error(`Item ${item.id} family mismatch in ${family.id}`);
      }
      if (item.tier !== i + 1) {
        throw new Error(`Item ${item.id} tier ${item.tier} expected ${i + 1}`);
      }
      const previous = family.chain[i - 1];
      const next = family.chain[i + 1];
      if (previous !== undefined) prevByItem.set(current, previous);
      if (next !== undefined) nextByItem.set(current, next);
    }
  }

  return {
    getItem: (id) => itemsById.get(id),
    requireItem: (id) => {
      const item = itemsById.get(id);
      if (!item) throw new Error(`Unknown item: ${id}`);
      return item;
    },
    items: () => data.items,
    getFamily: (id: FamilyId) => familiesById.get(id),
    families: () => data.families,
    nextTier: (id) => {
      const nextId = nextByItem.get(id);
      return nextId === undefined ? undefined : itemsById.get(nextId);
    },
    previousTier: (id) => {
      const prevId = prevByItem.get(id);
      return prevId === undefined ? undefined : itemsById.get(prevId);
    },
    chainOf: (id) => {
      const item = itemsById.get(id);
      if (!item) return [];
      const family = familiesById.get(item.familyId);
      if (!family) return [item];
      return family.chain
        .map((itemId) => itemsById.get(itemId))
        .filter((entry): entry is ItemDefinition => entry !== undefined);
    },
    isMaxTier: (id) => !nextByItem.has(id),
    getGenerator: (id: GeneratorDefId) => generatorsById.get(id),
    generators: () => data.generators,
    getCurrency: (id: CurrencyId) => currenciesById.get(id),
    currencies: () => data.currencies,
    getArea: (id: AreaId) => areasById.get(id),
    areas: () => data.areas,
  };
}
