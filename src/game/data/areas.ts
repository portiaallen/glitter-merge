import type { AreaDefinition } from "../catalog/types";

export const AREA_IDS = {
  glitterNeighborhood: "glitter_neighborhood",
  rainbowHeights: "rainbow_heights",
  fashionDistrict: "fashion_district",
  nightlifeDistrict: "nightlife_district",
  luxuryBeach: "luxury_beach",
  downtownGlitter: "downtown_glitter",
  billionairesRow: "billionaires_row",
} as const;

/**
 * Long-term city map. Only the starting neighborhood is in play.
 * Do not build simulation for the rest in Phase 0.
 */
export const INITIAL_AREAS: readonly AreaDefinition[] = [
  {
    id: AREA_IDS.glitterNeighborhood,
    name: "Glitter Neighborhood",
    blurb: "A modest, stylish corner of Glitter City. Home base.",
    unlockOrder: 0,
    implemented: true,
  },
  {
    id: AREA_IDS.rainbowHeights,
    name: "Rainbow Heights",
    blurb: "Hillside terraces and skyline parties.",
    unlockOrder: 1,
    implemented: false,
  },
  {
    id: AREA_IDS.fashionDistrict,
    name: "Fashion District",
    blurb: "Ateliers, lookbooks, and midnight fittings.",
    unlockOrder: 2,
    implemented: false,
  },
  {
    id: AREA_IDS.nightlifeDistrict,
    name: "Nightlife District",
    blurb: "Lounges, clubs, and the after-after party.",
    unlockOrder: 3,
    implemented: false,
  },
  {
    id: AREA_IDS.luxuryBeach,
    name: "Luxury Beach",
    blurb: "Cabana keys and champagne in the surf.",
    unlockOrder: 4,
    implemented: false,
  },
  {
    id: AREA_IDS.downtownGlitter,
    name: "Downtown Glitter",
    blurb: "The heart of the city. Lights, glass, and gossip.",
    unlockOrder: 5,
    implemented: false,
  },
  {
    id: AREA_IDS.billionairesRow,
    name: "Billionaire's Row",
    blurb: "The most expensive zip code in Glitter City.",
    unlockOrder: 6,
    implemented: false,
  },
];
