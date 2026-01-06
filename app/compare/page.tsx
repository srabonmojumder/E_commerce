'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { X, Check } from 'lucide-react';
import { useCompareStore } from '@/store/useCompareStore';

export default function ComparePage() {
    const compareProducts = useCompareStore((state) => state.compareProducts);
    const removeFromCompare = useCompareStore((state) => state.removeFromCompare);
    const clearCompare = useCompareStore((state) => state.clearCompare);

    if (compareProducts.length === 0) {
        return (
            <div className="pt-20 min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                        No Products to Compare
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-8">
                        Start adding products to compare their features
                    </p>
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
                <div className="flex justify-between items-center mb-8">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl font-bold text-gray-900 dark:text-white"
                    >
                        Compare Products
                    </motion.h1>
                    <button onClick={clearCompare} className="text-red-600 hover:text-red-700 font-medium">
                        Clear All
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg">
                        <thead>
                            <tr className="border-b border-gray-200 dark:border-gray-700">
                                <th className="p-4 text-left font-semibold text-gray-900 dark:text-white">
                                    Feature
                                </th>
                                {compareProducts.map((product) => (
                                    <th key={product.id} className="p-4 min-w-[200px]">
                                        <div className="relative">
                                            <button
                                                onClick={() => removeFromCompare(product.id)}
                                                className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                            <div className="relative h-48 mb-3 rounded-lg overflow-hidden">
                                                <Image src={product.image} alt={product.name} fill className="object-cover" />
                                            </div>
                                            <Link
                                                href={`/products/${product.id}`}
                                                className="font-semibold text-gray-900 dark:text-white hover:text-purple-600"
                                            >
                                                {product.name}
                                            </Link>
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b border-gray-200 dark:border-gray-700">
                                <td className="p-4 font-medium text-gray-900 dark:text-white">Price</td>
                                {compareProducts.map((product) => (
                                    <td key={product.id} className="p-4 text-center">
                                        <div className="text-2xl font-bold text-purple-600">
                                            ${product.price.toFixed(2)}
                                        </div>
                                    </td>
                                ))}
                            </tr>
                            <tr className="border-b border-gray-200 dark:border-gray-700">
                                <td className="p-4 font-medium text-gray-900 dark:text-white">Category</td>
                                {compareProducts.map((product) => (
                                    <td key={product.id} className="p-4 text-center text-gray-600 dark:text-gray-400">
                                        {product.category}
                                    </td>
                                ))}
                            </tr>
                            <tr className="border-b border-gray-200 dark:border-gray-700">
                                <td className="p-4 font-medium text-gray-900 dark:text-white">Rating</td>
                                {compareProducts.map((product) => (
                                    <td key={product.id} className="p-4 text-center">
                                        <div className="flex items-center justify-center gap-1">
                                            <span className="text-yellow-400 font-bold">{product.rating}</span>
                                            <span className="text-gray-500">/ 5.0</span>
                                        </div>
                                    </td>
                                ))}
                            </tr>
                            <tr className="border-b border-gray-200 dark:border-gray-700">
                                <td className="p-4 font-medium text-gray-900 dark:text-white">Reviews</td>
                                {compareProducts.map((product) => (
                                    <td key={product.id} className="p-4 text-center text-gray-600 dark:text-gray-400">
                                        {product.reviews} reviews
                                    </td>
                                ))}
                            </tr>
                            <tr className="border-b border-gray-200 dark:border-gray-700">
                                <td className="p-4 font-medium text-gray-900 dark:text-white">Availability</td>
                                {compareProducts.map((product) => (
                                    <td key={product.id} className="p-4">
                                        <div className="flex justify-center">
                                            {product.inStock ? (
                                                <span className="flex items-center gap-2 text-green-600">
                                                    <Check className="w-5 h-5" />
                                                    In Stock
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-2 text-red-600">
                                                    <X className="w-5 h-5" />
                                                    Out of Stock
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                ))}
                            </tr>
                            <tr>
                                <td className="p-4 font-medium text-gray-900 dark:text-white">Discount</td>
                                {compareProducts.map((product) => (
                                    <td key={product.id} className="p-4 text-center">
                                        {product.discount ? (
                                            <span className="text-red-600 font-bold">-{product.discount}%</span>
                                        ) : (
                                            <span className="text-gray-400">No discount</span>
                                        )}
                                    </td>
                                ))}
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
