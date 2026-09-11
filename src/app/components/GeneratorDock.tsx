import {
  COLLECT_ENERGY_COST,
  GENERATOR_IDS,
  remainingMs,
  type GameState,
  type ItemCatalog,
} from "@game/index";
import { formatMs } from "../presentation";

interface GeneratorDockProps {
  state: GameState;
  catalog: ItemCatalog;
  now: number;
  onCollect: () => void;
}

export function GeneratorDock({
  state,
  catalog,
  now,
  onCollect,
}: GeneratorDockProps) {
  const generator = state.generators.find(
    (entry) => entry.definitionId === GENERATOR_IDS.vanityCase,
  );
  const definition = generator
    ? catalog.getGenerator(generator.definitionId)
    : undefined;
  const timer = generator ? state.timers.byId[generator.timerId] : undefined;
  const ready = (generator?.storedCount ?? 0) > 0;
  const wait = timer ? remainingMs(timer, now) : 0;
  const energy = Math.floor(state.economy.energy.current);
  const canAfford = energy >= COLLECT_ENERGY_COST;
  const canCollect = ready && canAfford;

  let copy = `Next lip balm in ${formatMs(wait)}`;
  if (ready && canAfford) {
    copy = `${generator?.storedCount} ready · costs ${COLLECT_ENERGY_COST} Energy`;
  } else if (ready && !canAfford) {
    copy = "Energy recovering. Merge what's on the board.";
  }

  return (
    <section className="dock" aria-label="Vanity Case">
      <div>
        <p className="eyebrow">Producer</p>
        <h2>{definition?.name ?? "Vanity Case"}</h2>
        <p className="dock-copy">{copy}</p>
      </div>
      <button
        type="button"
        className={canCollect ? "btn primary" : "btn"}
        onClick={onCollect}
        disabled={!canCollect}
      >
        {canCollect ? `Collect · ${COLLECT_ENERGY_COST} Energy` : ready ? "Need energy" : "Working"}
      </button>
    </section>
  );
}
