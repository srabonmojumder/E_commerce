export default function ProductSkeleton() {
    return (
        <div className="card animate-pulse">
            {/* Image skeleton */}
            <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4" />

            {/* Category */}
            <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded mb-2" />

            {/* Title */}
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
            <div className="h-6 w-3/4 bg-gray-200 dark:bg-gray-700 rounded mb-3" />

            {/* Rating */}
            <div className="flex gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded" />
                ))}
            </div>

            {/* Price */}
            <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
    );
}
