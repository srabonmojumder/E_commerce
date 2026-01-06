'use client';

import { useState, useEffect } from 'react';
import { X, Search as SearchIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { products } from '@/data/products';
import { Product } from '@/store/useStore';

interface SearchModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<Product[]>([]);

    useEffect(() => {
        if (query.length > 0) {
            const filtered = products.filter(product =>
                product.name.toLowerCase().includes(query.toLowerCase()) ||
                product.category.toLowerCase().includes(query.toLowerCase()) ||
                product.description.toLowerCase().includes(query.toLowerCase())
            );
            setResults(filtered.slice(0, 5));
        } else {
            setResults([]);
        }
    }, [query]);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -50 }}
                        className="fixed top-20 left-1/2 -translate-x-1/2 w-full max-w-2xl z-50 px-4"
                    >
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
                            {/* Search Input */}
                            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                                <div className="relative">
                                    <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search products, categories..."
                                        value={query}
                                        onChange={(e) => setQuery(e.target.value)}
                                        autoFocus
                                        className="w-full pl-12 pr-12 py-3 bg-gray-100 dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 dark:text-white"
                                    />
                                    <button
                                        onClick={onClose}
                                        className="absolute right-4 top-1/2 -translate-y-1/2"
                                    >
                                        <X className="w-5 h-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                                    </button>
                                </div>
                            </div>

                            {/* Results */}
                            <div className="max-h-96 overflow-y-auto">
                                {query.length > 0 ? (
                                    results.length > 0 ? (
                                        <div className="p-2">
                                            {results.map((product) => (
                                                <Link
                                                    key={product.id}
                                                    href={`/products/${product.id}`}
                                                    onClick={onClose}
                                                >
                                                    <motion.div
                                                        whileHover={{ backgroundColor: 'rgba(147, 51, 234, 0.1)' }}
                                                        className="flex gap-3 p-3 rounded-lg cursor-pointer"
                                                    >
                                                        <div className="relative w-16 h-16 flex-shrink-0 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                                                            <Image
                                                                src={product.image}
                                                                alt={product.name}
                                                                fill
                                                                className="object-cover"
                                                            />
                                                        </div>
                                                        <div className="flex-1">
                                                            <h4 className="font-medium text-gray-900 dark:text-white">
                                                                {product.name}
                                                            </h4>
                                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                                {product.category}
                                                            </p>
                                                            <p className="text-sm font-semibold text-purple-600 dark:text-purple-400">
                                                                ${product.price.toFixed(2)}
                                                            </p>
                                                        </div>
                                                    </motion.div>
                                                </Link>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                                            No products found for "{query}"
                                        </div>
                                    )
                                ) : (
                                    <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                                        Start typing to search...
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
