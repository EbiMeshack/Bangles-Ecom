import { Skeleton } from "@/components/ui/skeleton";

export function OrdersSkeleton() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between mb-8">
                <Skeleton className="h-10 w-48" />
            </div>
            {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="rounded-lg border bg-card text-card-foreground shadow-sm p-6 space-y-4">
                    <div className="flex flex-col md:flex-row justify-between gap-4 border-b pb-4">
                        <div className="space-y-2">
                            <Skeleton className="h-5 w-32" />
                            <Skeleton className="h-4 w-24" />
                        </div>
                        <div className="flex gap-4">
                            <Skeleton className="h-8 w-20 rounded-full" />
                            <Skeleton className="h-8 w-24" />
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <Skeleton className="h-16 w-16 rounded-md" />
                            <div className="space-y-2 flex-1">
                                <Skeleton className="h-5 w-1/2" />
                                <Skeleton className="h-4 w-1/4" />
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
