import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '@/store/useStore';

interface RecentlyViewedState {
    recentProducts: Product[];
    addToRecentlyViewed: (product: Product) => void;
    clearRecentlyViewed: () => void;
}

export const useRecentlyViewedStore = create<RecentlyViewedState>()(
    persist(
        (set, get) => ({
            recentProducts: [],

            addToRecentlyViewed: (product) => {
                const current = get().recentProducts;
                // Remove if already exists
                const filtered = current.filter(p => p.id !== product.id);
                // Add to beginning
                const updated = [product, ...filtered].slice(0, 10); // Keep last 10
                set({ recentProducts: updated });
            },

            clearRecentlyViewed: () => {
                set({ recentProducts: [] });
            },
        }),
        {
            name: 'recently-viewed-storage',
        }
    )
);
