import type { CurrencyDefinition } from "../catalog/types";

export const CURRENCY_IDS = {
  glitterCash: "glitter_cash",
  glitterGems: "glitter_gems",
  energy: "energy",
} as const;

export const INITIAL_CURRENCIES: readonly CurrencyDefinition[] = [
  { id: CURRENCY_IDS.glitterCash, name: "Glitter Cash", kind: "soft" },
  { id: CURRENCY_IDS.glitterGems, name: "Glitter Gems", kind: "premium" },
  { id: CURRENCY_IDS.energy, name: "Energy", kind: "energy" },
];
