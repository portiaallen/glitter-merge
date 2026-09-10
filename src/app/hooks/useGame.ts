import { useCallback, useEffect, useMemo, useState } from "react";
import {
  browserStorage,
  createInitialState,
  createLocalStoragePersistence,
  defaultCatalog,
  reduce,
  systemClock,
  type Coord,
  type GameAction,
  type GameEvent,
  type GameState,
} from "@game/index";

const TICK_MS = 500;

export function useGame() {
  const catalog = defaultCatalog;
  const clock = systemClock;
  const persistence = useMemo(
    () => createLocalStoragePersistence(browserStorage(), clock),
    [clock],
  );

  const [state, setState] = useState<GameState>(() => {
    return persistence.load()?.state ?? createInitialState(catalog, clock);
  });
  const [events, setEvents] = useState<readonly GameEvent[]>([]);
  const [selected, setSelected] = useState<Coord | null>(null);

  const dispatch = useCallback(
    (action: GameAction) => {
      const result = reduce(state, action, { catalog, clock });
      setState(result.state);
      persistence.save(result.state);
      setEvents(result.events);
      return result;
    },
    [catalog, clock, persistence, state],
  );

  useEffect(() => {
    const id = window.setInterval(() => {
      setState((current) => reduce(current, { type: "TICK" }, { catalog, clock }).state);
    }, TICK_MS);
    return () => window.clearInterval(id);
  }, [catalog, clock]);

  const reset = useCallback(() => {
    persistence.clear();
    const next = createInitialState(catalog, clock);
    setState(next);
    setSelected(null);
    setEvents([{ kind: "reset", message: "A fresh Glitter City corner." }]);
  }, [catalog, clock, persistence]);

  return {
    state,
    catalog,
    clock,
    events,
    selected,
    setSelected,
    dispatch,
    reset,
  };
}
