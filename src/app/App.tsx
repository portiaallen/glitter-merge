import { getCell, isEmptyCell } from "@game/index";
import { BoardView } from "./components/BoardView";
import { GeneratorDock } from "./components/GeneratorDock";
import { Hud } from "./components/Hud";
import { useGame } from "./hooks/useGame";
import type { Coord } from "@game/index";

export function App() {
  const { state, catalog, clock, events, selected, setSelected, dispatch, reset } =
    useGame();
  const latest = events[events.length - 1];
  const inventoryCount = state.inventory.length;

  const drop = (from: Coord, to: Coord) => {
    const target = getCell(state.board, to);
    if (!target) return;
    if (isEmptyCell(target)) {
      dispatch({ type: "MOVE", from, to });
      return;
    }
    dispatch({ type: "STACK", from, to });
  };

  return (
    <div className="shell">
      <div className="rainbow" aria-hidden="true" />
      <Hud state={state} catalog={catalog} />
      <GeneratorDock
        state={state}
        catalog={catalog}
        now={clock.now()}
        onCollect={() =>
          dispatch({
            type: "COLLECT_GENERATOR",
            generatorId: "vanity_case",
            to: null,
          })
        }
      />
      <p className="help">
        Drag matching looks onto each other, or tap to select then tap a
        destination. Stack <strong>3</strong> to merge, <strong>5</strong> for
        extra glam.
      </p>
      <BoardView
        state={state}
        catalog={catalog}
        selected={selected}
        onSelect={setSelected}
        onDrop={drop}
        onMerge={(at) => dispatch({ type: "MERGE_CELL", at })}
      />
      {inventoryCount > 0 ? (
        <p className="inventory-note" role="status">
          Overflow vault: {inventoryCount} look
          {inventoryCount === 1 ? "" : "s"} waiting for an open tile.
        </p>
      ) : null}
      <footer className="footer">
        <p className="status" role="status">
          {latest?.message ?? "Welcome to Glitter Neighborhood."}
        </p>
        <button type="button" className="btn ghost" onClick={reset}>
          New Game
        </button>
      </footer>
    </div>
  );
}
