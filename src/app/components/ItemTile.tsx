import type { ItemDefinition } from "@game/catalog/types";
import { rarityForTier, rarityLabel, themeFor } from "../presentation";

export type TileSize = "board" | "tray" | "collection" | "hero";

interface ItemTileProps {
  item: ItemDefinition | null;
  count?: number;
  selected?: boolean;
  validTarget?: boolean;
  invalidTarget?: boolean;
  dimmed?: boolean;
  locked?: boolean;
  lockedTier?: number;
  mergeable?: boolean;
  bonusMerge?: boolean;
  freshlyMerged?: boolean;
  size?: TileSize;
  onMerge?: () => void;
}

export function ItemTile({
  item,
  count = 1,
  selected = false,
  validTarget = false,
  invalidTarget = false,
  dimmed = false,
  locked = false,
  lockedTier,
  mergeable = false,
  bonusMerge = false,
  freshlyMerged = false,
  size = "board",
  onMerge,
}: ItemTileProps) {
  const theme = themeFor(item ?? undefined);
  const rarity = item ? rarityForTier(item.tier) : "common";
  const showMerge = Boolean(onMerge) && mergeable && !locked;

  if (locked) {
    return (
      <div className={`tile tile-${size} locked`} data-rarity={rarity}>
        <span className="mark" aria-hidden="true">
          🔒
        </span>
        <span className="tier">Tier {lockedTier ?? "?"}</span>
        <span className="name">Undiscovered</span>
      </div>
    );
  }

  if (!item) {
    return (
      <div className={`tile tile-${size} vacant`}>
        <span className="empty-dot" aria-hidden="true" />
        <span className="sr-only">Empty space</span>
      </div>
    );
  }

  return (
    <div
      className={[
        "tile",
        `tile-${size}`,
        selected ? "is-selected" : "",
        validTarget ? "is-valid" : "",
        invalidTarget ? "is-invalid" : "",
        dimmed ? "is-dim" : "",
        freshlyMerged ? "is-pop" : "",
        `rarity-${rarity}`,
      ]
        .filter(Boolean)
        .join(" ")}
      style={{
        borderColor: theme.accent,
        background: `linear-gradient(180deg, #ffffff 0%, ${theme.wash} 100%)`,
        boxShadow: `inset 0 1px 0 rgba(255,255,255,0.9), 0 10px 18px ${theme.glow}`,
      }}
      data-family={item.familyId}
      data-rarity={rarity}
    >
      <span className="mark" style={{ color: theme.accent }} aria-hidden="true">
        {theme.mark}
      </span>
      <span className="tier">
        T{item.tier} · {rarityLabel(rarity)}
      </span>
      <span className="name">{item.shortName}</span>
      {count > 1 ? <span className="stack">{count}</span> : null}
      {showMerge ? (
        <button
          type="button"
          className={bonusMerge ? "merge-chip bonus" : "merge-chip"}
          onPointerDown={(event) => event.stopPropagation()}
          onClick={(event) => {
            event.stopPropagation();
            onMerge?.();
          }}
        >
          {bonusMerge ? "✨ 5 MERGE BONUS!" : "3 to merge"}
        </button>
      ) : null}
    </div>
  );
}
