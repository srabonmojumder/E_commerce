'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useStore } from '@/store/useStore';
import toast from 'react-hot-toast';

export default function CartPage() {
    const cart = useStore((state) => state.cart);
    const removeFromCart = useStore((state) => state.removeFromCart);
    const updateQuantity = useStore((state) => state.updateQuantity);
    const getTotalPrice = useStore((state) => state.getTotalPrice);
    const clearCart = useStore((state) => state.clearCart);

    const totalPrice = getTotalPrice();
    const shipping = totalPrice > 50 ? 0 : 10;
    const tax = totalPrice * 0.1;
    const finalTotal = totalPrice + shipping + tax;

    const handleRemove = (id: number) => {
        removeFromCart(id);
        toast.success('Item removed from cart');
    };

    const handleClearCart = () => {
        clearCart();
        toast.success('Cart cleared');
    };

    if (cart.length === 0) {
        return (
            <div className="pt-20 min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 200 }}
                    >
                        <ShoppingBag className="w-32 h-32 mx-auto text-gray-300 dark:text-gray-600 mb-6" />
                    </motion.div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                        Your Cart is Empty
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-8">
                        Looks like you haven't added any items to your cart yet.
                    </p>
                    <Link href="/products">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="btn-primary inline-flex items-center gap-2"
                        >
                            Start Shopping
                            <ArrowRight className="w-5 h-5" />
                        </motion.button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="pt-20 min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex justify-between items-center mb-8">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl font-bold text-gray-900 dark:text-white"
                    >
                        Shopping Cart
                    </motion.h1>
                    <button
                        onClick={handleClearCart}
                        className="text-red-600 hover:text-red-700 font-medium"
                    >
                        Clear Cart
                    </button>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        {cart.map((item, index) => {
                            const discountedPrice = item.discount
                                ? item.price * (1 - item.discount / 100)
                                : item.price;

                            return (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="card"
                                >
                                    <div className="flex gap-4">
                                        {/* Product Image */}
                                        <div className="relative w-24 h-24 flex-shrink-0 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                                            <Image
                                                src={item.image}
                                                alt={item.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>

                                        {/* Product Info */}
                                        <div className="flex-1">
                                            <div className="flex justify-between">
                                                <div>
                                                    <Link
                                                        href={`/products/${item.id}`}
                                                        className="font-semibold text-gray-900 dark:text-white hover:text-primary-600 transition-colors"
                                                    >
                                                        {item.name}
                                                    </Link>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                                        {item.category}
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={() => handleRemove(item.id)}
                                                    className="text-red-600 hover:text-red-700 p-2"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>

                                            <div className="flex justify-between items-end mt-4">
                                                {/* Quantity Controls */}
                                                <div className="flex items-center gap-2 border border-gray-300 dark:border-gray-600 rounded-lg">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                                    >
                                                        <Minus className="w-4 h-4" />
                                                    </button>
                                                    <span className="w-12 text-center font-medium text-gray-900 dark:text-white">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                                    >
                                                        <Plus className="w-4 h-4" />
                                                    </button>
                                                </div>

                                                {/* Price */}
                                                <div className="text-right">
                                                    <div className="text-xl font-bold text-primary-600">
                                                        ${(discountedPrice * item.quantity).toFixed(2)}
                                                    </div>
                                                    {item.discount && (
                                                        <div className="text-sm text-gray-400 line-through">
                                                            ${(item.price * item.quantity).toFixed(2)}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="card sticky top-24"
                        >
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                                Order Summary
                            </h2>

                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                    <span>Subtotal</span>
                                    <span className="font-medium">${totalPrice.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                    <span>Shipping</span>
                                    <span className="font-medium">
                                        {shipping === 0 ? (
                                            <span className="text-green-600">FREE</span>
                                        ) : (
                                            `$${shipping.toFixed(2)}`
                                        )}
                                    </span>
                                </div>
                                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                    <span>Tax (10%)</span>
                                    <span className="font-medium">${tax.toFixed(2)}</span>
                                </div>
                                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                                    <div className="flex justify-between text-lg font-bold text-gray-900 dark:text-white">
                                        <span>Total</span>
                                        <span>${finalTotal.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>

                            {totalPrice < 50 && (
                                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-900 rounded-lg p-3 mb-6">
                                    <p className="text-sm text-yellow-800 dark:text-yellow-200">
                                        Add ${(50 - totalPrice).toFixed(2)} more for free shipping!
                                    </p>
                                </div>
                            )}

                            <Link href="/checkout">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="btn-primary w-full flex items-center justify-center gap-2 mb-4"
                                >
                                    Proceed to Checkout
                                    <ArrowRight className="w-5 h-5" />
                                </motion.button>
                            </Link>

                            <Link href="/products">
                                <button className="w-full btn-outline">
                                    Continue Shopping
                                </button>
                            </Link>

                            {/* Trust Badges */}
                            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                                    We accept:
                                </p>
                                <div className="flex gap-2">
                                    <div className="bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded text-xs font-medium">
                                        VISA
                                    </div>
                                    <div className="bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded text-xs font-medium">
                                        MASTERCARD
                                    </div>
                                    <div className="bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded text-xs font-medium">
                                        PAYPAL
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}
