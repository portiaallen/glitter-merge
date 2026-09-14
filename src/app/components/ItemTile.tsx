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
  const showMerge = Boolean(onMerge) && mergeable && selected && !locked;
  const tier = item?.tier ?? lockedTier ?? 1;

  if (locked) {
    return (
      <div className={`jewel jewel-${size} is-locked`} data-rarity={rarity}>
        <span className="socket-well" />
        <span className="jewel-body locked-body">
          <span className="jewel-mark" aria-hidden="true">
            🔒
          </span>
        </span>
        <span className="jewel-name">Tier {lockedTier ?? "?"}</span>
        <span className="sr-only">Undiscovered tier {lockedTier ?? "?"}</span>
      </div>
    );
  }

  if (!item) {
    return (
      <div className={`jewel jewel-${size} is-empty`}>
        <span className="socket-well" />
        <span className="sr-only">Empty socket</span>
      </div>
    );
  }

  return (
    <div
      className={[
        "jewel",
        `jewel-${size}`,
        selected ? "is-selected" : "",
        validTarget ? "is-valid" : "",
        invalidTarget ? "is-invalid" : "",
        dimmed ? "is-dim" : "",
        freshlyMerged ? "is-pop" : "",
        `rarity-${rarity}`,
        `tier-${item.tier}`,
      ]
        .filter(Boolean)
        .join(" ")}
      style={{
        ["--jewel-accent" as string]: theme.accent,
        ["--jewel-wash" as string]: theme.wash,
        ["--jewel-deep" as string]: theme.deep,
        ["--jewel-glow" as string]: theme.glow,
      }}
      data-family={item.familyId}
      data-rarity={rarity}
    >
      <span className="socket-well" aria-hidden="true" />
      <span className="jewel-shadow" aria-hidden="true" />
      <span className="jewel-body">
        <span className="jewel-facet" aria-hidden="true" />
        <span className="jewel-shine" aria-hidden="true" />
        {Array.from({ length: Math.min(tier, 5) }, (_, index) => (
          <span key={index} className={`jewel-pip pip-${index}`} aria-hidden="true" />
        ))}
        <span className="jewel-mark" style={{ color: theme.deep }} aria-hidden="true">
          {theme.mark}
        </span>
      </span>
      <span className="jewel-name">{item.shortName}</span>
      {size !== "board" && size !== "tray" ? (
        <span className="jewel-meta">
          T{item.tier} · {rarityLabel(rarity)}
        </span>
      ) : null}
      {count > 1 ? <span className="jewel-stack">{count}</span> : null}
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
          {bonusMerge ? "5 bonus" : "Merge 3"}
        </button>
      ) : null}
    </div>
  );
}
