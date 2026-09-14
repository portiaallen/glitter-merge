import type { CurrencyId } from "../ids";

export type EconomyRejectReason = "unknown_currency" | "insufficient_funds";

export interface WalletState {
  readonly balances: Readonly<Record<string, number>>;
}

export interface EnergyState {
  readonly current: number;
  readonly max: number;
  /** Fractional energy gained per millisecond. */
  readonly regenPerMs: number;
  readonly lastUpdatedAt: number;
}

export interface EconomyState {
  readonly wallet: WalletState;
  readonly energy: EnergyState;
}

export interface EconomyResult<T> {
  readonly ok: boolean;
  readonly reason: EconomyRejectReason | null;
  readonly value: T;
}

export function walletBalance(wallet: WalletState, currencyId: CurrencyId): number {
  return wallet.balances[currencyId] ?? 0;
}
