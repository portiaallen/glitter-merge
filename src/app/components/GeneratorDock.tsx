import { GENERATOR_IDS, remainingMs, type GameState, type ItemCatalog } from "@game/index";
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

  return (
    <section className="dock" aria-label="Vanity Case">
      <div>
        <p className="eyebrow">Producer</p>
        <h2>{definition?.name ?? "Vanity Case"}</h2>
        <p className="dock-copy">
          {ready
            ? `${generator?.storedCount} ready to collect`
            : `Next lip balm in ${formatMs(wait)}`}
        </p>
      </div>
      <button
        type="button"
        className={ready ? "btn primary" : "btn"}
        onClick={onCollect}
        disabled={!ready}
      >
        {ready ? "Collect" : "Working"}
      </button>
    </section>
  );
}
