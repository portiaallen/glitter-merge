/**
 * Stable string identifiers. Conventions (not enforced at runtime):
 * - Families: `beauty`, `fashion`, ...
 * - Items: `{familyId}.{slug}` e.g. `beauty.lip_balm`
 * - Currencies: `glitter_cash`, `glitter_gems`, `energy`
 * - Areas: `glitter_neighborhood`, `rainbow_heights`, ...
 */

export type ItemId = string;
export type FamilyId = string;
export type InstanceId = string;
export type CurrencyId = string;
export type TimerId = string;
export type GeneratorDefId = string;
export type AreaId = string;

export function itemId(familyId: FamilyId, slug: string): ItemId {
  return `${familyId}.${slug}`;
}

export function parseItemId(id: ItemId): { familyId: FamilyId; slug: string } {
  const dot = id.indexOf(".");
  if (dot <= 0 || dot === id.length - 1) {
    return { familyId: id, slug: id };
  }
  return { familyId: id.slice(0, dot), slug: id.slice(dot + 1) };
}

export function instanceId(seq: number): InstanceId {
  return `inst_${seq}`;
}

export function timerId(seq: number): TimerId {
  return `timer_${seq}`;
}
