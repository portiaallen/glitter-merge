/**
 * Presentation-only lookups. The game engine never imports this file.
 */
import type { ItemDefinition } from "@game/catalog/types";

export interface FamilyTheme {
  readonly accent: string;
  readonly glow: string;
  readonly mark: string;
}

export const FAMILY_THEMES: Readonly<Record<string, FamilyTheme>> = {
  beauty: { accent: "#ff4d8d", glow: "rgba(255, 77, 141, 0.35)", mark: "✦" },
  fashion: { accent: "#c44dff", glow: "rgba(196, 77, 255, 0.35)", mark: "✿" },
  jewelry: { accent: "#e8b86d", glow: "rgba(232, 184, 109, 0.4)", mark: "◆" },
  real_estate: { accent: "#6ec8ff", glow: "rgba(110, 200, 255, 0.35)", mark: "▣" },
  nightlife: { accent: "#7b5cff", glow: "rgba(123, 92, 255, 0.4)", mark: "✺" },
  automobiles: { accent: "#2ec9b5", glow: "rgba(46, 201, 181, 0.35)", mark: "▸" },
};

export const DEFAULT_THEME: FamilyTheme = {
  accent: "#ff2e8a",
  glow: "rgba(255, 46, 138, 0.3)",
  mark: "★",
};

export function themeFor(item: ItemDefinition | undefined): FamilyTheme {
  if (!item) return DEFAULT_THEME;
  return FAMILY_THEMES[item.familyId] ?? DEFAULT_THEME;
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
