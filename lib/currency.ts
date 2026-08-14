import type { Settings } from './hooks';

type CurrencySettings = Pick<Settings, 'currencySymbol' | 'exchangeRate'>;

/** Prices are stored (and come back from the API) in USD; convert to the store's display currency. */
export function convertPrice(usdAmount: number, settings?: CurrencySettings): number {
    return usdAmount * (settings?.exchangeRate ?? 1);
}

/** Format a USD amount as the store's configured currency, e.g. "৳16,499.00". */
export function formatPrice(usdAmount: number, settings?: CurrencySettings): string {
    const amount = convertPrice(usdAmount, settings);
    const symbol = settings?.currencySymbol ?? '$';
    return `${symbol}${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
