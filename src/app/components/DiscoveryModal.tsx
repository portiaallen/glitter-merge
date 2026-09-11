import type { ItemCatalog } from "@game/index";
import type { ItemId } from "@game/ids";
import { ItemTile } from "./ItemTile";
import { themeFor } from "../presentation";

interface DiscoveryModalProps {
  itemId: ItemId;
  catalog: ItemCatalog;
  onDismiss: () => void;
}

export function DiscoveryModal({ itemId, catalog, onDismiss }: DiscoveryModalProps) {
  const item = catalog.getItem(itemId);
  if (!item) return null;
  const theme = themeFor(item);
  const family = catalog.getFamily(item.familyId);

  return (
    <div className="modal-scrim" role="dialog" aria-modal="true" aria-labelledby="discovery-title">
      <button type="button" className="discovery-card" onClick={onDismiss}>
        <p className="eyebrow">New discovery</p>
        <h2 id="discovery-title">You created a new look</h2>
        <div className="discovery-tile">
          <ItemTile item={item} size="hero" />
        </div>
        <p className="discovery-name" style={{ color: theme.accent }}>
          {item.name}
        </p>
        <p className="discovery-meta">
          Tier {item.tier} · {family?.name ?? theme.label}
        </p>
        <p className="discovery-hint">Tap to keep merging</p>
      </button>
    </div>
  );
}
