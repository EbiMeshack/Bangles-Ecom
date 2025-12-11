import { Product } from "@/types/product";
import { ProductCard } from "./ProductCard";

interface ProductGridProps {
    products: Product[];
}

export function ProductGrid({ products }: ProductGridProps) {
    if (products.length === 0) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center text-muted-foreground min-h-[400px]">
                <p className="text-lg font-medium">No products found</p>
                <p className="text-sm mt-2">Try adjusting your filters or search criteria.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1 lg:gap-4 pb-10">
            {products.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
    );
}
