import { cn } from "@/lib/utils"

/**
 * Base Skeleton — a shimmering placeholder block.
 * Usage: <Skeleton className="h-4 w-32 rounded-md" />
 */
export function Skeleton({ className, ...props }) {
    return (
        <div
            className={cn(
                "relative overflow-hidden rounded-md bg-white/[0.04] before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.6s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/[0.07] before:to-transparent",
                className
            )}
            {...props}
        />
    )
}

/**
 * Dashboard main page skeleton — mirrors the dashboard grid layout.
 */
export function DashboardSkeleton() {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Welcome header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 pb-4 border-b border-white/5">
                <div className="space-y-2.5">
                    <Skeleton className="h-5 w-32 rounded-full" />
                    <Skeleton className="h-9 w-64 rounded-lg" />
                    <Skeleton className="h-4 w-80 rounded-md" />
                </div>
            </div>

            {/* Metric cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="p-3 rounded-lg border border-white/5 bg-white/[0.01] flex items-center gap-3">
                        <Skeleton className="h-8 w-8 rounded-lg shrink-0" />
                        <div className="space-y-1.5 flex-1">
                            <Skeleton className="h-2.5 w-20 rounded" />
                            <Skeleton className="h-5 w-24 rounded" />
                        </div>
                    </div>
                ))}
            </div>

            {/* Career readiness card */}
            <div className="rounded-lg border border-white/5 bg-white/[0.01] p-4 space-y-4">
                <Skeleton className="h-5 w-48 rounded-full" />
                <Skeleton className="h-10 w-40 rounded" />
                <Skeleton className="h-2 w-full rounded-full" />
                <div className="flex gap-3 pt-1">
                    <Skeleton className="h-9 w-32 rounded-xl" />
                    <Skeleton className="h-9 w-32 rounded-xl" />
                </div>
            </div>

            {/* Tools hub */}
            <div className="space-y-3">
                <Skeleton className="h-5 w-40 rounded" />
                <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-2">
                    {[...Array(8)].map((_, i) => (
                        <Skeleton key={i} className="aspect-square rounded-lg" />
                    ))}
                </div>
            </div>

            {/* Roadmap cards */}
            <div className="space-y-3">
                <Skeleton className="h-4 w-28 rounded" />
                <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="rounded-lg border border-white/5 bg-white/[0.01] p-4 space-y-3">
                            <Skeleton className="h-3 w-20 rounded" />
                            <Skeleton className="h-5 w-40 rounded" />
                            <Skeleton className="h-10 w-full rounded" />
                            <Skeleton className="h-8 w-full rounded-md" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

/**
 * Roadmap detail page skeleton.
 */
export function RoadmapDetailSkeleton() {
    return (
        <div className="max-w-6xl mx-auto space-y-6 pb-16 pt-4 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-4">
                <div className="space-y-2">
                    <Skeleton className="h-3 w-28 rounded" />
                    <Skeleton className="h-7 w-64 rounded" />
                    <Skeleton className="h-5 w-32 rounded-full" />
                </div>
                <div className="flex gap-2">
                    <Skeleton className="h-8 w-8 rounded-lg" />
                    <Skeleton className="h-8 w-32 rounded-lg" />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Main content */}
                <div className="lg:col-span-8 space-y-6">
                    <div className="grid grid-cols-3 gap-2">
                        {[...Array(3)].map((_, i) => (
                            <Skeleton key={i} className="h-16 rounded-lg" />
                        ))}
                    </div>
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="rounded-lg border border-white/5 p-4 space-y-2">
                            <div className="flex items-center gap-3">
                                <Skeleton className="h-8 w-8 rounded-full shrink-0" />
                                <div className="space-y-1.5 flex-1">
                                    <Skeleton className="h-4 w-40 rounded" />
                                    <Skeleton className="h-3 w-24 rounded" />
                                </div>
                            </div>
                            <Skeleton className="h-24 w-full rounded-lg" />
                        </div>
                    ))}
                </div>
                {/* Sidebar */}
                <div className="lg:col-span-4 space-y-5">
                    <Skeleton className="h-32 rounded-lg" />
                    <div className="space-y-2">
                        {[...Array(5)].map((_, i) => (
                            <Skeleton key={i} className="h-10 rounded-lg" />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

/**
 * Generic card placeholder for any list-based loading state.
 */
export function CardSkeleton({ count = 3 }) {
    return (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(count)].map((_, i) => (
                <div key={i} className="rounded-lg border border-white/5 bg-white/[0.01] p-5 space-y-3">
                    <Skeleton className="h-5 w-3/4 rounded" />
                    <Skeleton className="h-3 w-full rounded" />
                    <Skeleton className="h-3 w-5/6 rounded" />
                    <Skeleton className="h-8 w-full rounded-md mt-2" />
                </div>
            ))}
        </div>
    )
}
