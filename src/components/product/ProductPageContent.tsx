"use client";

import { ProductDetails } from "@/components/product/ProductDetails";
import { RelatedProducts } from "@/components/product/RelatedProducts";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";

interface ProductPageContentProps {
    id: string;
}

export function ProductPageContent({ id }: ProductPageContentProps) {
    // We use getProductsByIds and take the first one
    const products = useQuery(api.products.getProductsByIds, {
        ids: [id],
    });

    if (products === undefined) {
        return (
            <div className="container mx-auto px-4 py-8 md:px-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                    <Skeleton className="aspect-square w-full rounded-2xl" />
                    <div className="space-y-6">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-10 w-3/4" />
                        <Skeleton className="h-12 w-1/4" />
                        <Skeleton className="h-32 w-full" />
                        <div className="space-y-4">
                            <Skeleton className="h-12 w-full rounded-full" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const product = products[0];

    if (!product) {
        return (
            <div className="container mx-auto px-4 py-32 text-center">
                <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
                <p className="text-muted-foreground">The product you are looking for does not exist or has been removed.</p>
            </div>
        );
    }

    return (
        <>
            <ProductDetails product={product as any} />
            <RelatedProducts productId={product.id} category={product.category} />
        </>
    );
}
