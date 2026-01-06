'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Lock, ArrowLeft, Check } from 'lucide-react';
import { useStore } from '@/store/useStore';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function CheckoutPage() {
    const router = useRouter();
    const cart = useStore((state) => state.cart);
    const getTotalPrice = useStore((state) => state.getTotalPrice);
    const clearCart = useStore((state) => state.clearCart);

    const [formData, setFormData] = useState({
        email: '',
        firstName: '',
        lastName: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
        cardNumber: '',
        cardName: '',
        expiryDate: '',
        cvv: '',
    });

    const [isProcessing, setIsProcessing] = useState(false);

    const totalPrice = getTotalPrice();
    const shipping = totalPrice > 50 ? 0 : 10;
    const tax = totalPrice * 0.1;
    const finalTotal = totalPrice + shipping + tax;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);

        // Simulate payment processing
        setTimeout(() => {
            setIsProcessing(false);
            clearCart();
            toast.success('Order placed successfully!');
            router.push('/order-success');
        }, 2000);
    };

    if (cart.length === 0) {
        return (
            <div className="pt-20 min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                        No Items to Checkout
                    </h2>
                    <Link href="/products">
                        <button className="btn-primary">Browse Products</button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="pt-20 min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <Link href="/cart" className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-8">
                    <ArrowLeft className="w-5 h-5" />
                    Back to Cart
                </Link>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl font-bold text-gray-900 dark:text-white mb-8"
                >
                    Checkout
                </motion.h1>

                <form onSubmit={handleSubmit}>
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Checkout Form */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Contact Information */}
                            <div className="card">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                                    Contact Information
                                </h2>
                                <div className="space-y-4">
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Email address"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="input-field"
                                    />
                                </div>
                            </div>

                            {/* Shipping Address */}
                            <div className="card">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                                    Shipping Address
                                </h2>
                                <div className="grid grid-cols-2 gap-4">
                                    <input
                                        type="text"
                                        name="firstName"
                                        placeholder="First name"
                                        required
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        className="input-field"
                                    />
                                    <input
                                        type="text"
                                        name="lastName"
                                        placeholder="Last name"
                                        required
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        className="input-field"
                                    />
                                    <input
                                        type="text"
                                        name="address"
                                        placeholder="Street address"
                                        required
                                        value={formData.address}
                                        onChange={handleChange}
                                        className="input-field col-span-2"
                                    />
                                    <input
                                        type="text"
                                        name="city"
                                        placeholder="City"
                                        required
                                        value={formData.city}
                                        onChange={handleChange}
                                        className="input-field"
                                    />
                                    <input
                                        type="text"
                                        name="state"
                                        placeholder="State/Province"
                                        required
                                        value={formData.state}
                                        onChange={handleChange}
                                        className="input-field"
                                    />
                                    <input
                                        type="text"
                                        name="zipCode"
                                        placeholder="ZIP/Postal code"
                                        required
                                        value={formData.zipCode}
                                        onChange={handleChange}
                                        className="input-field"
                                    />
                                    <input
                                        type="text"
                                        name="country"
                                        placeholder="Country"
                                        required
                                        value={formData.country}
                                        onChange={handleChange}
                                        className="input-field"
                                    />
                                </div>
                            </div>

                            {/* Payment Information */}
                            <div className="card">
                                <div className="flex items-center gap-2 mb-6">
                                    <Lock className="w-5 h-5 text-green-600" />
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                        Payment Information
                                    </h2>
                                </div>
                                <div className="space-y-4">
                                    <input
                                        type="text"
                                        name="cardNumber"
                                        placeholder="Card number"
                                        required
                                        value={formData.cardNumber}
                                        onChange={handleChange}
                                        className="input-field"
                                        maxLength={16}
                                    />
                                    <input
                                        type="text"
                                        name="cardName"
                                        placeholder="Cardholder name"
                                        required
                                        value={formData.cardName}
                                        onChange={handleChange}
                                        className="input-field"
                                    />
                                    <div className="grid grid-cols-2 gap-4">
                                        <input
                                            type="text"
                                            name="expiryDate"
                                            placeholder="MM/YY"
                                            required
                                            value={formData.expiryDate}
                                            onChange={handleChange}
                                            className="input-field"
                                            maxLength={5}
                                        />
                                        <input
                                            type="text"
                                            name="cvv"
                                            placeholder="CVV"
                                            required
                                            value={formData.cvv}
                                            onChange={handleChange}
                                            className="input-field"
                                            maxLength={3}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="card sticky top-24">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                                    Order Summary
                                </h2>

                                <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                                    {cart.map((item) => {
                                        const price = item.discount
                                            ? item.price * (1 - item.discount / 100)
                                            : item.price;

                                        return (
                                            <div key={item.id} className="flex justify-between text-sm">
                                                <span className="text-gray-600 dark:text-gray-400">
                                                    {item.name} x {item.quantity}
                                                </span>
                                                <span className="font-medium text-gray-900 dark:text-white">
                                                    ${(price * item.quantity).toFixed(2)}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-3">
                                    <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                        <span>Subtotal</span>
                                        <span>${totalPrice.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                        <span>Shipping</span>
                                        <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                        <span>Tax</span>
                                        <span>${tax.toFixed(2)}</span>
                                    </div>
                                    <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                                        <div className="flex justify-between text-xl font-bold text-gray-900 dark:text-white">
                                            <span>Total</span>
                                            <span>${finalTotal.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>

                                <motion.button
                                    whileHover={{ scale: isProcessing ? 1 : 1.02 }}
                                    whileTap={{ scale: isProcessing ? 1 : 0.98 }}
                                    type="submit"
                                    disabled={isProcessing}
                                    className="w-full btn-primary mt-6 flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {isProcessing ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            <CreditCard className="w-5 h-5" />
                                            Place Order
                                        </>
                                    )}
                                </motion.button>

                                <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-4">
                                    Your payment information is secure and encrypted
                                </p>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
