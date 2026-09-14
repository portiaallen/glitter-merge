import { EMPTY_CELL, coordsEqual, type BoardCell, type BoardState, type Coord, type ItemInstance } from "./types";

export function createEmptyBoard(width: number, height: number): BoardState {
  const cells = Array.from({ length: height }, () =>
    Array.from({ length: width }, () => EMPTY_CELL),
  );
  return { width, height, cells };
}

export function inBounds(board: BoardState, coord: Coord): boolean {
  return (
    coord.row >= 0 &&
    coord.col >= 0 &&
    coord.row < board.height &&
    coord.col < board.width
  );
}

export function getCell(board: BoardState, coord: Coord): BoardCell | undefined {
  if (!inBounds(board, coord)) return undefined;
  return board.cells[coord.row]?.[coord.col];
}

export function requireCell(board: BoardState, coord: Coord): BoardCell {
  const cell = getCell(board, coord);
  if (!cell) {
    throw new Error(`Cell out of bounds: ${coord.row},${coord.col}`);
  }
  return cell;
}

export function setCell(
  board: BoardState,
  coord: Coord,
  cell: BoardCell,
): BoardState {
  if (!inBounds(board, coord)) return board;
  const cells = board.cells.map((row, rowIndex) => {
    if (rowIndex !== coord.row) return row;
    return row.map((existing, colIndex) =>
      colIndex === coord.col ? cell : existing,
    );
  });
  return { ...board, cells };
}

export function isEmptyCell(cell: BoardCell): boolean {
  return cell.items.length === 0;
}

export function cellItemId(cell: BoardCell): string | null {
  return cell.items[0]?.itemId ?? null;
}

export function cellsAreSameItem(a: BoardCell, b: BoardCell): boolean {
  const left = cellItemId(a);
  const right = cellItemId(b);
  return left !== null && left === right;
}

export function findEmptyCells(board: BoardState): Coord[] {
  const empty: Coord[] = [];
  for (let row = 0; row < board.height; row += 1) {
    for (let col = 0; col < board.width; col += 1) {
      const cell = board.cells[row]?.[col];
      if (cell && isEmptyCell(cell)) {
        empty.push({ row, col });
      }
    }
  }
  return empty;
}

export function placeItems(
  board: BoardState,
  coord: Coord,
  items: readonly ItemInstance[],
): BoardState {
  return setCell(board, coord, { items: [...items] });
}

export function clearCell(board: BoardState, coord: Coord): BoardState {
  return setCell(board, coord, EMPTY_CELL);
}

export function moveItems(
  board: BoardState,
  from: Coord,
  to: Coord,
): BoardState | null {
  if (coordsEqual(from, to)) return board;
  const source = getCell(board, from);
  const target = getCell(board, to);
  if (!source || !target) return null;
  if (isEmptyCell(source)) return null;
  if (!isEmptyCell(target)) return null;
  return clearCell(placeItems(board, to, source.items), from);
}

export function stackItems(
  board: BoardState,
  from: Coord,
  to: Coord,
): BoardState | null {
  if (coordsEqual(from, to)) return board;
  const source = getCell(board, from);
  const target = getCell(board, to);
  if (!source || !target) return null;
  if (isEmptyCell(source)) return null;
  if (isEmptyCell(target)) {
    return moveItems(board, from, to);
  }
  if (!cellsAreSameItem(source, target)) return null;
  return clearCell(
    placeItems(board, to, [...target.items, ...source.items]),
    from,
  );
}

export function allBoardItemIds(board: BoardState): string[] {
  const ids: string[] = [];
  for (const row of board.cells) {
    for (const cell of row) {
      for (const item of cell.items) {
        ids.push(item.itemId);
      }
    }
  }
  return ids;
}
