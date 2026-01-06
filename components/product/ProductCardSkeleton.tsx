'use client';

import { motion } from 'framer-motion';

interface ProductCardSkeletonProps {
    variant?: 'default' | 'compact';
}

export default function ProductCardSkeleton({ variant = 'default' }: ProductCardSkeletonProps) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative"
        >
            <div className={`
                relative overflow-hidden h-full flex flex-col
                bg-white dark:bg-gray-800/50 
                rounded-2xl
                border border-gray-100 dark:border-gray-700/50
                shadow-lg
                backdrop-blur-sm
                p-3
            `}>
                {/* Image Skeleton */}
                <div className={`
                    relative overflow-hidden 
                    bg-gradient-to-br from-gray-200 to-gray-100 dark:from-gray-700 dark:to-gray-600 
                    rounded-xl
                    ${variant === 'compact' ? 'h-48' : 'h-64'}
                `}>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 dark:via-white/10 to-transparent animate-shimmer" />

                    {/* Badge skeleton */}
                    <div className="absolute top-3 left-3 flex flex-col gap-2">
                        <div className="w-16 h-6 bg-gray-300 dark:bg-gray-600 rounded-full" />
                    </div>
                </div>

                {/* Content Skeleton */}
                <div className="flex-1 flex flex-col mt-4 px-1">
                    {/* Category */}
                    <div className="w-20 h-3 bg-gray-200 dark:bg-gray-700 rounded mb-2 overflow-hidden relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 dark:via-white/10 to-transparent animate-shimmer" />
                    </div>

                    {/* Title */}
                    <div className="space-y-2 mb-3">
                        <div className="w-full h-4 bg-gray-200 dark:bg-gray-700 rounded overflow-hidden relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 dark:via-white/10 to-transparent animate-shimmer" />
                        </div>
                        <div className="w-3/4 h-4 bg-gray-200 dark:bg-gray-700 rounded overflow-hidden relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 dark:via-white/10 to-transparent animate-shimmer" />
                        </div>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-3">
                        <div className="flex gap-1">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="w-3.5 h-3.5 bg-gray-200 dark:bg-gray-700 rounded" />
                            ))}
                        </div>
                        <div className="w-12 h-3 bg-gray-200 dark:bg-gray-700 rounded" />
                    </div>

                    {/* Price */}
                    <div className="flex items-center gap-2 mt-auto">
                        <div className="w-24 h-7 bg-gray-200 dark:bg-gray-700 rounded overflow-hidden relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 dark:via-white/10 to-transparent animate-shimmer" />
                        </div>
                        <div className="w-16 h-5 bg-gray-200 dark:bg-gray-700 rounded" />
                    </div>

                    {/* Stock bar */}
                    <div className="mt-4">
                        <div className="flex justify-between mb-1.5">
                            <div className="w-12 h-3 bg-gray-200 dark:bg-gray-700 rounded" />
                            <div className="w-10 h-3 bg-gray-200 dark:bg-gray-700 rounded" />
                        </div>
                        <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div className="w-3/4 h-full bg-gray-300 dark:bg-gray-600 rounded-full" />
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

// Grid skeleton
export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(count)].map((_, i) => (
                <ProductCardSkeleton key={i} />
            ))}
        </div>
    );
}
