/** Prices are stored in USD; this converts to the store's display/charge currency. */
export function convertAmount(usdAmount: number, exchangeRate: number): number {
  return usdAmount * exchangeRate;
}

export function formatMoney(usdAmount: number, currencySymbol: string, exchangeRate: number): string {
  return `${currencySymbol}${convertAmount(usdAmount, exchangeRate).toFixed(2)}`;
}
