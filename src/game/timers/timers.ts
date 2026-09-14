import type { Clock } from "../clock";
import type { TimerId } from "../ids";
import type { TimerKind, TimerRecord, TimerState } from "./types";

export interface CreateTimerInput {
  readonly id: TimerId;
  readonly kind: TimerKind;
  readonly durationMs: number;
  readonly subjectId?: string | null;
  readonly speedMultiplier?: number;
}

export function createTimer(
  input: CreateTimerInput,
  clock: Clock,
): TimerRecord {
  return {
    id: input.id,
    kind: input.kind,
    startedAt: clock.now(),
    durationMs: Math.max(0, input.durationMs),
    pausedAt: null,
    pausedElapsedMs: 0,
    speedMultiplier: input.speedMultiplier ?? 1,
    subjectId: input.subjectId ?? null,
    completed: input.durationMs <= 0,
  };
}

export function effectiveElapsedMs(timer: TimerRecord, now: number): number {
  if (timer.completed) return timer.durationMs;
  const end = timer.pausedAt ?? now;
  const raw = Math.max(0, end - timer.startedAt) - timer.pausedElapsedMs;
  return raw * timer.speedMultiplier;
}

export function remainingMs(timer: TimerRecord, now: number): number {
  if (timer.completed) return 0;
  return Math.max(0, timer.durationMs - effectiveElapsedMs(timer, now));
}

export function isComplete(timer: TimerRecord, now: number): boolean {
  if (timer.completed) return true;
  return remainingMs(timer, now) <= 0;
}

export function progress01(timer: TimerRecord, now: number): number {
  if (timer.durationMs <= 0) return 1;
  return Math.min(1, effectiveElapsedMs(timer, now) / timer.durationMs);
}

export function pauseTimer(timer: TimerRecord, now: number): TimerRecord {
  if (timer.pausedAt !== null || timer.completed) return timer;
  return { ...timer, pausedAt: now };
}

export function resumeTimer(timer: TimerRecord, now: number): TimerRecord {
  if (timer.pausedAt === null || timer.completed) return timer;
  const extraPaused = Math.max(0, now - timer.pausedAt);
  return {
    ...timer,
    pausedAt: null,
    pausedElapsedMs: timer.pausedElapsedMs + extraPaused,
  };
}

export function applySpeed(timer: TimerRecord, multiplier: number): TimerRecord {
  return { ...timer, speedMultiplier: Math.max(0, multiplier) };
}

/** Architecture hook for future premium / boost skips. */
export function completeTimer(timer: TimerRecord): TimerRecord {
  if (timer.completed) return timer;
  return { ...timer, completed: true, pausedAt: null };
}

export function upsertTimer(state: TimerState, timer: TimerRecord): TimerState {
  return { byId: { ...state.byId, [timer.id]: timer } };
}

export function removeTimer(state: TimerState, id: TimerId): TimerState {
  if (!(id in state.byId)) return state;
  const { [id]: _removed, ...rest } = state.byId;
  return { byId: rest };
}

export function getTimer(
  state: TimerState,
  id: TimerId,
): TimerRecord | undefined {
  return state.byId[id];
}

export function tickTimers(state: TimerState, now: number): TimerState {
  let changed = false;
  const next: Record<string, TimerRecord> = {};
  for (const [id, timer] of Object.entries(state.byId)) {
    if (!timer.completed && isComplete(timer, now)) {
      next[id] = { ...timer, completed: true };
      changed = true;
    } else {
      next[id] = timer;
    }
  }
  return changed ? { byId: next } : state;
}

export function restartTimer(
  timer: TimerRecord,
  durationMs: number,
  clock: Clock,
): TimerRecord {
  return createTimer(
    {
      id: timer.id,
      kind: timer.kind,
      durationMs,
      subjectId: timer.subjectId,
      speedMultiplier: timer.speedMultiplier,
    },
    clock,
  );
}
