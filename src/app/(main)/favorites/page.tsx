"use client";

import { useFavorites } from "@/hooks/use-favorites";
import { ProductCard } from "@/components/product/ProductCard";
import productsData from "@/data/products.json";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Heart } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function FavoritesPage() {
    const { favorites, isLoaded } = useFavorites();

    const favoriteProducts = productsData.filter((product) =>
        favorites.includes(product.id)
    );

    if (!isLoaded) {
        return (
            <div className="flex min-h-screen flex-col font-sans">
                <Header />
                <main className="container mx-auto px-4 py-8 md:px-12 flex-1 flex items-center justify-center">
                    <p className="text-muted-foreground">Loading favorites...</p>
                </main>
                <Footer />
            </div>
        );
    }

    if (favorites.length === 0) {
        return (
            <div className="flex min-h-screen flex-col font-sans">
                <Header />
                <main className="container mx-auto px-4 py-16 md:px-12 flex-1 flex flex-col items-center justify-center text-center gap-4">
                    <div className="bg-muted/50 p-6 rounded-full">
                        <Heart className="size-12 text-muted-foreground" />
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight">No favorites yet</h1>
                    <p className="text-muted-foreground max-w-md">
                        Start exploring our collections and save items you love to your favorites list.
                    </p>
                    <Button asChild className="mt-4">
                        <Link href="/collections">
                            Explore Collections
                        </Link>
                    </Button>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="flex min-h-screen flex-col font-sans">
            <Header />
            <main className="container mx-auto px-4 py-8 md:px-12 flex-1">
                <h1 className="text-3xl font-bold tracking-tight mb-8">My Favorites</h1>

                <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {favoriteProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </main>
            <Footer />
        </div>
    );
}
