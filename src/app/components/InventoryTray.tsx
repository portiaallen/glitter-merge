import type { Coord, GameState, ItemCatalog } from "@game/index";
import { ItemTile } from "./ItemTile";

interface InventoryTrayProps {
  state: GameState;
  catalog: ItemCatalog;
  selectedIndex: number | null;
  onSelect: (index: number | null) => void;
  onReclaim: (index: number, to: Coord | null) => void;
}

export function InventoryTray({
  state,
  catalog,
  selectedIndex,
  onSelect,
  onReclaim,
}: InventoryTrayProps) {
  if (state.inventory.length === 0) return null;

  return (
    <section className="clutch" aria-label="Overflow vault">
      <p className="clutch-label">Vault</p>
      <ul className="clutch-row">
        {state.inventory.map((entry, index) => {
          const item = catalog.getItem(entry.itemId) ?? null;
          const selected = selectedIndex === index;
          return (
            <li key={entry.instanceId}>
              <button
                type="button"
                className={selected ? "clutch-item selected" : "clutch-item"}
                aria-pressed={selected}
                aria-label={`${item?.name ?? "Look"} in vault${selected ? ", selected" : ""}`}
                onClick={() => {
                  if (selected) {
                    onReclaim(index, null);
                    onSelect(null);
                    return;
                  }
                  onSelect(index);
                }}
              >
                <ItemTile item={item} size="tray" selected={selected} />
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
