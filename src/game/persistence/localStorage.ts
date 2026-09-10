import { systemClock, type Clock } from "../clock";
import { deserialize, serialize } from "./serialize";
import type { GameState } from "../state/types";
import type { PersistenceAdapter, PersistedSave } from "./types";
import { SAVE_KEY } from "./types";

export function createLocalStoragePersistence(
  storage: Pick<Storage, "getItem" | "setItem" | "removeItem"> | null,
  clock: Clock = systemClock,
  key = SAVE_KEY,
): PersistenceAdapter {
  return {
    load(): PersistedSave | null {
      if (!storage) return null;
      const raw = storage.getItem(key);
      if (!raw) return null;
      try {
        return deserialize(raw);
      } catch {
        return null;
      }
    },
    save(state: GameState): void {
      if (!storage) return;
      storage.setItem(key, serialize(state, clock));
    },
    clear(): void {
      storage?.removeItem(key);
    },
  };
}

export function browserStorage(): Storage | null {
  try {
    if (typeof localStorage === "undefined") return null;
    return localStorage;
  } catch {
    return null;
  }
}
