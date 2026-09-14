import type { AreaId } from "../ids";
import { AREA_IDS } from "../data/areas";

export interface WorldState {
  readonly unlockedAreaIds: readonly AreaId[];
}

export function createStartingWorld(): WorldState {
  return { unlockedAreaIds: [AREA_IDS.glitterNeighborhood] };
}

export function isAreaUnlocked(world: WorldState, areaId: AreaId): boolean {
  return world.unlockedAreaIds.includes(areaId);
}
