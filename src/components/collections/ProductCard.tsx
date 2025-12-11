import { Product } from "@/types/product";
import Image from "next/image";
import Link from "next/link";
import { Star, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface ProductCardProps {
    product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
    return (
        <Link href={`#product-${product.id}`} className="group block h-full">
            <Card className="flex flex-col h-full overflow-hidden border hover:shadow-lg transition-all duration-300 p-0 gap-0 shadow-none rounded-xl">
                <div className="relative aspect-square overflow-hidden bg-muted/20">
                    <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                    />

                    {/* Quick Add Overlay */}
                    <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex justify-center pb-6 bg-gradient-to-t from-black/50 to-transparent">
                        <Button
                            className="w-full max-w-[80%] shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75"
                            variant="secondary"
                            size="sm"
                        >
                            <ShoppingCart className="w-4 h-4 mr-2" />
                            Add to Cart
                        </Button>
                    </div>
                </div>

                <CardContent className="p-3 sm:p-4 flex flex-col flex-1">
                    <div className="mb-2">
                        <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-1">
                            {product.category}
                        </p>
                        <h3 className="font-semibold text-sm sm:text-base leading-tight group-hover:text-primary transition-colors line-clamp-2">
                            {product.name}
                        </h3>
                    </div>

                    <div className="mt-auto pt-2 flex flex-col items-start gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-0">
                        <p className="text-base sm:text-lg font-bold">
                            ${product.price.toFixed(2)}
                        </p>
                        <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 sm:h-3.5 sm:w-3.5 fill-primary text-primary" />
                            <span className="text-xs sm:text-sm font-medium">{product.rating}</span>
                            <span className="text-[10px] sm:text-xs text-muted-foreground">({product.reviews})</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}

