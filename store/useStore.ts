import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Product {
    id: number;
    name: string;
    price: number;
    image: string;
    category: string;
    description: string;
    rating: number;
    reviews: number;
    inStock: boolean;
    discount?: number;
    stock?: number;
    colors?: string[];
    sizes?: string[];
    tags?: string[];
}

export interface CartItem extends Product {
    quantity: number;
}

interface StoreState {
    cart: CartItem[];
    wishlist: Product[];
    addToCart: (product: Product) => void;
    removeFromCart: (id: number) => void;
    updateQuantity: (id: number, quantity: number) => void;
    clearCart: () => void;
    addToWishlist: (product: Product) => void;
    removeFromWishlist: (id: number) => void;
    isInWishlist: (id: number) => boolean;
    getTotalPrice: () => number;
    getTotalItems: () => number;
}

export const useStore = create<StoreState>()(
    persist(
        (set, get) => ({
            cart: [],
            wishlist: [],

            addToCart: (product) => {
                const cart = get().cart;
                const existingItem = cart.find(item => item.id === product.id);

                if (existingItem) {
                    set({
                        cart: cart.map(item =>
                            item.id === product.id
                                ? { ...item, quantity: item.quantity + 1 }
                                : item
                        ),
                    });
                } else {
                    set({ cart: [...cart, { ...product, quantity: 1 }] });
                }
            },

            removeFromCart: (id) => {
                set({ cart: get().cart.filter(item => item.id !== id) });
            },

            updateQuantity: (id, quantity) => {
                if (quantity <= 0) {
                    get().removeFromCart(id);
                    return;
                }

                set({
                    cart: get().cart.map(item =>
                        item.id === id ? { ...item, quantity } : item
                    ),
                });
            },

            clearCart: () => {
                set({ cart: [] });
            },

            addToWishlist: (product) => {
                const wishlist = get().wishlist;
                if (!wishlist.find(item => item.id === product.id)) {
                    set({ wishlist: [...wishlist, product] });
                }
            },

            removeFromWishlist: (id) => {
                set({ wishlist: get().wishlist.filter(item => item.id !== id) });
            },

            isInWishlist: (id) => {
                return get().wishlist.some(item => item.id === id);
            },

            getTotalPrice: () => {
                return get().cart.reduce((total, item) => {
                    const price = item.discount
                        ? item.price * (1 - item.discount / 100)
                        : item.price;
                    return total + price * item.quantity;
                }, 0);
            },

            getTotalItems: () => {
                return get().cart.reduce((total, item) => total + item.quantity, 0);
            },
        }),
        {
            name: 'luxecart-storage',
        }
    )
);
