import { useEffect, useState } from "react";
import {
  getCell,
  isEmptyCell,
  itemIdAt,
  mergeCoach,
  previewStack,
  stackCountAt,
  type Coord,
} from "@game/index";
import { playCue } from "./audio/cues";
import { BoardView } from "./components/BoardView";
import { CoachBanner } from "./components/CoachBanner";
import { CollectionScreen } from "./components/CollectionScreen";
import { DiscoveryModal } from "./components/DiscoveryModal";
import { FeedbackBar } from "./components/FeedbackBar";
import { GeneratorDock } from "./components/GeneratorDock";
import { Hud } from "./components/Hud";
import { InventoryTray } from "./components/InventoryTray";
import { useGame } from "./hooks/useGame";
import { Environment } from "./world/Environment";

export function App() {
  const { state, catalog, clock, events, selected, setSelected, dispatch, reset } =
    useGame();
  const [view, setView] = useState<"board" | "collection">("board");
  const [vaultIndex, setVaultIndex] = useState<number | null>(null);
  const [discoveryId, setDiscoveryId] = useState<string | null>(null);
  const [burstAt, setBurstAt] = useState<Coord | null>(null);
  const [burstBonus, setBurstBonus] = useState(false);

  useEffect(() => {
    const found = events.find((event) => event.kind === "discovered");
    if (found?.itemId) {
      setDiscoveryId(found.itemId);
      playCue("discover");
    }
    const merged = events.find((event) => event.kind === "merged");
    if (merged) {
      playCue((merged.fiveMerges ?? 0) > 0 ? "merge5" : "merge3");
    }
    const collected = events.find((event) => event.kind === "collected");
    if (collected) playCue("collect");
    if (events.some((event) => event.kind === "energy_failed" || event.kind === "drop_failed")) {
      playCue("error");
    }
  }, [events]);

  useEffect(() => {
    if (!discoveryId) return;
    const id = window.setTimeout(() => setDiscoveryId(null), 2800);
    return () => window.clearTimeout(id);
  }, [discoveryId]);

  const selectedCount = selected ? stackCountAt(state.board, selected) : 0;
  const selectedItemId = selected ? itemIdAt(state.board, selected) : null;
  const selectedItem = selectedItemId ? catalog.getItem(selectedItemId) : undefined;
  const preview = selectedItem
    ? previewStack(
        selectedItem.id,
        selectedCount,
        catalog,
        state.collection.discoveredItemIds,
      )
    : null;
  const coach = selectedItem
    ? mergeCoach(selectedCount, Boolean(catalog.nextTier(selectedItem.id)))
    : {
        tone: "idle" as const,
        label: "Stack 3 matching jewels. Keep 5 for a bonus.",
      };

  const drop = (from: Coord, to: Coord) => {
    const target = getCell(state.board, to);
    if (!target) return;
    if (isEmptyCell(target)) {
      dispatch({ type: "MOVE", from, to });
      return;
    }
    const result = dispatch({ type: "STACK", from, to });
    const stacked = result.events.find((event) => event.kind === "stacked");
    if (stacked && (stacked.count ?? 0) >= 3) {
      setBurstAt(to);
      setBurstBonus((stacked.count ?? 0) >= 5);
      window.setTimeout(() => setBurstAt(null), 700);
    }
  };

  const mergeAt = (at: Coord) => {
    const result = dispatch({ type: "MERGE_CELL", at });
    if (result.events.some((event) => event.kind === "merged")) {
      setBurstAt(at);
      setBurstBonus(result.events.some((event) => (event.fiveMerges ?? 0) > 0));
      window.setTimeout(() => setBurstAt(null), 900);
      setSelected(null);
    }
  };

  const handleBoardSelect = (coord: Coord | null) => {
    if (coord && vaultIndex !== null) {
      const cell = getCell(state.board, coord);
      if (cell && isEmptyCell(cell)) {
        dispatch({ type: "RECLAIM", inventoryIndex: vaultIndex, to: coord });
        setVaultIndex(null);
        setSelected(null);
        return;
      }
    }
    setVaultIndex(null);
    setSelected(coord);
  };

  return (
    <div className="stage">
      <Environment />
      <div className="stage-ui">
        <Hud state={state} catalog={catalog} onOpenCollection={() => setView("collection")} />
        <div className="grounds">
          <CoachBanner hint={coach} preview={preview?.hint ?? null} />
          <BoardView
            state={state}
            catalog={catalog}
            selected={selected}
            burstAt={burstAt}
            burstBonus={burstBonus}
            reclaimMode={vaultIndex !== null}
            onSelect={handleBoardSelect}
            onDrop={drop}
            onMerge={mergeAt}
          />
          <div className="apron">
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
            <InventoryTray
              state={state}
              catalog={catalog}
              selectedIndex={vaultIndex}
              onSelect={setVaultIndex}
              onReclaim={(index, to) =>
                dispatch({ type: "RECLAIM", inventoryIndex: index, to })
              }
            />
          </div>
        </div>
        <div className="stage-foot">
          <FeedbackBar events={events} />
          <button type="button" className="text-btn" onClick={reset}>
            New Game
          </button>
        </div>
      </div>
      {view === "collection" ? (
        <CollectionScreen
          state={state}
          catalog={catalog}
          onClose={() => setView("board")}
        />
      ) : null}
      {discoveryId ? (
        <DiscoveryModal
          itemId={discoveryId}
          catalog={catalog}
          onDismiss={() => setDiscoveryId(null)}
        />
      ) : null}
    </div>
  );
}
