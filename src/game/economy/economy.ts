import type { ItemCatalog } from "../catalog/types";
import type { CurrencyId } from "../ids";
import type {
  EconomyResult,
  EconomyState,
  EnergyState,
  WalletState,
} from "./types";
import { walletBalance } from "./types";

function ok<T>(value: T): EconomyResult<T> {
  return { ok: true, reason: null, value };
}

function fail<T>(reason: EconomyResult<T>["reason"], value: T): EconomyResult<T> {
  return { ok: false, reason, value };
}

export function grant(
  wallet: WalletState,
  currencyId: CurrencyId,
  amount: number,
  catalog: ItemCatalog,
): EconomyResult<WalletState> {
  if (!catalog.getCurrency(currencyId)) {
    return fail("unknown_currency", wallet);
  }
  if (amount <= 0) return ok(wallet);
  const next = walletBalance(wallet, currencyId) + amount;
  return ok({
    balances: { ...wallet.balances, [currencyId]: next },
  });
}

export function spend(
  wallet: WalletState,
  currencyId: CurrencyId,
  amount: number,
  catalog: ItemCatalog,
): EconomyResult<WalletState> {
  if (!catalog.getCurrency(currencyId)) {
    return fail("unknown_currency", wallet);
  }
  if (amount <= 0) return ok(wallet);
  const current = walletBalance(wallet, currencyId);
  if (current < amount) {
    return fail("insufficient_funds", wallet);
  }
  return ok({
    balances: { ...wallet.balances, [currencyId]: current - amount },
  });
}

export function canAfford(
  wallet: WalletState,
  currencyId: CurrencyId,
  amount: number,
): boolean {
  return walletBalance(wallet, currencyId) >= amount;
}

/**
 * Regenerates energy using an injectable `now`. Caps at max.
 * Stores leftover partial progress via lastUpdatedAt.
 */
export function tickEnergy(energy: EnergyState, now: number): EnergyState {
  if (energy.current >= energy.max) {
    if (energy.lastUpdatedAt === now) return energy;
    return { ...energy, lastUpdatedAt: now };
  }
  if (energy.regenPerMs <= 0) return energy;
  const elapsed = Math.max(0, now - energy.lastUpdatedAt);
  const gained = Math.floor(elapsed * energy.regenPerMs);
  if (gained <= 0) return energy;
  const nextCurrent = Math.min(energy.max, energy.current + gained);
  const consumedMs = gained / energy.regenPerMs;
  return {
    ...energy,
    current: nextCurrent,
    lastUpdatedAt:
      nextCurrent >= energy.max ? now : energy.lastUpdatedAt + consumedMs,
  };
}

export function spendEnergy(
  energy: EnergyState,
  amount: number,
  now: number,
): EconomyResult<EnergyState> {
  const ticked = tickEnergy(energy, now);
  if (amount <= 0) return ok(ticked);
  if (ticked.current < amount) {
    return fail("insufficient_funds", ticked);
  }
  return ok({
    ...ticked,
    current: ticked.current - amount,
    lastUpdatedAt: now,
  });
}

export function tickEconomy(economy: EconomyState, now: number): EconomyState {
  const energy = tickEnergy(economy.energy, now);
  if (energy === economy.energy) return economy;
  return { ...economy, energy };
}
