import { Skeleton } from "@/components/ui/skeleton";

export function FavoritesSkeleton() {
    return (
        <div className="w-full">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-8">My Favorites</h1>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[...Array(8)].map((_, i) => (
                    <div key={i} className="space-y-3">
                        <Skeleton className="aspect-square w-full rounded-2xl" />
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-2/3" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
