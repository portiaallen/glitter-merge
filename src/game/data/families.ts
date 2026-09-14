import { itemId } from "../ids";
import type {
  ItemDefinition,
  MergeFamilyDefinition,
} from "../catalog/types";
import type { FamilyId } from "../ids";

interface TierSpec {
  readonly slug: string;
  readonly name: string;
  readonly shortName?: string;
  readonly description: string;
}

interface FamilySpec {
  readonly id: FamilyId;
  readonly name: string;
  readonly blurb: string;
  readonly tags: readonly string[];
  readonly tiers: readonly TierSpec[];
}

function defineFamily(spec: FamilySpec): {
  family: MergeFamilyDefinition;
  items: ItemDefinition[];
} {
  const items: ItemDefinition[] = spec.tiers.map((tier, index) => ({
    id: itemId(spec.id, tier.slug),
    familyId: spec.id,
    tier: index + 1,
    name: tier.name,
    shortName: tier.shortName ?? tier.name,
    description: tier.description,
    tags: spec.tags,
    discoverable: true,
    specialKind: null,
  }));

  return {
    family: {
      id: spec.id,
      name: spec.name,
      blurb: spec.blurb,
      chain: items.map((item) => item.id),
    },
    items,
  };
}

/**
 * Initial conceptual families. Adding a family is a data change —
 * the merge engine never names these IDs.
 */
const FAMILY_SPECS: readonly FamilySpec[] = [
  {
    id: "beauty",
    name: "Beauty",
    blurb: "Gloss, glow, and couture-level shine.",
    tags: ["beauty", "glam"],
    tiers: [
      {
        slug: "lip_balm",
        name: "Lip Balm",
        description: "A modest swipe of color. Everyone starts somewhere.",
      },
      {
        slug: "lip_gloss",
        name: "Lip Gloss",
        description: "Catch the light. Then keep it.",
      },
      {
        slug: "luxury_gloss",
        name: "Luxury Gloss",
        description: "The kind of shine that gets you a better table.",
      },
      {
        slug: "diamond_gloss",
        name: "Diamond Gloss",
        description: "Faceted, expensive, and absolutely extra.",
      },
      {
        slug: "couture_gloss",
        name: "Couture Gloss",
        description: "Runway lips. Limited edition energy.",
      },
    ],
  },
  {
    id: "fashion",
    name: "Fashion",
    blurb: "Looks that walk into a room and own it.",
    tags: ["fashion", "style"],
    tiers: [
      {
        slug: "basic_shirt",
        name: "Basic Shirt",
        description: "Clean, cute, and ready for a glow-up.",
      },
      {
        slug: "cute_outfit",
        name: "Cute Outfit",
        description: "Brunch-ready and a little bit famous.",
      },
      {
        slug: "glam_outfit",
        name: "Glam Outfit",
        description: "Sequins optional. Attitude required.",
      },
      {
        slug: "runway_look",
        name: "Runway Look",
        description: "Editors would like a word.",
      },
      {
        slug: "couture_look",
        name: "Couture Look",
        description: "One-of-one. Do not ask the price.",
      },
    ],
  },
  {
    id: "jewelry",
    name: "Jewelry",
    blurb: "Ice that photographs from across the penthouse.",
    tags: ["jewelry", "luxury"],
    tiers: [
      {
        slug: "beads",
        name: "Beads",
        description: "Playful color. A first sparkle.",
      },
      {
        slug: "bracelet",
        name: "Bracelet",
        description: "A little wrist candy.",
      },
      {
        slug: "gold_bracelet",
        name: "Gold Bracelet",
        description: "Warm metal. Cold bank account.",
      },
      {
        slug: "diamond_bracelet",
        name: "Diamond Bracelet",
        description: "Quiet luxury, loud stones.",
      },
      {
        slug: "statement_jewelry",
        name: "Statement Jewelry",
        shortName: "Statement",
        description: "The piece people remember.",
      },
    ],
  },
  {
    id: "real_estate",
    name: "Real Estate",
    blurb: "Keys, views, and square footage with an opinion.",
    tags: ["real_estate", "property"],
    tiers: [
      {
        slug: "studio",
        name: "Studio",
        description: "Small, stylish, and yours.",
      },
      {
        slug: "condo",
        name: "Condo",
        description: "A proper address in Glitter City.",
      },
      {
        slug: "luxury_condo",
        name: "Luxury Condo",
        description: "Doorman, marble, and a better skyline.",
      },
      {
        slug: "penthouse",
        name: "Penthouse",
        description: "The city looks better from up here.",
      },
      {
        slug: "mansion",
        name: "Mansion",
        description: "Gates, gardens, and a guest list.",
      },
    ],
  },
  {
    id: "nightlife",
    name: "Nightlife",
    blurb: "From a bar cart to the club everyone is talking about.",
    tags: ["nightlife", "entertainment"],
    tiers: [
      {
        slug: "bar_cart",
        name: "Bar Cart",
        description: "A party that fits in a corner.",
      },
      {
        slug: "bar",
        name: "Bar",
        description: "Names on the door. Stories at the rail.",
      },
      {
        slug: "lounge",
        name: "Lounge",
        description: "Low lights, high standards.",
      },
      {
        slug: "club",
        name: "Club",
        description: "The floor is a runway.",
      },
      {
        slug: "mega_club",
        name: "Mega Club",
        description: "A destination. Bring an entourage.",
      },
    ],
  },
  {
    id: "automobiles",
    name: "Automobiles",
    blurb: "Arrival is a performance.",
    tags: ["automobiles", "travel"],
    tiers: [
      {
        slug: "compact",
        name: "Compact",
        description: "City-smart and camera-ready.",
      },
      {
        slug: "coupe",
        name: "Coupe",
        description: "Two seats and a point of view.",
      },
      {
        slug: "luxury_car",
        name: "Luxury Car",
        description: "Quiet ride. Loud impression.",
      },
      {
        slug: "sports_car",
        name: "Sports Car",
        description: "Built to be seen leaving.",
      },
      {
        slug: "supercar",
        name: "Supercar",
        description: "The driveway is a gallery.",
      },
    ],
  },
];

export const INITIAL_FAMILIES: MergeFamilyDefinition[] = [];
export const INITIAL_ITEMS: ItemDefinition[] = [];

for (const spec of FAMILY_SPECS) {
  const defined = defineFamily(spec);
  INITIAL_FAMILIES.push(defined.family);
  INITIAL_ITEMS.push(...defined.items);
}

export const ITEM_IDS = {
  lipBalm: itemId("beauty", "lip_balm"),
  lipGloss: itemId("beauty", "lip_gloss"),
  luxuryGloss: itemId("beauty", "luxury_gloss"),
  diamondGloss: itemId("beauty", "diamond_gloss"),
  coutureGloss: itemId("beauty", "couture_gloss"),
  basicShirt: itemId("fashion", "basic_shirt"),
  cuteOutfit: itemId("fashion", "cute_outfit"),
  beads: itemId("jewelry", "beads"),
  studio: itemId("real_estate", "studio"),
  barCart: itemId("nightlife", "bar_cart"),
  compact: itemId("automobiles", "compact"),
} as const;
