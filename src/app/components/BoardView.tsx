import { useRef, useState, type PointerEvent } from "react";
import {
  cellItemId,
  coordsEqual,
  describeDrop,
  getCell,
  matchingCoords,
  previewStack,
  type Coord,
  type GameState,
  type ItemCatalog,
} from "@game/index";
import { ItemTile } from "./ItemTile";

interface BoardViewProps {
  state: GameState;
  catalog: ItemCatalog;
  selected: Coord | null;
  burstAt: Coord | null;
  burstBonus: boolean;
  reclaimMode?: boolean;
  onSelect: (coord: Coord | null) => void;
  onDrop: (from: Coord, to: Coord) => void;
  onMerge: (at: Coord) => void;
}

const DRAG_THRESHOLD = 10;

function worldAnchor(row: number, col: number, width: number, height: number) {
  const socketWidth = Math.min(18, 78 / width);
  const socketHeight = Math.min(16, 78 / height);
  const x = 15 + (width > 1 ? (col / (width - 1)) * 70 : 35) + (row % 2 === 1 ? 2 : 0);
  const y = 13 + (height > 1 ? (row / (height - 1)) * 72 : 36);
  const lift = (row + 1) * 0.6 + (col % 2 === 0 ? 0.6 : 0);

  return {
    left: `${x - socketWidth / 2}%`,
    top: `${y - socketHeight / 2}%`,
    width: `${socketWidth}%`,
    height: `${socketHeight}%`,
    transform: `translateY(${lift}px) rotateX(12deg)`,
  };
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
  burstAt,
  burstBonus,
  reclaimMode = false,
  onSelect,
  onDrop,
  onMerge,
}: BoardViewProps) {
  const [dragging, setDragging] = useState<Coord | null>(null);
  const [hover, setHover] = useState<Coord | null>(null);
  const originRef = useRef<Coord | null>(null);
  const startRef = useRef<{ x: number; y: number } | null>(null);
  const draggingRef = useRef(false);
  const ghostRef = useRef<HTMLDivElement>(null);

  const selectedCell = selected ? getCell(state.board, selected) : undefined;
  const selectedId = selectedCell ? cellItemId(selectedCell) : null;
  const matchSet = new Set(
    selectedId
      ? matchingCoords(state.board, selectedId).map((coord) => `${coord.row}:${coord.col}`)
      : [],
  );

  const moveGhost = (x: number, y: number) => {
    const ghost = ghostRef.current;
    if (!ghost) return;
    ghost.style.transform = `translate(${x - 40}px, ${y - 52}px) scale(1.18) rotate(-8deg)`;
  };

  const handleTap = (coord: Coord) => {
    const cell = getCell(state.board, coord);
    if (selected && !coordsEqual(selected, coord)) {
      const kind = describeDrop(state.board, selected, coord);
      if (kind === "invalid") return;
      onDrop(selected, coord);
      onSelect(kind === "move" || kind === "stack" ? coord : null);
      return;
    }
    if (selected && coordsEqual(selected, coord)) {
      if (cell && cell.items.length >= 3) {
        onMerge(coord);
        return;
      }
      onSelect(null);
      return;
    }
    if (!cell || cell.items.length === 0) {
      onSelect(null);
      return;
    }
    onSelect(coord);
  };

  const handlePointerDown = (coord: Coord, event: PointerEvent<HTMLDivElement>) => {
    originRef.current = coord;
    startRef.current = { x: event.clientX, y: event.clientY };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const origin = originRef.current;
    const start = startRef.current;
    if (!origin || !start) return;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    if (!draggingRef.current && Math.hypot(dx, dy) >= DRAG_THRESHOLD) {
      const cell = getCell(state.board, origin);
      if (cell && cell.items.length > 0) {
        draggingRef.current = true;
        setDragging(origin);
        onSelect(origin);
      }
    }
    if (draggingRef.current) {
      moveGhost(event.clientX, event.clientY);
      setHover(coordFromPoint(event.clientX, event.clientY));
    }
  };

  const handlePointerUp = (event: PointerEvent<HTMLDivElement>) => {
    const from = originRef.current;
    const wasDragging = draggingRef.current;
    originRef.current = null;
    startRef.current = null;
    draggingRef.current = false;
    setDragging(null);
    setHover(null);
    if (!from) return;
    if (wasDragging) {
      const to = coordFromPoint(event.clientX, event.clientY);
      if (to && !coordsEqual(from, to)) {
        onDrop(from, to);
        onSelect(to);
      }
      return;
    }
    handleTap(from);
  };

  const dragItem = dragging
    ? catalog.getItem(getCell(state.board, dragging)?.items[0]?.itemId ?? "")
    : undefined;

  return (
    <div className="plot">
      <p className="terrace-plaque" aria-hidden="true">
        The Terrace
      </p>
      <div className="terrace-rail" aria-hidden="true" />
      <div className="terrace-rim" aria-hidden="true" />
      <div className="terrace-vein" aria-hidden="true" />
      <span className="corner-bloom nw" aria-hidden="true" />
      <span className="corner-bloom ne" aria-hidden="true" />
      <span className="corner-bloom sw" aria-hidden="true" />
      <span className="corner-bloom se" aria-hidden="true" />
      <div
        className="sockets"
        role="grid"
        aria-label="Merge field"
        aria-rowcount={state.board.height}
        aria-colcount={state.board.width}
      >
        {state.board.cells.flatMap((row, rowIndex) =>
          row.map((cell, colIndex) => {
            const coord = { row: rowIndex, col: colIndex };
            const item = cell.items[0]
              ? catalog.getItem(cell.items[0].itemId)
              : undefined;
            const isSelected = selected ? coordsEqual(selected, coord) : false;
            const isDragging = dragging ? coordsEqual(dragging, coord) : false;
            const isHover = hover ? coordsEqual(hover, coord) : false;
            const count = cell.items.length;
            const key = `${rowIndex}:${colIndex}`;
            const isMatch = Boolean(selectedId) && matchSet.has(key) && !isSelected;
            const drop = dragging ? describeDrop(state.board, dragging, coord) : null;
            const valid =
              isMatch ||
              (reclaimMode && count === 0) ||
              drop === "move" ||
              drop === "stack";
            const invalid = Boolean(dragging && drop === "invalid" && !isDragging);
            const preview = item
              ? previewStack(
                  item.id,
                  count,
                  catalog,
                  state.collection.discoveredItemIds,
                )
              : null;
            const bursting = burstAt ? coordsEqual(burstAt, coord) : false;

            const label = item
              ? `${item.name}, tier ${item.tier}, stack ${count}${
                  isMatch ? ", matching destination" : ""
                }${isSelected ? ", selected" : ""}${
                  preview?.canMerge ? `, ${preview.hint}` : ""
                }`
              : `Empty socket row ${rowIndex + 1}, column ${colIndex + 1}${
                  selected ? ", can move here" : ""
                }`;

            return (
              <div
                key={key}
                role="gridcell"
                tabIndex={0}
                data-row={rowIndex}
                data-col={colIndex}
                aria-rowindex={rowIndex + 1}
                aria-colindex={colIndex + 1}
                style={worldAnchor(
                  rowIndex,
                  colIndex,
                  state.board.width,
                  state.board.height,
                )}
                className={[
                  "socket",
                  item ? "filled" : "empty",
                  isSelected ? "selected" : "",
                  isDragging ? "dragging" : "",
                  valid ? "valid-target" : "",
                  invalid ? "invalid-target" : "",
                  isHover && dragging ? "drop-hover" : "",
                  bursting ? (burstBonus ? "burst-bonus" : "burst") : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                aria-label={label}
                aria-selected={isSelected}
                onPointerDown={(event) => handlePointerDown(coord, event)}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    handleTap(coord);
                  }
                }}
              >
                <ItemTile
                  item={item ?? null}
                  count={count}
                  selected={isSelected}
                  validTarget={isMatch}
                  invalidTarget={invalid}
                  dimmed={isDragging}
                  mergeable={Boolean(preview?.canMerge)}
                  bonusMerge={Boolean(preview?.bonus)}
                  freshlyMerged={bursting}
                  {...(preview?.canMerge ? { onMerge: () => onMerge(coord) } : {})}
                />
                {isMatch ? <span className="dest-label">Match</span> : null}
                {dragging && drop === "move" ? (
                  <span className="dest-label move">Move</span>
                ) : null}
                {reclaimMode && count === 0 ? (
                  <span className="dest-label move">Place</span>
                ) : null}
                {dragging && drop === "invalid" && !isDragging ? (
                  <span className="dest-label no">Can't</span>
                ) : null}
              </div>
            );
          }),
        )}
      </div>
      <div className="terrace-steps" aria-hidden="true" />
      {dragging && dragItem ? (
        <div ref={ghostRef} className="drag-ghost" aria-hidden="true">
          <ItemTile item={dragItem} count={getCell(state.board, dragging)?.items.length ?? 1} />
        </div>
      ) : null}
    </div>
  );
}
