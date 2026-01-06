'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Package, Mail } from 'lucide-react';
import Link from 'next/link';

export default function OrderSuccessPage() {
    const [orderNumber, setOrderNumber] = useState<string | null>(null);

    useEffect(() => {
        // Generate order number only on client side to avoid hydration mismatch
        setOrderNumber(`LUX-${Math.random().toString(36).substr(2, 9).toUpperCase()}`);
    }, []);

    return (
        <div className="pt-20 min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                >
                    <CheckCircle className="w-24 h-24 mx-auto text-green-500 mb-6" />
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4"
                >
                    Order Placed Successfully!
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-lg text-gray-600 dark:text-gray-400 mb-8"
                >
                    Thank you for your purchase. Your order has been confirmed.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="card inline-block mb-8"
                >
                    <div className="flex items-center gap-3 mb-4">
                        <Package className="w-6 h-6 text-primary-600" />
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Order Number
                        </h3>
                    </div>
                    <p className="text-2xl font-bold text-primary-600">
                        {orderNumber || (
                            <span className="inline-block w-40 h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                        )}
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-900 rounded-xl p-6 mb-8"
                >
                    <Mail className="w-8 h-8 mx-auto text-blue-600 dark:text-blue-400 mb-3" />
                    <p className="text-gray-700 dark:text-gray-300">
                        We've sent a confirmation email with order details and tracking information.
                    </p>
                </motion.div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="/products">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="btn-primary"
                        >
                            Continue Shopping
                        </motion.button>
                    </Link>
                    <Link href="/account">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="btn-outline"
                        >
                            View Orders
                        </motion.button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
