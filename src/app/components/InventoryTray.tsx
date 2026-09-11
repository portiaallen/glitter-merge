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
    <section className="vault" aria-label="Overflow vault">
      <div>
        <p className="eyebrow">Vault</p>
        <p className="dock-copy">
          Extra looks wait here. Tap one, then tap an empty tile — stacks stay put.
        </p>
      </div>
      <ul className="vault-row">
        {state.inventory.map((entry, index) => {
          const item = catalog.getItem(entry.itemId) ?? null;
          const selected = selectedIndex === index;
          return (
            <li key={entry.instanceId}>
              <button
                type="button"
                className={selected ? "vault-item selected" : "vault-item"}
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
