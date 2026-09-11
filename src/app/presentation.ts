/**
 * Presentation-only lookups. The game engine never imports this file.
 */
import type { ItemDefinition } from "@game/catalog/types";

export type Rarity = "common" | "luxe" | "icon" | "couture";

export interface FamilyTheme {
  readonly accent: string;
  readonly glow: string;
  readonly wash: string;
  readonly mark: string;
  readonly label: string;
}

export const FAMILY_THEMES: Readonly<Record<string, FamilyTheme>> = {
  beauty: {
    accent: "#ff4d8d",
    glow: "rgba(255, 77, 141, 0.4)",
    wash: "#ffe0ec",
    mark: "✦",
    label: "Beauty",
  },
  fashion: {
    accent: "#c44dff",
    glow: "rgba(196, 77, 255, 0.4)",
    wash: "#f3e0ff",
    mark: "✿",
    label: "Fashion",
  },
  jewelry: {
    accent: "#d4a017",
    glow: "rgba(212, 160, 23, 0.45)",
    wash: "#fff1cc",
    mark: "◆",
    label: "Jewelry",
  },
  real_estate: {
    accent: "#2b9adf",
    glow: "rgba(43, 154, 223, 0.4)",
    wash: "#dcefff",
    mark: "▣",
    label: "Real Estate",
  },
  nightlife: {
    accent: "#6a4dff",
    glow: "rgba(106, 77, 255, 0.45)",
    wash: "#e6deff",
    mark: "✺",
    label: "Nightlife",
  },
  automobiles: {
    accent: "#0f9f8a",
    glow: "rgba(15, 159, 138, 0.4)",
    wash: "#d4f6ef",
    mark: "▸",
    label: "Automobiles",
  },
};

export const DEFAULT_THEME: FamilyTheme = {
  accent: "#ff2e8a",
  glow: "rgba(255, 46, 138, 0.3)",
  wash: "#ffe8f2",
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
