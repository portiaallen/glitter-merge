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

  let copy = `Next in ${formatMs(wait)}`;
  if (ready && canAfford) {
    copy = `${generator?.storedCount} ready · ${COLLECT_ENERGY_COST} Energy`;
  } else if (ready && !canAfford) {
    copy = "Energy recovering";
  }

  return (
    <section className="vanity-prop" aria-label="Vanity Case">
      <div className="vanity-case" aria-hidden="true">
        <span className="vanity-lid" />
        <span className="vanity-body" />
        <span className="vanity-clasp" />
      </div>
      <div className="vanity-copy">
        <h2>{definition?.name ?? "Vanity Case"}</h2>
        <p>{copy}</p>
      </div>
      <button
        type="button"
        className={canCollect ? "jewel-btn ready" : "jewel-btn"}
        onClick={onCollect}
        disabled={!canCollect}
      >
        {canCollect ? "Collect" : ready ? "Need energy" : "Working"}
      </button>
    </section>
  );
}
