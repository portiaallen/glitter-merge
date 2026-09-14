import type { ItemCatalog } from "@game/index";
import type { ItemId } from "@game/ids";
import { ItemTile } from "./ItemTile";
import { themeFor } from "../presentation";

interface DiscoveryModalProps {
  itemId: ItemId;
  catalog: ItemCatalog;
  venueLine?: string | null;
  onDismiss: () => void;
}

export function DiscoveryModal({
  itemId,
  catalog,
  venueLine,
  onDismiss,
}: DiscoveryModalProps) {
  const item = catalog.getItem(itemId);
  if (!item) return null;
  const theme = themeFor(item);
  const family = catalog.getFamily(item.familyId);

  return (
    <div className="overlay-scrim discovery" role="dialog" aria-modal="true" aria-labelledby="discovery-title">
      <button type="button" className="discovery-jewel" onClick={onDismiss}>
        <p className="eyebrow">New discovery</p>
        <h2 id="discovery-title">A new look sparkles to life</h2>
        <div className="discovery-stage">
          <ItemTile item={item} size="hero" />
        </div>
        <p className="discovery-name" style={{ color: theme.accent }}>
          {item.name}
        </p>
        <p className="discovery-meta">
          Tier {item.tier} · {family?.name ?? theme.label}
        </p>
        {venueLine ? <p className="discovery-venue">{venueLine}</p> : null}
        <p className="discovery-hint">Tap to keep merging</p>
      </button>
    </div>
  );
}
