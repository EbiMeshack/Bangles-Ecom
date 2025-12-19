import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ProductCard } from "@/components/product/ProductCard";

import productsData from "@/data/products.json";

const categories = Array.from(new Set(productsData.map((p) => p.category)));
const products = categories.map((cat) => productsData.find((p) => p.category === cat)!);

export function FeaturedProducts() {
    return (
        <section className="container mx-auto px-4 py-8">
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
