/**
 * Presentation-only destination map.
 * Venues light up from existing collection progress — no new game rules.
 */
import { familyProgress, type FamilyProgress, type GameState, type ItemCatalog } from "@game/index";
import { themeForFamily } from "../presentation";

export type VenueStatus = "locked" | "stirring" | "open";

export interface VenueSpec {
  readonly id: string;
  readonly familyId: string;
  readonly name: string;
  readonly dormantName: string;
  readonly openAtTier: number;
}

export interface VenueView {
  readonly id: string;
  readonly familyId: string;
  readonly name: string;
  readonly label: string;
  readonly status: VenueStatus;
  readonly discovered: number;
  readonly total: number;
  readonly accent: string;
  readonly mark: string;
}

export const NEIGHBORHOOD_VENUES: readonly VenueSpec[] = [
  {
    id: "gloss_bar",
    familyId: "beauty",
    name: "Gloss Bar",
    dormantName: "Empty storefront",
    openAtTier: 2,
  },
  {
    id: "boutique",
    familyId: "fashion",
    name: "The Boutique",
    dormantName: "Papered windows",
    openAtTier: 2,
  },
  {
    id: "atelier",
    familyId: "jewelry",
    name: "Jewel Atelier",
    dormantName: "Quiet bench",
    openAtTier: 1,
  },
  {
    id: "studio_lot",
    familyId: "real_estate",
    name: "Corner Studio",
    dormantName: "Empty lot",
    openAtTier: 1,
  },
  {
    id: "after_hours",
    familyId: "nightlife",
    name: "After Hours",
    dormantName: "Velvet rope",
    openAtTier: 1,
  },
  {
    id: "arrival",
    familyId: "automobiles",
    name: "Arrival Drive",
    dormantName: "Reserved curb",
    openAtTier: 1,
  },
];

export function venueStatus(progress: FamilyProgress, openAtTier: number): VenueStatus {
  if (progress.discovered === 0) return "locked";
  const highest = progress.entries.reduce(
    (tier, entry) => (entry.discovered ? Math.max(tier, entry.item.tier) : tier),
    0,
  );
  return highest >= openAtTier ? "open" : "stirring";
}

export function neighborhoodVenues(state: GameState, catalog: ItemCatalog): VenueView[] {
  const progress = familyProgress(catalog, state.collection);
  return NEIGHBORHOOD_VENUES.map((spec) => {
    const family = progress.find((entry) => entry.family.id === spec.familyId);
    const theme = themeForFamily(spec.familyId);
    const status = family ? venueStatus(family, spec.openAtTier) : "locked";
    return {
      id: spec.id,
      familyId: spec.familyId,
      name: spec.name,
      label: status === "locked" ? spec.dormantName : spec.name,
      status,
      discovered: family?.discovered ?? 0,
      total: family?.total ?? 0,
      accent: theme.accent,
      mark: theme.mark,
    };
  });
}

export function venueOpenedByItem(
  itemId: string,
  catalog: ItemCatalog,
  state: GameState,
): VenueView | null {
  const item = catalog.getItem(itemId);
  if (!item) return null;
  const spec = NEIGHBORHOOD_VENUES.find((venue) => venue.familyId === item.familyId);
  if (!spec || item.tier !== spec.openAtTier) return null;
  return neighborhoodVenues(state, catalog).find((venue) => venue.id === spec.id) ?? null;
}
