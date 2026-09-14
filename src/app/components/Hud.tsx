import { formatEnergy } from "../presentation";
import type { GameState, ItemCatalog } from "@game/index";
import { CURRENCY_IDS } from "@game/index";

interface HudProps {
  state: GameState;
  catalog: ItemCatalog;
}

export function Hud({ state, catalog }: HudProps) {
  const area = catalog.getArea(state.world.unlockedAreaIds[0] ?? "");
  const cash = state.economy.wallet.balances[CURRENCY_IDS.glitterCash] ?? 0;
  const gems = state.economy.wallet.balances[CURRENCY_IDS.glitterGems] ?? 0;
  const discovered = state.collection.discoveredItemIds.length;
  const total = catalog.items().length;

  return (
    <header className="hud">
      <div className="hud-brand">
        <p className="eyebrow">Phase 0 · Foundation</p>
        <h1>Glitter Merge</h1>
        <p className="tagline">
          Build the most fabulous LGBTQ+ luxury destination imaginable.
        </p>
        <p className="area">{area?.name ?? "Glitter City"}</p>
      </div>
      <ul className="wallet" aria-label="Currencies">
        <li>
          <span aria-hidden="true">✦</span>
          <span className="wallet-value">{cash}</span>
          <span className="wallet-label">Cash</span>
        </li>
        <li>
          <span aria-hidden="true">◆</span>
          <span className="wallet-value">{gems}</span>
          <span className="wallet-label">Gems</span>
        </li>
        <li>
          <span aria-hidden="true">⚡</span>
          <span className="wallet-value">
            {formatEnergy(state.economy.energy.current, state.economy.energy.max)}
          </span>
          <span className="wallet-label">Energy</span>
        </li>
        <li>
          <span aria-hidden="true">♡</span>
          <span className="wallet-value">
            {discovered}/{total}
          </span>
          <span className="wallet-label">Looks</span>
        </li>
      </ul>
    </header>
  );
}
