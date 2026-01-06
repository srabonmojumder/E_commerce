'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Heart, Star, Eye, GitCompare, Zap, TrendingUp } from 'lucide-react';
import { Product } from '@/store/useStore';
import { useStore } from '@/store/useStore';
import { useCompareStore } from '@/store/useCompareStore';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

interface ProductCardProps {
    product: Product;
    onQuickView?: (product: Product) => void;
}

export default function ProductCard({ product, onQuickView }: ProductCardProps) {
    const [isHovered, setIsHovered] = useState(false);
    const addToCart = useStore((state) => state.addToCart);
    const addToWishlist = useStore((state) => state.addToWishlist);
    const removeFromWishlist = useStore((state) => state.removeFromWishlist);
    const isInWishlist = useStore((state) => state.isInWishlist);
    const addToCompare = useCompareStore((state) => state.addToCompare);
    const compareProducts = useCompareStore((state) => state.compareProducts);

    const inWishlist = isInWishlist(product.id);
    const inCompare = compareProducts.some(p => p.id === product.id);

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        addToCart(product);
        toast.success('Added to cart!', {
            icon: '🛒',
        });
    };

    const handleToggleWishlist = (e: React.MouseEvent) => {
        e.preventDefault();
        if (inWishlist) {
            removeFromWishlist(product.id);
            toast.success('Removed from wishlist');
        } else {
            addToWishlist(product);
            toast.success('Added to wishlist!', {
                icon: '❤️',
            });
        }
    };

    const handleAddToCompare = (e: React.MouseEvent) => {
        e.preventDefault();
        if (compareProducts.length >= 4) {
            toast.error('You can only compare up to 4 products');
            return;
        }
        addToCompare(product);
        toast.success('Added to comparison!');
    };

    const handleQuickView = (e: React.MouseEvent) => {
        e.preventDefault();
        if (onQuickView) {
            onQuickView(product);
        }
    };

    const discountedPrice = product.discount
        ? product.price * (1 - product.discount / 100)
        : product.price;

    // Determine if product is new (random for demo)
    const isNew = product.id % 3 === 0;
    const isHot = product.rating >= 4.7;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            whileHover={{ y: -8, scale: 1.02 }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
        >
            <Link href={`/products/${product.id}`} className="group">
                <div className="card overflow-hidden h-full flex flex-col relative border border-gray-200 dark:border-gray-700 hover:border-purple-400 dark:hover:border-purple-500 transition-all">
                    {/* Image Container */}
                    <div className="relative h-64 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-lg">
                        <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-700"
                        />

                        {/* Badges */}
                        <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
                            {product.discount && (
                                <motion.div
                                    initial={{ scale: 0, rotate: -180 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg flex items-center gap-1"
                                >
                                    <Zap className="w-3 h-3 fill-white" />
                                    -{product.discount}%
                                </motion.div>
                            )}
                            {isNew && (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg"
                                >
                                    NEW
                                </motion.div>
                            )}
                            {isHot && (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1"
                                >
                                    <TrendingUp className="w-3 h-3" />
                                    HOT
                                </motion.div>
                            )}
                        </div>

                        {/* Stock Badge */}
                        {!product.inStock && (
                            <div className="absolute top-3 right-3 bg-gray-900/80 text-white px-3 py-1 rounded-full text-sm font-semibold z-10">
                                Out of Stock
                            </div>
                        )}

                        {/* Quick Actions */}
                        <AnimatePresence>
                            {isHovered && (
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className="absolute top-3 right-3 flex flex-col gap-2 z-10"
                                >
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={handleToggleWishlist}
                                        className={`p-2.5 rounded-full backdrop-blur-md transition-all shadow-lg ${inWishlist
                                                ? 'bg-red-500 text-white'
                                                : 'bg-white/90 text-gray-700 hover:bg-red-500 hover:text-white'
                                            }`}
                                    >
                                        <Heart className={`w-4 h-4 ${inWishlist ? 'fill-current' : ''}`} />
                                    </motion.button>

                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={handleQuickView}
                                        className="p-2.5 rounded-full bg-white/90 text-gray-700 hover:bg-purple-600 hover:text-white backdrop-blur-md transition-all shadow-lg"
                                    >
                                        <Eye className="w-4 h-4" />
                                    </motion.button>

                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={handleAddToCompare}
                                        disabled={inCompare}
                                        className={`p-2.5 rounded-full backdrop-blur-md transition-all shadow-lg ${inCompare
                                                ? 'bg-blue-500 text-white'
                                                : 'bg-white/90 text-gray-700 hover:bg-blue-600 hover:text-white'
                                            }`}
                                    >
                                        <GitCompare className="w-4 h-4" />
                                    </motion.button>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Add to Cart Button - Slides up on hover */}
                        <AnimatePresence>
                            {isHovered && product.inStock && (
                                <motion.button
                                    initial={{ y: 100, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    exit={{ y: 100, opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    onClick={handleAddToCart}
                                    className="absolute bottom-0 left-0 right-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 font-semibold hover:from-purple-700 hover:to-pink-700 transition-all flex items-center justify-center gap-2 shadow-lg z-10"
                                >
                                    <ShoppingCart className="w-5 h-5" />
                                    Quick Add
                                </motion.button>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 flex flex-col mt-4">
                        <p className="text-sm text-purple-600 dark:text-purple-400 mb-1 font-medium">
                            {product.category}
                        </p>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors leading-tight">
                            {product.name}
                        </h3>

                        {/* Rating */}
                        <div className="flex items-center gap-2 mb-3">
                            <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`w-3.5 h-3.5 ${i < Math.floor(product.rating)
                                                ? 'text-yellow-400 fill-current'
                                                : 'text-gray-300 dark:text-gray-600'
                                            }`}
                                    />
                                ))}
                            </div>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                ({product.reviews})
                            </span>
                        </div>

                        {/* Price */}
                        <div className="flex items-center gap-2 mt-auto">
                            {product.discount ? (
                                <>
                                    <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                        ${discountedPrice.toFixed(2)}
                                    </span>
                                    <span className="text-base text-gray-400 line-through">
                                        ${product.price.toFixed(2)}
                                    </span>
                                </>
                            ) : (
                                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                                    ${product.price.toFixed(2)}
                                </span>
                            )}
                        </div>

                        {/* Progress bar for stock (visual interest) */}
                        {product.inStock && (
                            <div className="mt-3">
                                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                                    <span>Available</span>
                                    <span>{Math.floor(Math.random() * 50 + 10)} left</span>
                                </div>
                                <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        whileInView={{ width: `${Math.random() * 40 + 60}%` }}
                                        viewport={{ once: true }}
                                        className="h-full bg-gradient-to-r from-purple-600 to-pink-600 rounded-full"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}
