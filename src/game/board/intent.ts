import { cellItemId, getCell, isEmptyCell } from "./board";
import { coordsEqual, type BoardState, type Coord } from "./types";
import { BONUS_MERGE_COUNT, MIN_MERGE_COUNT } from "../merge/types";

export type DropKind = "same" | "move" | "stack" | "invalid";

export function describeDrop(
  board: BoardState,
  from: Coord,
  to: Coord,
): DropKind {
  if (coordsEqual(from, to)) return "same";
  const source = getCell(board, from);
  const target = getCell(board, to);
  if (!source || !target || isEmptyCell(source)) return "invalid";
  if (isEmptyCell(target)) return "move";
  return cellItemId(source) === cellItemId(target) ? "stack" : "invalid";
}

export function matchingCoords(board: BoardState, itemId: string): Coord[] {
  const matches: Coord[] = [];
  for (let row = 0; row < board.height; row += 1) {
    for (let col = 0; col < board.width; col += 1) {
      const coord = { row, col };
      const cell = getCell(board, coord);
      if (cell && cellItemId(cell) === itemId) {
        matches.push(coord);
      }
    }
  }
  return matches;
}

export function stackCountAt(board: BoardState, coord: Coord): number {
  return getCell(board, coord)?.items.length ?? 0;
}

export function itemIdAt(board: BoardState, coord: Coord): string | null {
  const cell = getCell(board, coord);
  return cell ? cellItemId(cell) : null;
}

export type CoachTone = "idle" | "select" | "stack" | "merge3" | "almost5" | "bonus5";

export interface CoachHint {
  readonly tone: CoachTone;
  readonly label: string;
}

export function mergeCoach(stackCount: number, canUpgrade: boolean): CoachHint {
  if (!canUpgrade) {
    return { tone: "idle", label: "This look is already couture." };
  }
  if (stackCount >= BONUS_MERGE_COUNT) {
    return { tone: "bonus5", label: "✨ 5 MERGE BONUS!" };
  }
  if (stackCount === 4) {
    return { tone: "almost5", label: "One more for a 5 MERGE BONUS!" };
  }
  if (stackCount >= MIN_MERGE_COUNT) {
    return { tone: "merge3", label: "3 to merge — or keep stacking for a 5 bonus." };
  }
  if (stackCount === 2) {
    return { tone: "stack", label: "Need 1 more to merge. 5 makes two upgrades." };
  }
  return { tone: "select", label: "Stack 3 of a look to merge. Stack 5 for extra glam." };
}

export function potentialMatchCount(
  board: BoardState,
  selected: Coord,
): number {
  const id = itemIdAt(board, selected);
  if (!id) return 0;
  return matchingCoords(board, id).reduce((sum, coord) => {
    return sum + stackCountAt(board, coord);
  }, 0);
}
