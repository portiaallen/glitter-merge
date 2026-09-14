import type { TimerId } from "../ids";

export type TimerKind =
  | "production"
  | "construction"
  | "upgrade"
  | "activity"
  | "event";

export interface TimerRecord {
  readonly id: TimerId;
  readonly kind: TimerKind;
  readonly startedAt: number;
  readonly durationMs: number;
  readonly pausedAt: number | null;
  readonly pausedElapsedMs: number;
  readonly speedMultiplier: number;
  readonly subjectId: string | null;
  readonly completed: boolean;
}

export interface TimerState {
  readonly byId: Readonly<Record<string, TimerRecord>>;
}

export function emptyTimerState(): TimerState {
  return { byId: {} };
}
