import { describe, expect, it } from "vitest";
import { placeItems } from "./board";
import { createEmptyBoard } from "./board";
import {
  describeDrop,
  matchingCoords,
  mergeCoach,
  potentialMatchCount,
  stackCountAt,
} from "./intent";

const lip = { instanceId: "a", itemId: "beauty.lip_balm" };
const lip2 = { instanceId: "b", itemId: "beauty.lip_balm" };
const shirt = { instanceId: "c", itemId: "fashion.basic_shirt" };

function seededBoard() {
  let board = createEmptyBoard(3, 2);
  board = placeItems(board, { row: 0, col: 0 }, [lip]);
  board = placeItems(board, { row: 0, col: 1 }, [lip2]);
  board = placeItems(board, { row: 1, col: 0 }, [shirt]);
  return board;
}

describe("describeDrop", () => {
  it("classifies move, stack, invalid, and same-cell drops", () => {
    const board = seededBoard();
    expect(describeDrop(board, { row: 0, col: 0 }, { row: 0, col: 0 })).toBe("same");
    expect(describeDrop(board, { row: 0, col: 0 }, { row: 1, col: 1 })).toBe("move");
    expect(describeDrop(board, { row: 0, col: 0 }, { row: 0, col: 1 })).toBe("stack");
    expect(describeDrop(board, { row: 0, col: 0 }, { row: 1, col: 0 })).toBe("invalid");
  });
});

describe("matchingCoords", () => {
  it("finds every cell sharing an item id", () => {
    const board = seededBoard();
    expect(matchingCoords(board, "beauty.lip_balm")).toEqual([
      { row: 0, col: 0 },
      { row: 0, col: 1 },
    ]);
    expect(stackCountAt(board, { row: 0, col: 0 })).toBe(1);
    expect(potentialMatchCount(board, { row: 0, col: 0 })).toBe(2);
  });
});

describe("mergeCoach", () => {
  it("teaches 3-vs-5 without a dump of tutorial copy", () => {
    expect(mergeCoach(1, true).tone).toBe("select");
    expect(mergeCoach(3, true)).toMatchObject({
      tone: "merge3",
      label: expect.stringContaining("3 to merge"),
    });
    expect(mergeCoach(4, true).tone).toBe("almost5");
    expect(mergeCoach(5, true)).toMatchObject({
      tone: "bonus5",
      label: "✨ 5 MERGE BONUS!",
    });
  });
});
