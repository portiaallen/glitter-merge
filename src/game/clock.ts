/**
 * Injectable clock so timers, energy regen, and persistence timestamps
 * stay deterministic in tests.
 */
export interface Clock {
  now(): number;
}

export const systemClock: Clock = {
  now: () => Date.now(),
};

export function fixedClock(at: number): Clock {
  return { now: () => at };
}

export interface ControllableClock extends Clock {
  set(at: number): void;
  advance(ms: number): void;
}

export function controllableClock(start = 0): ControllableClock {
  let current = start;
  return {
    now: () => current,
    set: (at) => {
      current = at;
    },
    advance: (ms) => {
      current += ms;
    },
  };
}
