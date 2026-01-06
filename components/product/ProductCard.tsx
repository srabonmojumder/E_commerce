'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Heart, Star, Eye } from 'lucide-react';
import { Product } from '@/store/useStore';
import { useStore } from '@/store/useStore';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const [isHovered, setIsHovered] = useState(false);
    const addToCart = useStore((state) => state.addToCart);
    const addToWishlist = useStore((state) => state.addToWishlist);
    const removeFromWishlist = useStore((state) => state.removeFromWishlist);
    const isInWishlist = useStore((state) => state.isInWishlist);

    const inWishlist = isInWishlist(product.id);

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        addToCart(product);
        toast.success('Added to cart!');
    };

    const handleToggleWishlist = (e: React.MouseEvent) => {
        e.preventDefault();
        if (inWishlist) {
            removeFromWishlist(product.id);
            toast.success('Removed from wishlist');
        } else {
            addToWishlist(product);
            toast.success('Added to wishlist!');
        }
    };

    const discountedPrice = product.discount
        ? product.price * (1 - product.discount / 100)
        : product.price;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            whileHover={{ y: -8 }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
        >
            <Link href={`/products/${product.id}`} className="group">
                <div className="card overflow-hidden h-full flex flex-col">
                    {/* Image Container */}
                    <div className="relative h-64 overflow-hidden bg-gray-100 dark:bg-gray-700 rounded-lg">
                        <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />

                        {/* Discount Badge */}
                        {product.discount && (
                            <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold z-10">
                                -{product.discount}%
                            </div>
                        )}

                        {/* Stock Badge */}
                        {!product.inStock && (
                            <div className="absolute top-3 right-3 bg-gray-900/80 text-white px-3 py-1 rounded-full text-sm font-semibold">
                                Out of Stock
                            </div>
                        )}

                        {/* Quick Actions */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: isHovered ? 1 : 0 }}
                            className="absolute top-3 right-3 flex flex-col gap-2"
                        >
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={handleToggleWishlist}
                                className={`p-2 rounded-full backdrop-blur-md transition-colors ${inWishlist
                                        ? 'bg-red-500 text-white'
                                        : 'bg-white/90 text-gray-700 hover:bg-red-500 hover:text-white'
                                    }`}
                            >
                                <Heart className={`w-5 h-5 ${inWishlist ? 'fill-current' : ''}`} />
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="p-2 rounded-full bg-white/90 text-gray-700 hover:bg-primary-600 hover:text-white backdrop-blur-md transition-colors"
                            >
                                <Eye className="w-5 h-5" />
                            </motion.button>
                        </motion.div>

                        {/* Add to Cart Button */}
                        <motion.button
                            initial={{ y: 100 }}
                            animate={{ y: isHovered ? 0 : 100 }}
                            transition={{ duration: 0.3 }}
                            onClick={handleAddToCart}
                            disabled={!product.inStock}
                            className="absolute bottom-0 left-0 right-0 bg-gradient-to-r from-primary-600 to-primary-700 text-white py-3 font-semibold hover:from-primary-700 hover:to-primary-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            <ShoppingCart className="w-5 h-5" />
                            Add to Cart
                        </motion.button>
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 flex flex-col mt-4">
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                            {product.category}
                        </p>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
                            {product.name}
                        </h3>

                        {/* Rating */}
                        <div className="flex items-center gap-2 mb-3">
                            <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`w-4 h-4 ${i < Math.floor(product.rating)
                                                ? 'text-yellow-400 fill-current'
                                                : 'text-gray-300 dark:text-gray-600'
                                            }`}
                                    />
                                ))}
                            </div>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                ({product.reviews})
                            </span>
                        </div>

                        {/* Price */}
                        <div className="flex items-center gap-2 mt-auto">
                            {product.discount ? (
                                <>
                                    <span className="text-2xl font-bold text-primary-600">
                                        ${discountedPrice.toFixed(2)}
                                    </span>
                                    <span className="text-lg text-gray-400 line-through">
                                        ${product.price.toFixed(2)}
                                    </span>
                                </>
                            ) : (
                                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                                    ${product.price.toFixed(2)}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}
