import type { Clock } from "../clock";
import { GAME_STATE_SCHEMA_VERSION, type GameState } from "../state/types";
import type { PersistedSave } from "./types";

export class PersistenceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PersistenceError";
  }
}

export function serialize(state: GameState, clock: Clock): string {
  const save: PersistedSave = {
    schemaVersion: state.schemaVersion,
    savedAt: clock.now(),
    state,
  };
  return JSON.stringify(save);
}

export function deserialize(raw: string): PersistedSave {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new PersistenceError("Save data is not valid JSON.");
  }
  if (!isPersistedSave(parsed)) {
    throw new PersistenceError("Save data is missing required fields.");
  }
  return migrate(parsed);
}

/**
 * Identity migration for schema v1. Future phases append cases here
 * instead of rewriting the live game state by hand.
 */
export function migrate(save: PersistedSave): PersistedSave {
  if (save.schemaVersion === GAME_STATE_SCHEMA_VERSION) {
    return save;
  }
  throw new PersistenceError(
    `Unsupported save schema ${save.schemaVersion}; expected ${GAME_STATE_SCHEMA_VERSION}.`,
  );
}

function isPersistedSave(value: unknown): value is PersistedSave {
  if (typeof value !== "object" || value === null) return false;
  const record = value as Record<string, unknown>;
  if (typeof record.schemaVersion !== "number") return false;
  if (typeof record.savedAt !== "number") return false;
  if (typeof record.state !== "object" || record.state === null) return false;
  const state = record.state as Record<string, unknown>;
  return (
    typeof state.schemaVersion === "number" &&
    typeof state.board === "object" &&
    typeof state.economy === "object" &&
    typeof state.timers === "object"
  );
}
