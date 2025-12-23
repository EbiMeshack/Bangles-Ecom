"use client";

import { useState, useMemo, useEffect } from "react";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FilterSidebar } from "./FilterSidebar";
import { ProductCard } from "@/components/product/ProductCard";
import { CollectionSearch } from "./CollectionSearch";
import { CollectionPagination } from "./CollectionPagination";
import { MobileFilterDrawer } from "./MobileFilterDrawer";
import { useQuery, usePaginatedQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Skeleton } from "@/components/ui/skeleton";

interface CollectionsViewProps { }

export function CollectionsView({ }: CollectionsViewProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [minRating, setMinRating] = useState<number | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    // Fetch collection metadata for filters
    const metadata = useQuery(api.products.getCollectionMetadata);
    const categories = metadata?.categories || [];
    const minPrice = metadata?.minPrice || 0;
    const maxPrice = metadata?.maxPrice || 1000;

    const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);

    // Initialize price range when metadata loads
    useEffect(() => {
        if (metadata) {
            setPriceRange([metadata.minPrice, metadata.maxPrice]);
        }
    }, [metadata]);

    const ITEMS_PER_PAGE = 8;

    // Professional Pagination with Convex
    // We use a single query that returns the requested "page"
    // To maintain the "jump to page" design with Convex cursors, we'd normally need to track them.
    // For simplicity and design fidelity, we'll fetch the necessary items.
    const { results, status, loadMore } = usePaginatedQuery(
        api.products.getAllProducts,
        {
            search: searchQuery || undefined,
            category: selectedCategories.length === 1 ? selectedCategories[0] : undefined,
            minPrice: priceRange[0],
            maxPrice: priceRange[1],
            minRating: minRating || undefined,
        },
        { initialNumItems: ITEMS_PER_PAGE * currentPage }
    );

    const isLoadingFirst = status === "LoadingFirstPage";
    const isLoadingMore = status === "LoadingMore";
    const isExhausted = status === "Exhausted";

    // Since we fetch (currentPage * ITEMS_PER_PAGE) items to support "Page X" design,
    // we only display the last page worth of results.
    const paginatedProducts = useMemo(() => {
        if (!results) return [];
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return results.slice(start, start + ITEMS_PER_PAGE);
    }, [results, currentPage]);

    const filteredProductsCount = results?.length || 0; // This is only for current results
    // To show total results count and pages, we'll use a hack or wait for counts.
    // For now, let's use the metadata count as a fallback or the current results length.
    const totalCount = metadata?.totalCount || 0;

    const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

    const handlePageChange = (page: number) => {
        if (page < 1 || page > totalPages) return;

        // If we need more data for this page, we call loadMore
        if (results.length < page * ITEMS_PER_PAGE && !isExhausted) {
            loadMore(ITEMS_PER_PAGE);
        }

        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Auto-load more if current page requires it
    useEffect(() => {
        if (results && results.length < currentPage * ITEMS_PER_PAGE && !isExhausted && !isLoadingMore) {
            loadMore(ITEMS_PER_PAGE);
        }
    }, [currentPage, results, isExhausted, isLoadingMore, loadMore]);

    // Reset to page 1 when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, selectedCategories, priceRange, minRating]);

    return (
        <div className="container mx-auto px-4 py-8 md:px-12">
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
                                Showing {results?.length ? (currentPage - 1) * ITEMS_PER_PAGE + 1 : 0}-
                                {Math.min(currentPage * ITEMS_PER_PAGE, totalCount)} of {totalCount} results
                            </span>

                            {/* Pagination Controls (Top) */}
                            <div className="hidden sm:flex items-center ml-2">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    disabled={currentPage === 1 || isLoadingFirst}
                                    onClick={() => handlePageChange(currentPage - 1)}
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    disabled={currentPage === totalPages || totalPages === 0 || isLoadingMore}
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
                            <ProductCard key={product.id} product={product as any} />
                        ))}

                        {(isLoadingFirst || isLoadingMore) && Array.from({ length: 8 }).map((_, i) => (
                            <div key={`col-skel-${i}`} className="space-y-3">
                                <Skeleton className="aspect-square w-full rounded-lg" />
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-2/3" />
                                </div>
                            </div>
                        ))}

                        {totalCount === 0 && !isLoadingFirst && (
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

