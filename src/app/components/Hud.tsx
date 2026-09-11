import { formatEnergy } from "../presentation";
import type { GameState, ItemCatalog } from "@game/index";
import { CURRENCY_IDS } from "@game/index";

interface HudProps {
  state: GameState;
  catalog: ItemCatalog;
  onOpenCollection: () => void;
}

export function Hud({ state, catalog, onOpenCollection }: HudProps) {
  const area = catalog.getArea(state.world.unlockedAreaIds[0] ?? "");
  const cash = state.economy.wallet.balances[CURRENCY_IDS.glitterCash] ?? 0;
  const gems = state.economy.wallet.balances[CURRENCY_IDS.glitterGems] ?? 0;
  const discovered = state.collection.discoveredItemIds.length;
  const total = catalog.items().length;
  const energy = state.economy.energy;

  return (
    <header className="hud">
      <div className="hud-row">
        <div className="hud-brand">
          <p className="eyebrow">Phase 1 · Merge feel</p>
          <h1>Glitter Merge</h1>
          <p className="area">{area?.name ?? "Glitter City"}</p>
        </div>
        <button
          type="button"
          className="btn collection-btn"
          onClick={onOpenCollection}
        >
          Looks {discovered}/{total}
        </button>
      </div>
      <ul className="wallet" aria-label="Currencies">
        <li>
          <span className="wallet-icon" aria-hidden="true">
            ✦
          </span>
          <span className="wallet-value">{cash}</span>
          <span className="wallet-label">Cash</span>
        </li>
        <li>
          <span className="wallet-icon" aria-hidden="true">
            ◆
          </span>
          <span className="wallet-value">{gems}</span>
          <span className="wallet-label">Gems</span>
        </li>
        <li>
          <span className="wallet-icon" aria-hidden="true">
            ⚡
          </span>
          <span className="wallet-value">{formatEnergy(energy.current, energy.max)}</span>
          <span className="wallet-label">Energy</span>
          <span
            className="energy-meter"
            aria-hidden="true"
            style={{ width: `${Math.min(100, (energy.current / energy.max) * 100)}%` }}
          />
        </li>
      </ul>
    </header>
  );
}
