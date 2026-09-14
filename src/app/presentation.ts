/**
 * Presentation-only lookups. The game engine never imports this file.
 */
import type { ItemDefinition } from "@game/catalog/types";

export type Rarity = "common" | "luxe" | "icon" | "couture";

export interface FamilyTheme {
  readonly accent: string;
  readonly glow: string;
  readonly wash: string;
  readonly deep: string;
  readonly mark: string;
  readonly label: string;
}

export const FAMILY_THEMES: Readonly<Record<string, FamilyTheme>> = {
  beauty: {
    accent: "#ff5ea8",
    glow: "rgba(255, 94, 168, 0.7)",
    wash: "#ffd6eb",
    deep: "#d61f6b",
    mark: "✦",
    label: "Beauty",
  },
  fashion: {
    accent: "#cc6bff",
    glow: "rgba(204, 107, 255, 0.7)",
    wash: "#efd3ff",
    deep: "#7f33b8",
    mark: "✿",
    label: "Fashion",
  },
  jewelry: {
    accent: "#ffc857",
    glow: "rgba(255, 200, 87, 0.75)",
    wash: "#fff1b3",
    deep: "#c78a0d",
    mark: "◆",
    label: "Jewelry",
  },
  real_estate: {
    accent: "#4cc9ff",
    glow: "rgba(76, 201, 255, 0.72)",
    wash: "#d7f5ff",
    deep: "#0d7bbd",
    mark: "▣",
    label: "Real Estate",
  },
  nightlife: {
    accent: "#8576ff",
    glow: "rgba(133, 118, 255, 0.72)",
    wash: "#e2dcff",
    deep: "#4f42bc",
    mark: "✺",
    label: "Nightlife",
  },
  automobiles: {
    accent: "#3fe0d0",
    glow: "rgba(63, 224, 208, 0.72)",
    wash: "#d3fff8",
    deep: "#0d8a7d",
    mark: "▸",
    label: "Automobiles",
  },
};

export const DEFAULT_THEME: FamilyTheme = {
  accent: "#ff2e8a",
  glow: "rgba(255, 46, 138, 0.4)",
  wash: "#ffe8f2",
  deep: "#ad1457",
  mark: "★",
  label: "Look",
};

export function themeFor(item: ItemDefinition | undefined): FamilyTheme {
  if (!item) return DEFAULT_THEME;
  return FAMILY_THEMES[item.familyId] ?? DEFAULT_THEME;
}

export function themeForFamily(familyId: string): FamilyTheme {
  return FAMILY_THEMES[familyId] ?? DEFAULT_THEME;
}

export function rarityForTier(tier: number): Rarity {
  if (tier >= 5) return "couture";
  if (tier >= 4) return "icon";
  if (tier >= 3) return "luxe";
  return "common";
}

export function rarityLabel(rarity: Rarity): string {
  switch (rarity) {
    case "couture":
      return "Couture";
    case "icon":
      return "Icon";
    case "luxe":
      return "Luxe";
    default:
      return "Rising";
  }
}

export function formatEnergy(current: number, max: number): string {
  return `${Math.floor(current)}/${max}`;
}

export function formatMs(ms: number): string {
  const total = Math.max(0, Math.ceil(ms / 1000));
  const minutes = Math.floor(total / 60);
  const seconds = total % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}
