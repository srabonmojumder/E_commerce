import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '@/store/useStore';

interface ComparisonState {
    compareProducts: Product[];
    addToCompare: (product: Product) => void;
    removeFromCompare: (id: number) => void;
    clearCompare: () => void;
}

export const useCompareStore = create<ComparisonState>()(
    persist(
        (set, get) => ({
            compareProducts: [],

            addToCompare: (product) => {
                const current = get().compareProducts;
                if (current.length >= 4) {
                    return; // Max 4 products
                }
                if (!current.find(p => p.id === product.id)) {
                    set({ compareProducts: [...current, product] });
                }
            },

            removeFromCompare: (id) => {
                set({ compareProducts: get().compareProducts.filter(p => p.id !== id) });
            },

            clearCompare: () => {
                set({ compareProducts: [] });
            },
        }),
        {
            name: 'compare-storage',
        }
    )
);
