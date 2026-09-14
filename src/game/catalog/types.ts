import type { AreaId, CurrencyId, FamilyId, GeneratorDefId, ItemId } from "../ids";

/**
 * Reserved for future special board pieces. Phase 0 items are all `null`.
 * The merge engine must not branch on these yet.
 */
export type SpecialItemKind = "generator" | "boost" | "event" | "unique";

export interface ItemDefinition {
  readonly id: ItemId;
  readonly familyId: FamilyId;
  readonly tier: number;
  readonly name: string;
  readonly shortName: string;
  readonly description: string;
  readonly tags: readonly string[];
  readonly discoverable: boolean;
  readonly specialKind: SpecialItemKind | null;
}

export interface MergeFamilyDefinition {
  readonly id: FamilyId;
  readonly name: string;
  readonly blurb: string;
  readonly chain: readonly ItemId[];
}

export interface GeneratorDefinition {
  readonly id: GeneratorDefId;
  readonly name: string;
  readonly blurb: string;
  readonly outputItemId: ItemId;
  readonly cooldownMs: number;
  readonly maxStored: number;
}

export type CurrencyKind = "soft" | "premium" | "energy" | "event";

export interface CurrencyDefinition {
  readonly id: CurrencyId;
  readonly name: string;
  readonly kind: CurrencyKind;
}

export interface AreaDefinition {
  readonly id: AreaId;
  readonly name: string;
  readonly blurb: string;
  readonly unlockOrder: number;
  /** False means listed for the long-term city map only — do not simulate yet. */
  readonly implemented: boolean;
}

export interface ItemCatalog {
  getItem(id: ItemId): ItemDefinition | undefined;
  requireItem(id: ItemId): ItemDefinition;
  items(): readonly ItemDefinition[];
  getFamily(id: FamilyId): MergeFamilyDefinition | undefined;
  families(): readonly MergeFamilyDefinition[];
  nextTier(itemId: ItemId): ItemDefinition | undefined;
  previousTier(itemId: ItemId): ItemDefinition | undefined;
  chainOf(itemId: ItemId): readonly ItemDefinition[];
  isMaxTier(itemId: ItemId): boolean;
  getGenerator(id: GeneratorDefId): GeneratorDefinition | undefined;
  generators(): readonly GeneratorDefinition[];
  getCurrency(id: CurrencyId): CurrencyDefinition | undefined;
  currencies(): readonly CurrencyDefinition[];
  getArea(id: AreaId): AreaDefinition | undefined;
  areas(): readonly AreaDefinition[];
}
