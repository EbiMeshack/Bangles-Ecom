"use client";

import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { ProductCard } from "@/components/product/ProductCard";
import { FavoritesSkeleton } from "@/components/favorites/FavoritesSkeleton";
import { api } from "@/convex/_generated/api";
import { useFavorites } from "@/hooks/use-favorites";
import { useQuery } from "convex/react";
import { EmptyFavorites } from "@/components/favorites/EmptyFavorites";

export default function FavoritesPage() {
    const { favorites, isLoaded: isFavoritesLoaded } = useFavorites();

    const favoriteProducts = useQuery(api.products.getProductsByIds, {
        ids: favorites
    });

    const isLoading = !isFavoritesLoaded || favoriteProducts === undefined;


    return (
        <div className="flex min-h-screen flex-col font-sans">
            <Header />
            <main className="flex-1 flex flex-col">
                <div className="container mx-auto px-4 py-8 md:py-12 flex-1 max-w-7xl">
                    {isLoading ? (
                        <FavoritesSkeleton />
                    ) : favorites.length === 0 ? (
                        <EmptyFavorites />
                    ) : (
                        <>
                            <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-8">My Favorites</h1>

                            <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                {favoriteProducts.map((product) => (
                                    <ProductCard key={product.id} product={product as any} />
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
}
