import { describe, expect, it } from "vitest";
import { defaultCatalog } from "../catalog/defaultCatalog";
import { CURRENCY_IDS } from "../data/currencies";
import { canAfford, grant, spend, spendEnergy, tickEnergy } from "./economy";
import type { EnergyState, WalletState } from "./types";

const emptyWallet: WalletState = { balances: {} };

describe("wallet", () => {
  it("grants and spends known currencies", () => {
    const granted = grant(emptyWallet, CURRENCY_IDS.glitterCash, 100, defaultCatalog);
    expect(granted.ok).toBe(true);
    expect(granted.value.balances[CURRENCY_IDS.glitterCash]).toBe(100);
    expect(canAfford(granted.value, CURRENCY_IDS.glitterCash, 40)).toBe(true);

    const spent = spend(granted.value, CURRENCY_IDS.glitterCash, 40, defaultCatalog);
    expect(spent.ok).toBe(true);
    expect(spent.value.balances[CURRENCY_IDS.glitterCash]).toBe(60);
  });

  it("rejects unknown currencies and overdrafts", () => {
    expect(grant(emptyWallet, "event_tokens", 1, defaultCatalog).reason).toBe(
      "unknown_currency",
    );
    const granted = grant(emptyWallet, CURRENCY_IDS.glitterGems, 2, defaultCatalog);
    expect(spend(granted.value, CURRENCY_IDS.glitterGems, 3, defaultCatalog).reason).toBe(
      "insufficient_funds",
    );
  });
});

describe("energy", () => {
  const full: EnergyState = {
    current: 10,
    max: 25,
    regenPerMs: 1 / 1000,
    lastUpdatedAt: 0,
  };

  it("regenerates from elapsed time and caps at max", () => {
    const ticked = tickEnergy(full, 5_000);
    expect(ticked.current).toBe(15);
    const capped = tickEnergy(ticked, 60_000);
    expect(capped.current).toBe(25);
  });

  it("spends energy after ticking", () => {
    const spent = spendEnergy(full, 3, 2_000);
    expect(spent.ok).toBe(true);
    expect(spent.value.current).toBe(9);
  });
});
