import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/** The shopper's browsing-display currency choice — the actual list of currencies
 *  is admin-managed and fetched live via `useCurrencies()` (@/lib/hooks). */
interface CurrencyState {
    /** null = follow the store's default currency */
    selectedCode: string | null;
    setCurrency: (code: string | null) => void;
}

export const useCurrencyStore = create<CurrencyState>()(
    persist(
        (set) => ({
            selectedCode: null,
            setCurrency: (code) => set({ selectedCode: code }),
        }),
        { name: 'luxecart-currency' }
    )
);
