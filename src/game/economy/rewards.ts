/**
 * Soft-currency drip for a successful merge.
 * A 5-merge pays more than a 3-merge so the bonus is felt in the wallet too.
 */
export function mergeCashReward(
  sourceTier: number,
  fiveMerges: number,
  threeMerges: number,
): number {
  const tier = Math.max(1, sourceTier);
  return fiveMerges * 15 * tier + threeMerges * 5 * tier;
}
