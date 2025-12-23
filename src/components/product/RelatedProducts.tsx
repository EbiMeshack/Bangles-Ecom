"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { ProductCard } from "@/components/product/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";

interface RelatedProductsProps {
    productId: string;
    category: string;
}

export function RelatedProducts({ productId, category }: RelatedProductsProps) {
    const relatedProducts = useQuery(api.products.getRelatedProducts, {
        productId: productId as Id<"products">,
        category,
        limit: 4,
    });

    if (relatedProducts === undefined) {
        return (
            <section className="container mx-auto px-4 py-16 md:px-12 border-t">
                <h2 className="text-2xl font-bold mb-8">Related Products</h2>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {Array.from({ length: 4 }).map((_, i) => (
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

    if (relatedProducts.length === 0) {
        return null; // Don't show the section if no related products
    }

    return (
        <section className="container mx-auto px-4 py-16 md:px-12 border-t">
            <h2 className="text-2xl font-bold mb-8">Related Products</h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {relatedProducts.map((product) => (
                    <ProductCard key={product.id} product={product as any} />
                ))}
            </div>
        </section>
    );
}
