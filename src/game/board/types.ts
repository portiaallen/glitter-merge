import type { InstanceId, ItemId } from "../ids";

export interface Coord {
  readonly row: number;
  readonly col: number;
}

export interface ItemInstance {
  readonly instanceId: InstanceId;
  readonly itemId: ItemId;
}

export interface BoardCell {
  readonly items: readonly ItemInstance[];
}

export interface BoardState {
  readonly width: number;
  readonly height: number;
  readonly cells: readonly (readonly BoardCell[])[];
}

export const EMPTY_CELL: BoardCell = { items: [] };

export function coordsEqual(a: Coord, b: Coord): boolean {
  return a.row === b.row && a.col === b.col;
}

export function coordKey(coord: Coord): string {
  return `${coord.row}:${coord.col}`;
}
