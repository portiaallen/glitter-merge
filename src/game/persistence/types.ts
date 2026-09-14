import type { GameState } from "../state/types";

export const SAVE_KEY = "glitter-merge.save.v1";

export interface PersistedSave {
  readonly schemaVersion: number;
  readonly savedAt: number;
  readonly state: GameState;
}

export interface PersistenceAdapter {
  load(): PersistedSave | null;
  save(state: GameState): void;
  clear(): void;
}
