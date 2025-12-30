"use client";

import { useState } from "react";
import Image from "next/image";
import { Star, ShoppingCart, Heart, Minus, Plus, AlertCircle } from "lucide-react";
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
    const { addToCart, cart } = useCart();
    const { isFavorite, toggleFavorite } = useFavorites();
    const [quantity, setQuantity] = useState(1);
    const favorited = isFavorite(product.id);

    // Calculate how many are already in cart
    const cartItem = cart.find((item) => item.id === product.id);
    const quantityInCart = cartItem?.cartQuantity || 0;
    const availableToAdd = product.stockQuantity - quantityInCart;
    const isOutOfStock = product.stockQuantity <= 0;
    const isMaxReached = availableToAdd <= 0;

    const handleAddToCart = () => {
        if (isOutOfStock || isMaxReached) return;

        const qtyToAdd = Math.min(quantity, availableToAdd);
        for (let i = 0; i < qtyToAdd; i++) {
            addToCart(product);
        }
        setQuantity(1);
    };

    const handleIncreaseQuantity = () => {
        if (quantity < availableToAdd) {
            setQuantity(quantity + 1);
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
                    {isOutOfStock && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <span className="text-white text-2xl font-bold">Out of Stock</span>
                        </div>
                    )}
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

                    {/* Stock Status */}
                    <div className="flex items-center gap-2">
                        {isOutOfStock ? (
                            <span className="text-destructive font-medium flex items-center gap-1">
                                <AlertCircle className="w-4 h-4" />
                                Out of Stock
                            </span>
                        ) : product.stockQuantity <= 5 ? (
                            <p className="text-orange-500 text-sm font-medium">
                                Only {product.stockQuantity} left in stock
                            </p>
                        ) : (
                            <p className="text-green-600 text-sm font-medium">
                                In Stock ({product.stockQuantity} available)
                            </p>
                        )}
                    </div>

                    <p className="text-muted-foreground leading-relaxed">
                        Experience the elegance of our handcrafted {product.category}. Each piece is meticulously designed to reflect timeless beauty and sophisticated style, making it the perfect addition to your jewelry collection.
                    </p>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 mt-4">
                        <div className="flex items-center justify-between sm:justify-start gap-4 p-1 border rounded-full w-full sm:w-auto sm:border-0 sm:p-0">
                            <span className="text-sm font-medium ml-3 sm:ml-0">Quantity</span>
                            <div className="flex items-center border rounded-full px-2 py-1 bg-background sm:bg-transparent">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 rounded-full"
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    disabled={quantity <= 1 || isOutOfStock}
                                >
                                    <Minus className="h-4 w-4" />
                                </Button>
                                <span className="w-10 text-center font-medium">{quantity}</span>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 rounded-full"
                                    onClick={handleIncreaseQuantity}
                                    disabled={quantity >= availableToAdd || isOutOfStock}
                                >
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        <Button
                            className="w-full sm:w-auto sm:flex-1 rounded-full h-12 sm:h-10 text-sm font-bold uppercase tracking-wider"
                            onClick={handleAddToCart}
                            disabled={isOutOfStock || isMaxReached}
                        >
                            <ShoppingCart className="mr-2 h-4 w-4" />
                            {isOutOfStock ? "Out of Stock" : isMaxReached ? "Max in Cart" : "Add to Cart"}
                        </Button>
                    </div>

                    {quantityInCart > 0 && !isOutOfStock && (
                        <p className="text-sm text-muted-foreground">
                            You have {quantityInCart} in your cart
                        </p>
                    )}
                </div>
            </div>
        </section>
    );
}

