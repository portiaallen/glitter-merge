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
    accent: "#ff4d8d",
    glow: "rgba(255, 77, 141, 0.55)",
    wash: "#ffd0e4",
    deep: "#c2185b",
    mark: "✦",
    label: "Beauty",
  },
  fashion: {
    accent: "#d05cff",
    glow: "rgba(208, 92, 255, 0.5)",
    wash: "#f0ccff",
    deep: "#7b1fa2",
    mark: "✿",
    label: "Fashion",
  },
  jewelry: {
    accent: "#f0c14b",
    glow: "rgba(240, 193, 75, 0.55)",
    wash: "#ffe9a8",
    deep: "#b8860b",
    mark: "◆",
    label: "Jewelry",
  },
  real_estate: {
    accent: "#4fc3ff",
    glow: "rgba(79, 195, 255, 0.5)",
    wash: "#c8eeff",
    deep: "#0277bd",
    mark: "▣",
    label: "Real Estate",
  },
  nightlife: {
    accent: "#8b6cff",
    glow: "rgba(139, 108, 255, 0.55)",
    wash: "#ddd4ff",
    deep: "#4527a0",
    mark: "✺",
    label: "Nightlife",
  },
  automobiles: {
    accent: "#2dd4bf",
    glow: "rgba(45, 212, 191, 0.5)",
    wash: "#c5fff4",
    deep: "#0f766e",
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
