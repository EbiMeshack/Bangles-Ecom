"use client";

import { ProductCard } from "@/components/product/ProductCard";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Skeleton } from "@/components/ui/skeleton";

export function FeaturedProducts() {
    const products = useQuery(api.products.getFeaturedProducts);

    // Loading state
    if (products === undefined) {
        return (
            <section className="container mx-auto px-4 py-8 md:px-12">
                <h2 className="text-2xl font-bold leading-tight tracking-[-0.015em] mb-4">
                    Featured Products
                </h2>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="space-y-3">
                            <Skeleton className="aspect-square w-full rounded-lg" />
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-2/3" />
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        );
    }

    // Empty state
    if (products.length === 0) {
        return (
            <section className="container mx-auto px-4 py-8 md:px-12">
                <h2 className="text-2xl font-bold leading-tight tracking-[-0.015em] mb-4">
                    Featured Products
                </h2>
                <p className="text-gray-500">No featured products available at the moment.</p>
            </section>
        );
    }

    return (
        <section className="container mx-auto px-4 py-8 md:px-12">
            <h2 className="text-2xl font-bold leading-tight tracking-[-0.015em] mb-4">
                Featured Products
            </h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </section>
    );
}
