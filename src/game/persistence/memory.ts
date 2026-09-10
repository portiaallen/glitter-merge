import { systemClock, type Clock } from "../clock";
import { deserialize, serialize } from "./serialize";
import type { GameState } from "../state/types";
import type { PersistenceAdapter, PersistedSave } from "./types";

export function createMemoryPersistence(
  clock: Clock = systemClock,
): PersistenceAdapter & { snapshot(): string | null } {
  let raw: string | null = null;
  return {
    load(): PersistedSave | null {
      if (raw === null) return null;
      try {
        return deserialize(raw);
      } catch {
        return null;
      }
    },
    save(state: GameState): void {
      raw = serialize(state, clock);
    },
    clear(): void {
      raw = null;
    },
    snapshot(): string | null {
      return raw;
    },
  };
}
