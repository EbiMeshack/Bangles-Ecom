import { Skeleton } from "@/components/ui/skeleton";
import { CartHeader } from "./CartHeader";

interface CartSkeletonProps {
    onClearCart?: () => void;
}

export function CartSkeleton({ onClearCart }: CartSkeletonProps) {
    return (
        <div className="w-full">
            <CartHeader onClearCart={onClearCart} />
            <div className="lg:grid lg:grid-cols-12 lg:gap-12 items-start relative">
                <div className="lg:col-span-8 space-y-6">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="flex py-6 border-t border-gray-200">
                            <Skeleton className="h-24 w-24 sm:h-32 sm:w-32 rounded-md" />
                            <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
                                <div className="space-y-4">
                                    <Skeleton className="h-4 w-1/2" />
                                    <Skeleton className="h-4 w-1/4" />
                                    <Skeleton className="h-4 w-1/6" />
                                </div>
                                <div className="flex justify-end">
                                    <Skeleton className="h-10 w-24" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="lg:col-span-4 bg-gray-50 rounded-lg p-6 space-y-4">
                    <Skeleton className="h-6 w-1/2" />
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <Skeleton className="h-4 w-1/4" />
                            <Skeleton className="h-4 w-1/6" />
                        </div>
                        <div className="flex justify-between">
                            <Skeleton className="h-4 w-1/4" />
                            <Skeleton className="h-4 w-1/6" />
                        </div>
                        <div className="border-t border-gray-200 pt-4 flex justify-between">
                            <Skeleton className="h-6 w-1/3" />
                            <Skeleton className="h-6 w-1/4" />
                        </div>
                    </div>
                    <Skeleton className="h-12 w-full rounded-full" />
                </div>
            </div>
        </div>
    );
}
