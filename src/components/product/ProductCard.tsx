"use client";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Star, ShoppingCart } from "lucide-react";
import { useFavorites } from "@/hooks/use-favorites";
import { cn, formatCurrency } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { Product } from "@/types/product";
import Link from "next/link";

interface ProductCardProps {
    product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
    const { isFavorite, toggleFavorite } = useFavorites();
    const { addToCart } = useCart(); // Get addToCart from context
    const favorited = isFavorite(product.id);

    return (
        <Card className="overflow-hidden border-none shadow-none bg-transparent group relative">
            <Link href={`/product/${product.id}`} className="absolute inset-0 z-0">
                <span className="sr-only">View {product.name}</span>
            </Link>
            <CardContent className="p-0 pointer-events-none">
                <div className="overflow-hidden rounded-lg relative">
                    <div
                        className="aspect-square bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                        style={{ backgroundImage: `url("${product.image}")` }}
                    />

                    {/* Favorite Button: Top Right, visible on mobile, hover on desktop if desired, or always visible */}
                    {/* User asked: "keep it at the right cornner where the button originally is" */}
                    <div className="absolute top-2 right-2 z-10 pointer-events-auto">
                        <div className="md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                            <Button
                                variant="secondary"
                                size="icon"
                                className="rounded-full size-8 bg-white/80 backdrop-blur-sm hover:bg-white text-black shadow-sm"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    toggleFavorite(product.id);
                                }}
                            >
                                <Heart className={cn("size-4", favorited && "fill-red-500 text-red-500")} />
                                <span className="sr-only">Toggle favorite</span>
                            </Button>
                        </div>
                    </div>

                    {/* Add to Cart Button Overlay */}
                    <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out flex justify-center bg-gradient-to-t from-black/50 to-transparent pointer-events-auto">
                        <button
                            className="flex items-center gap-2 bg-white text-black text-xs font-bold uppercase tracking-wider py-2.5 px-6 rounded-full hover:bg-white/90 transition-colors shadow-lg"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                addToCart(product);
                            }}
                        >
                            <ShoppingCart className="w-3.5 h-3.5" />
                            Add to Cart
                        </button>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="flex flex-col items-start gap-1 p-0 pl-3 pt-3 pointer-events-none">
                <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                    {product.category}
                </span>
                <h3 className="w-full font-semibold text-base text-foreground leading-tight truncate">{product.name}</h3>
                <div className="flex w-full items-center justify-between mt-1">
                    <p className="font-bold text-lg">{formatCurrency(product.price)}</p>
                    <div className="hidden md:flex items-center gap-1.5 text-sm">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{product.rating}</span>
                        <span className="text-muted-foreground text-xs">({product.reviews})</span>
                    </div>
                </div>
            </CardFooter>
        </Card>
    );
}
