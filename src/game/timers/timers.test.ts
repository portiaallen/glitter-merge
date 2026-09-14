import { describe, expect, it } from "vitest";
import { controllableClock } from "../clock";
import {
  applySpeed,
  completeTimer,
  createTimer,
  isComplete,
  pauseTimer,
  progress01,
  remainingMs,
  resumeTimer,
  tickTimers,
  upsertTimer,
} from "./timers";
import { emptyTimerState } from "./types";

describe("timers", () => {
  it("counts down with an injectable clock", () => {
    const clock = controllableClock(1_000);
    const timer = createTimer(
      { id: "timer_1", kind: "production", durationMs: 8_000 },
      clock,
    );
    expect(remainingMs(timer, 1_000)).toBe(8_000);
    expect(remainingMs(timer, 5_000)).toBe(4_000);
    expect(progress01(timer, 5_000)).toBe(0.5);
    expect(isComplete(timer, 9_000)).toBe(true);
  });

  it("pauses and resumes without losing remaining time", () => {
    const clock = controllableClock(0);
    let timer = createTimer(
      { id: "timer_1", kind: "construction", durationMs: 10_000 },
      clock,
    );
    timer = pauseTimer(timer, 4_000);
    expect(remainingMs(timer, 20_000)).toBe(6_000);
    timer = resumeTimer(timer, 20_000);
    expect(remainingMs(timer, 22_000)).toBe(4_000);
  });

  it("applies speed multipliers and premium skip", () => {
    const clock = controllableClock(0);
    let timer = createTimer(
      { id: "timer_1", kind: "upgrade", durationMs: 10_000 },
      clock,
    );
    timer = applySpeed(timer, 2);
    expect(remainingMs(timer, 3_000)).toBe(4_000);
    timer = completeTimer(timer);
    expect(isComplete(timer, 3_000)).toBe(true);
  });

  it("marks finished timers during tick", () => {
    const clock = controllableClock(0);
    const timer = createTimer(
      { id: "timer_1", kind: "production", durationMs: 100 },
      clock,
    );
    const state = upsertTimer(emptyTimerState(), timer);
    const ticked = tickTimers(state, 100);
    expect(ticked.byId.timer_1?.completed).toBe(true);
  });
});
