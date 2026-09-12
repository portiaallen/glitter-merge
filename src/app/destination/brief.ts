/**
 * City brief — Fairyland-style purpose, Glitter City copy.
 * Derived only from existing board, collection, energy, and generator state.
 */
import {
  COLLECT_ENERGY_COST,
  GENERATOR_IDS,
  ITEM_IDS,
  matchingCoords,
  stackCountAt,
  type GameState,
  type ItemCatalog,
} from "@game/index";
import { neighborhoodVenues, type VenueView } from "./landmarks";

export interface CityBrief {
  readonly kicker: string;
  readonly title: string;
  readonly detail: string;
  readonly venueId: string | null;
}

function countOnBoard(state: GameState, itemId: string): number {
  return matchingCoords(state.board, itemId).reduce(
    (sum, coord) => sum + stackCountAt(state.board, coord),
    0,
  );
}

function venueById(venues: readonly VenueView[], id: string): VenueView | undefined {
  return venues.find((venue) => venue.id === id);
}

export function destinationBrief(state: GameState, catalog: ItemCatalog): CityBrief {
  const venues = neighborhoodVenues(state, catalog);
  const gloss = venueById(venues, "gloss_bar");
  const boutique = venueById(venues, "boutique");
  const atelier = venueById(venues, "atelier");
  const studio = venueById(venues, "studio_lot");
  const night = venueById(venues, "after_hours");
  const drive = venueById(venues, "arrival");

  const balms = countOnBoard(state, ITEM_IDS.lipBalm);
  const shirts = countOnBoard(state, ITEM_IDS.basicShirt);
  const beads = countOnBoard(state, ITEM_IDS.beads);

  const generator = state.generators.find(
    (entry) => entry.definitionId === GENERATOR_IDS.vanityCase,
  );
  const energy = Math.floor(state.economy.energy.current);
  const canCollect =
    (generator?.storedCount ?? 0) > 0 && energy >= COLLECT_ENERGY_COST;

  if (gloss && gloss.status !== "open" && balms >= 3) {
    return {
      kicker: "Tonight",
      title: "Open the Gloss Bar",
      detail: "Stack 3 Lip Balms. A new look lights this corner of the city.",
      venueId: "gloss_bar",
    };
  }

  if (gloss && gloss.status !== "open" && balms > 0) {
    return {
      kicker: "Tonight",
      title: "Gather Lip Balm",
      detail: `${3 - balms} more to open the Gloss Bar.`,
      venueId: "gloss_bar",
    };
  }

  if (boutique && boutique.status !== "open" && shirts >= 3) {
    return {
      kicker: "Tonight",
      title: "Dress the Boutique",
      detail: "Stack 3 Basic Shirts and put something in the window.",
      venueId: "boutique",
    };
  }

  if (canCollect) {
    return {
      kicker: "The block",
      title: "Restock the terrace",
      detail: "Collect from the Vanity Case. One Energy. More glam on the lot.",
      venueId: null,
    };
  }

  if (boutique && boutique.status !== "open" && shirts > 0) {
    return {
      kicker: "Tonight",
      title: "Dress the Boutique",
      detail: `${3 - shirts} more Basic Shirt${3 - shirts === 1 ? "" : "s"} to open the windows.`,
      venueId: "boutique",
    };
  }

  if (atelier && atelier.status === "open" && beads >= 3) {
    return {
      kicker: "The block",
      title: "Raise the Atelier",
      detail: "Stack 3 Beads. Keep 5 if you can — the bonus is fabulous.",
      venueId: "atelier",
    };
  }

  if (studio && studio.status === "locked") {
    return {
      kicker: "Coming soon",
      title: "The empty lot is waiting",
      detail: "Real Estate looks will claim that corner. Keep merging.",
      venueId: "studio_lot",
    };
  }

  if (night && night.status === "locked" && drive && drive.status === "locked") {
    return {
      kicker: "The city",
      title: "Keep the terrace fabulous",
      detail: "Stack matching jewels. Discoveries dress Glitter Neighborhood.",
      venueId: null,
    };
  }

  return {
    kicker: "The city",
    title: "Keep the terrace fabulous",
    detail: "Stack matching jewels. Discoveries dress Glitter Neighborhood.",
    venueId: null,
  };
}
