export const AssessmentSkeleton = () => (
    <div className="w-full max-w-3xl animate-pulse space-y-4">
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-800">
            {/* Header Skeleton */}
            <div className="border-b border-gray-100 bg-gray-50/50 p-8 text-center dark:border-gray-700 dark:bg-gray-800/50">
                <div className="mx-auto h-8 w-3/4 rounded-md bg-gray-200 dark:bg-gray-700" />
                <div className="mx-auto mt-4 h-4 w-1/2 rounded-md bg-gray-200 dark:bg-gray-700" />
            </div>
            {/* Body Skeleton */}
            <div className="p-8">
                <div className="h-48 w-full rounded-xl bg-gray-100 dark:bg-gray-700/50" />
                <div className="mt-8 grid grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-16 rounded-xl bg-gray-100 dark:bg-gray-700/50" />
                    ))}
                </div>
                <div className="mt-8 h-14 w-full rounded-xl bg-gray-200 dark:bg-gray-700" />
            </div>
        </div>
    </div>
);