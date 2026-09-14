import { useRef, useState, type PointerEvent } from "react";
import {
  cellItemId,
  coordsEqual,
  getCell,
  type Coord,
  type GameState,
  type ItemCatalog,
} from "@game/index";
import { themeFor } from "../presentation";

interface BoardViewProps {
  state: GameState;
  catalog: ItemCatalog;
  selected: Coord | null;
  onSelect: (coord: Coord | null) => void;
  onDrop: (from: Coord, to: Coord) => void;
  onMerge: (at: Coord) => void;
}

function coordFromPoint(clientX: number, clientY: number): Coord | null {
  const node = document.elementFromPoint(clientX, clientY);
  const cell = node?.closest("[data-row][data-col]");
  if (!(cell instanceof HTMLElement)) return null;
  const row = Number(cell.dataset.row);
  const col = Number(cell.dataset.col);
  if (Number.isNaN(row) || Number.isNaN(col)) return null;
  return { row, col };
}

export function BoardView({
  state,
  catalog,
  selected,
  onSelect,
  onDrop,
  onMerge,
}: BoardViewProps) {
  const [dragging, setDragging] = useState<Coord | null>(null);
  const originRef = useRef<Coord | null>(null);

  const handlePointerDown = (coord: Coord, event: PointerEvent<HTMLButtonElement>) => {
    const cell = getCell(state.board, coord);
    if (selected && (!cell || cell.items.length === 0 || !coordsEqual(selected, coord))) {
      if (cell && cell.items.length > 0 && selected) {
        onDrop(selected, coord);
        onSelect(coord);
        return;
      }
      if (selected && (!cell || cell.items.length === 0)) {
        onDrop(selected, coord);
        onSelect(null);
        return;
      }
    }

    if (!cell || cell.items.length === 0) return;

    originRef.current = coord;
    setDragging(coord);
    onSelect(coord);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerUp = (event: PointerEvent<HTMLButtonElement>) => {
    const from = originRef.current;
    originRef.current = null;
    setDragging(null);
    if (!from) return;

    const to = coordFromPoint(event.clientX, event.clientY);
    if (!to || coordsEqual(from, to)) {
      const cell = getCell(state.board, from);
      if (cell && cell.items.length >= 3) {
        onMerge(from);
      }
      return;
    }
    onDrop(from, to);
    onSelect(to);
  };

  return (
    <div
      className="board"
      role="grid"
      aria-label="Merge board"
      style={{
        gridTemplateColumns: `repeat(${state.board.width}, minmax(0, 1fr))`,
      }}
    >
      {state.board.cells.flatMap((row, rowIndex) =>
        row.map((cell, colIndex) => {
          const coord = { row: rowIndex, col: colIndex };
          const item = cell.items[0]
            ? catalog.getItem(cell.items[0].itemId)
            : undefined;
          const theme = themeFor(item);
          const isSelected = selected ? coordsEqual(selected, coord) : false;
          const isDragging = dragging ? coordsEqual(dragging, coord) : false;
          const count = cell.items.length;
          const mergeable = count >= 3;

          return (
            <button
              key={`${rowIndex}-${colIndex}`}
              type="button"
              role="gridcell"
              data-row={rowIndex}
              data-col={colIndex}
              className={[
                "cell",
                item ? "filled" : "empty",
                isSelected ? "selected" : "",
                isDragging ? "dragging" : "",
                mergeable ? "mergeable" : "",
              ]
                .filter(Boolean)
                .join(" ")}
              style={
                item
                  ? {
                      borderColor: theme.accent,
                      boxShadow: `0 8px 20px ${theme.glow}`,
                    }
                  : undefined
              }
              aria-label={
                item
                  ? `${item.name}${count > 1 ? `, stack of ${count}` : ""}${
                      mergeable ? ", tap to merge" : ""
                    }`
                  : `Empty cell row ${rowIndex + 1}, column ${colIndex + 1}`
              }
              onPointerDown={(event) => handlePointerDown(coord, event)}
              onPointerUp={handlePointerUp}
            >
              {item ? (
                <>
                  <span className="mark" style={{ color: theme.accent }} aria-hidden="true">
                    {theme.mark}
                  </span>
                  <span className="tier">T{item.tier}</span>
                  <span className="name">{item.shortName}</span>
                  {count > 1 ? <span className="stack">{count}</span> : null}
                  {mergeable ? <span className="merge-chip">Merge</span> : null}
                </>
              ) : (
                <span className="empty-dot" aria-hidden="true" />
              )}
              <span className="sr-only">{cellItemId(cell) ?? "empty"}</span>
            </button>
          );
        }),
      )}
    </div>
  );
}
