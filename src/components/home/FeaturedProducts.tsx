import { Card, CardContent, CardFooter } from "@/components/ui/card";

import productsData from "@/data/products.json";

const categories = Array.from(new Set(productsData.map((p) => p.category)));
const products = categories.map((cat) => productsData.find((p) => p.category === cat)!);

export function FeaturedProducts() {
    return (
        <section className="container mx-auto px-4 py-8 md:px-12">
            <h2 className="text-2xl font-bold leading-tight tracking-[-0.015em] mb-4">
                Featured Products
            </h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {products.map((product) => (
                    <Card key={product.id} className="overflow-hidden border-none shadow-none bg-transparent group">
                        <CardContent className="p-0">
                            <div className="overflow-hidden rounded-lg">
                                <div
                                    className="aspect-square bg-cover bg-center transition-transform duration-300 group-hover:scale-110"
                                    style={{ backgroundImage: `url("${product.image}")` }}
                                />
                            </div>
                        </CardContent>
                        <CardFooter className="flex flex-col items-start gap-1 p-0 pt-2">
                            <h3 className="font-semibold text-foreground">{product.name}</h3>
                            <p className="text-muted-foreground">₹{product.price.toFixed(2)}</p>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </section>
    );
}
