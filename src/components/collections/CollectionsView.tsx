"use client";

import { useState, useMemo } from "react";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FilterSidebar } from "./FilterSidebar";
import { ProductCard } from "./ProductCard";
import { CollectionSearch } from "./CollectionSearch";
import { CollectionPagination } from "./CollectionPagination";
import { MobileFilterDrawer } from "./MobileFilterDrawer";

interface Product {
    id: string;
    name: string;
    price: number;
    category: string;
    image: string;
    rating: number;
    reviews: number;
}

interface CollectionsViewProps {
    initialProducts: Product[];
}

export function CollectionsView({ initialProducts }: CollectionsViewProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [minRating, setMinRating] = useState<number | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 8;

    // Reset pagination when filters change
    useMemo(() => {
        // We use useMemo as a side-effect trigger here or better, just useEffect
        // But since we are inside a functional component, useEffect is better. 
        // However, standard practice is useEffect. 
    }, [searchQuery, selectedCategories, minRating]); // Price range change is handled below or we can just add it.

    // Calculate min/max price for the slider
    const { minPrice, maxPrice } = useMemo(() => {
        const prices = initialProducts.map(p => p.price);
        return {
            minPrice: Math.min(...prices, 0),
            maxPrice: Math.max(...prices, 1000)
        };
    }, [initialProducts]);

    const [priceRange, setPriceRange] = useState<[number, number]>([minPrice, maxPrice]);

    // Reset page when any filter changes
    // Using useEffect to avoid render loop if we adjusted state during render
    // But setting state during render is bad.
    const filtersChanged = searchQuery + selectedCategories.join(',') + minRating + priceRange.join(',');
    /* eslint-disable react-hooks/exhaustive-deps */
    useMemo(() => {
        setCurrentPage(1);
    }, [filtersChanged]);
    /* eslint-enable react-hooks/exhaustive-deps */

    // Extract unique categories
    const categories = useMemo(() => {
        return Array.from(new Set(initialProducts.map((p) => p.category)));
    }, [initialProducts]);

    const filteredProducts = useMemo(() => {
        return initialProducts.filter((product) => {
            const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(product.category);
            const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
            const matchesRating = minRating === null || product.rating >= minRating;

            return matchesSearch && matchesCategory && matchesPrice && matchesRating;
        });
    }, [initialProducts, searchQuery, selectedCategories, priceRange, minRating]);

    const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
    const paginatedProducts = filteredProducts.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );



    const handlePageChange = (page: number) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="container mx-auto px-4 py-8 md:px-8">
            {/* Top Search Bar - Centered */}
            <CollectionSearch value={searchQuery} onChange={setSearchQuery} />

            {/* Mobile Filter Button - Below Search */}
            <div className="lg:hidden mb-8 mt-1 flex justify-center">
                <MobileFilterDrawer
                    categories={categories}
                    selectedCategories={selectedCategories}
                    setSelectedCategories={setSelectedCategories}
                    priceRange={priceRange}
                    setPriceRange={setPriceRange}
                    minPrice={minPrice}
                    maxPrice={maxPrice}
                    minRating={minRating}
                    setMinRating={setMinRating}
                />
            </div>

            <div className="flex flex-col lg:flex-row gap-12 mt-8 md:mt-0">
                {/* Sticky Sidebar */}
                <FilterSidebar
                    className="hidden lg:block self-start"
                    categories={categories}
                    selectedCategories={selectedCategories}
                    setSelectedCategories={setSelectedCategories}
                    priceRange={priceRange}
                    setPriceRange={setPriceRange}
                    minPrice={minPrice}
                    maxPrice={maxPrice}
                    minRating={minRating}
                    setMinRating={setMinRating}
                />

                {/* Main Content */}
                <div className="flex-1">
                    {/* Header Row: Title + Search Results/Sorting */}
                    <div className="flex flex-col sm:flex-row justify-between items-center sm:items-center gap-2 border-b border-transparent pb-2">
                        <h2 className="text-2xl font-bold">Search Results</h2>

                        <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>
                                Showing {filteredProducts.length > 0 ? (currentPage - 1) * ITEMS_PER_PAGE + 1 : 0}-
                                {Math.min(currentPage * ITEMS_PER_PAGE, filteredProducts.length)} of {filteredProducts.length} results
                            </span>

                            {/* Pagination Controls (Top) */}
                            <div className="hidden sm:flex items-center ml-2">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    disabled={currentPage === 1}
                                    onClick={() => handlePageChange(currentPage - 1)}
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    disabled={currentPage === totalPages || totalPages === 0}
                                    onClick={() => handlePageChange(currentPage + 1)}
                                >
                                    <ChevronRight className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Product Grid */}
                    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 md:gap-y-5 min-h-[500px]">
                        {paginatedProducts.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                        {filteredProducts.length === 0 && (
                            <div className="col-span-full flex flex-col items-center justify-center py-24 text-muted-foreground">
                                <Search className="h-16 w-16 mb-4 opacity-10" />
                                <p className="text-xl font-medium text-gray-400">No products found</p>
                                <button
                                    onClick={() => {
                                        setSearchQuery("");
                                        setSelectedCategories([]);
                                        setPriceRange([minPrice, maxPrice]);
                                        setMinRating(null);
                                    }}
                                    className="mt-4 text-primary font-medium hover:underline"
                                >
                                    Clear all filters
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Bottom Pagination */}
                    <div className="mt-12">
                        <CollectionPagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

