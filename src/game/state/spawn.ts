import { instanceId } from "../ids";
import type { ItemId } from "../ids";
import type { ItemInstance } from "../board/types";
import type { GameState } from "./types";

export function spawnInstances(
  state: GameState,
  itemId: ItemId,
  count: number,
): { state: GameState; instances: ItemInstance[] } {
  if (count <= 0) return { state, instances: [] };
  const instances: ItemInstance[] = [];
  let seq = state.nextInstanceSeq;
  for (let i = 0; i < count; i += 1) {
    instances.push({ instanceId: instanceId(seq), itemId });
    seq += 1;
  }
  return { state: { ...state, nextInstanceSeq: seq }, instances };
}
