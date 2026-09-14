import { describe, expect, it } from "vitest";
import {
  createEmptyBoard,
  findEmptyCells,
  getCell,
  inBounds,
  moveItems,
  placeItems,
  stackItems,
} from "./board";

const a = { instanceId: "inst_1", itemId: "beauty.lip_balm" };
const b = { instanceId: "inst_2", itemId: "beauty.lip_balm" };
const shirt = { instanceId: "inst_3", itemId: "fashion.basic_shirt" };

describe("board", () => {
  it("creates an empty grid", () => {
    const board = createEmptyBoard(3, 2);
    expect(board.width).toBe(3);
    expect(board.height).toBe(2);
    expect(findEmptyCells(board)).toHaveLength(6);
    expect(inBounds(board, { row: 1, col: 2 })).toBe(true);
    expect(inBounds(board, { row: 2, col: 0 })).toBe(false);
  });

  it("moves onto empty cells and rejects occupied moves", () => {
    let board = placeItems(createEmptyBoard(2, 2), { row: 0, col: 0 }, [a]);
    const moved = moveItems(board, { row: 0, col: 0 }, { row: 1, col: 1 });
    expect(moved).not.toBeNull();
    expect(getCell(moved!, { row: 1, col: 1 })?.items).toEqual([a]);
    expect(getCell(moved!, { row: 0, col: 0 })?.items).toEqual([]);

    board = placeItems(moved!, { row: 0, col: 0 }, [shirt]);
    expect(moveItems(board, { row: 0, col: 0 }, { row: 1, col: 1 })).toBeNull();
  });

  it("stacks identical items and rejects mixed stacks", () => {
    let board = placeItems(createEmptyBoard(2, 1), { row: 0, col: 0 }, [a]);
    board = placeItems(board, { row: 0, col: 1 }, [b]);
    const stacked = stackItems(board, { row: 0, col: 0 }, { row: 0, col: 1 });
    expect(stacked).not.toBeNull();
    expect(getCell(stacked!, { row: 0, col: 1 })?.items).toEqual([b, a]);
    expect(getCell(stacked!, { row: 0, col: 0 })?.items).toEqual([]);

    board = placeItems(createEmptyBoard(2, 1), { row: 0, col: 0 }, [a]);
    board = placeItems(board, { row: 0, col: 1 }, [shirt]);
    expect(stackItems(board, { row: 0, col: 0 }, { row: 0, col: 1 })).toBeNull();
  });
});
