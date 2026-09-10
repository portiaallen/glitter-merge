import type { GeneratorDefinition } from "../catalog/types";
import { ITEM_IDS } from "./families";

export const GENERATOR_IDS = {
  vanityCase: "vanity_case",
} as const;

/**
 * Starter production source. Timer values are placeholders so the
 * architecture can be exercised — pacing will be tuned later.
 */
export const INITIAL_GENERATORS: readonly GeneratorDefinition[] = [
  {
    id: GENERATOR_IDS.vanityCase,
    name: "Vanity Case",
    blurb: "A well-loved case that keeps turning out lip balm.",
    outputItemId: ITEM_IDS.lipBalm,
    cooldownMs: 8_000,
    maxStored: 4,
  },
];
