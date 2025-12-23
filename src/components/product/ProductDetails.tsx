"use client";

import { useState } from "react";
import Image from "next/image";
import { Star, ShoppingCart, Heart, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn, formatCurrency } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { useFavorites } from "@/hooks/use-favorites";
import { Product } from "@/types/product";
import { ProductReviews } from "./ProductReviews";

interface ProductDetailsProps {
    product: Product;
}

export function ProductDetails({ product }: ProductDetailsProps) {
    const { addToCart } = useCart();
    const { isFavorite, toggleFavorite } = useFavorites();
    const [quantity, setQuantity] = useState(1);
    const favorited = isFavorite(product.id);

    const handleAddToCart = () => {
        for (let i = 0; i < quantity; i++) {
            addToCart(product);
        }
    };

    return (
        <section className="container mx-auto px-4 py-8 md:py-10 md:px-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                {/* Product Image */}
                <div className="relative aspect-square overflow-hidden rounded-2xl bg-gray-100">
                    <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover"
                        priority
                    />
                    <Button
                        variant="secondary"
                        size="icon"
                        className="absolute top-4 right-4 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white text-black shadow-md z-10"
                        onClick={() => toggleFavorite(product.id)}
                    >
                        <Heart className={cn("size-5", favorited && "fill-red-500 text-red-500")} />
                        <span className="sr-only">Toggle favorite</span>
                    </Button>
                </div>

                {/* Product Info */}
                <div className="flex flex-col gap-6">
                    <div className="space-y-2">
                        <Badge variant="secondary" className="uppercase tracking-wider text-[10px] font-bold">
                            {product.category}
                        </Badge>
                        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
                            {product.name}
                        </h1>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                <span className="font-semibold">{product.rating}</span>
                            </div>
                            <ProductReviews productId={product.id} count={product.reviews} />
                        </div>
                    </div>

                    <p className="text-4xl font-bold text-foreground">
                        {formatCurrency(product.price)}
                    </p>

                    <p className="text-muted-foreground leading-relaxed">
                        Experience the elegance of our handcrafted {product.category}. Each piece is meticulously designed to reflect timeless beauty and sophisticated style, making it the perfect addition to your jewelry collection.
                    </p>

                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-3">
                            <span className="text-sm font-medium">Quantity</span>
                            <div className="flex items-center border rounded-full px-2 py-1">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 rounded-full"
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    disabled={quantity <= 1}
                                >
                                    <Minus className="h-4 w-4" />
                                </Button>
                                <span className="w-10 text-center font-medium">{quantity}</span>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 rounded-full"
                                    onClick={() => setQuantity(quantity + 1)}
                                >
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        <Button
                            className="rounded-full h-10 text-sm font-bold uppercase tracking-wider"
                            onClick={handleAddToCart}
                        >
                            <ShoppingCart className="mr-2 h-4 w-4" />
                            Add to Cart
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
}
