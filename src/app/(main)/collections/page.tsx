"use client";

import { useState, useMemo, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FilterSidebar } from "@/components/collections/FilterSidebar";
import { MobileFilter } from "@/components/collections/MobileFilter";
import { ProductGrid } from "@/components/collections/ProductGrid";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationPrevious,
    PaginationNext,
    PaginationEllipsis,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import productsData from "@/data/products.json";
import { Product } from "@/types/product";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CollectionSearch } from "@/components/collections/CollectionSearch";

const ITEMS_PER_PAGE = 8;

export default function CollectionsPage() {
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000]);
    const [minRating, setMinRating] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    // Reset pagination when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [selectedCategories, priceRange, minRating, searchQuery]);

    // Filtering Logic
    const filteredProducts = useMemo(() => {
        return (productsData as Product[]).filter((product) => {
            // Search Filter
            if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase())) {
                return false;
            }

            // Category Filter
            if (selectedCategories.length > 0 && !selectedCategories.includes(product.category)) {
                return false;
            }

            // Price Filter
            if (product.price < priceRange[0] || product.price > priceRange[1]) {
                return false;
            }

            // Rating Filter
            if (minRating !== null && product.rating < minRating) {
                return false;
            }

            return true;
        });
    }, [selectedCategories, priceRange, minRating, searchQuery]);

    // Pagination Logic
    const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
    const paginatedProducts = filteredProducts.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return (
        <div className="flex min-h-screen flex-col font-sans">
            <Header />

            <main className="flex-1 container mx-auto px-4 py-8">
                {/* Search Section matched to code.html */}
                {/* Search Section matched to code.html */}
                <CollectionSearch value={searchQuery} onChange={setSearchQuery} />

                <MobileFilter
                    selectedCategories={selectedCategories}
                    setSelectedCategories={setSelectedCategories}
                    priceRange={priceRange}
                    setPriceRange={setPriceRange}
                    minRating={minRating}
                    setMinRating={setMinRating}
                />

                <div className="flex flex-col md:flex-row gap-12 items-start">
                    <FilterSidebar
                        selectedCategories={selectedCategories}
                        setSelectedCategories={setSelectedCategories}
                        priceRange={priceRange}
                        setPriceRange={setPriceRange}
                        minRating={minRating}
                        setMinRating={setMinRating}
                        className="hidden md:block"
                    />

                    <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
                            <h1 className="text-2xl font-bold text-[#181611] dark:text-gray-100">Search Results</h1>
                            <div className="flex items-center gap-4 mt-2 sm:mt-0">
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Showing {Math.min((currentPage - 1) * ITEMS_PER_PAGE + 1, filteredProducts.length)}-{Math.min(currentPage * ITEMS_PER_PAGE, filteredProducts.length)} of {filteredProducts.length} results
                                </p>
                                <div className="hidden md:flex items-center gap-1">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        aria-label="Previous page"
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        aria-label="Next page"
                                    >
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <ProductGrid products={paginatedProducts} />

                        {/* Pagination matched to code.html */}
                        {totalPages > 1 && (
                            <Pagination className="mt-12">
                                <PaginationContent>
                                    <PaginationItem>
                                        <PaginationPrevious
                                            href="#"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                if (currentPage > 1) handlePageChange(currentPage - 1);
                                            }}
                                            className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                        />
                                    </PaginationItem>

                                    {/* Smart Pagination Logic */}
                                    {(() => {
                                        const items = [];
                                        const maxVisible = 5; // Max buttons to show including ellipses

                                        if (totalPages <= maxVisible) {
                                            for (let i = 1; i <= totalPages; i++) {
                                                items.push(i);
                                            }
                                        } else {
                                            if (currentPage <= 3) {
                                                items.push(1, 2, 3, "ellipsis", totalPages);
                                            } else if (currentPage >= totalPages - 2) {
                                                items.push(1, "ellipsis", totalPages - 2, totalPages - 1, totalPages);
                                            } else {
                                                items.push(1, "ellipsis", currentPage, "ellipsis", totalPages);
                                            }
                                        }

                                        return items.map((item, index) => (
                                            <PaginationItem key={index}>
                                                {item === "ellipsis" ? (
                                                    <PaginationEllipsis />
                                                ) : (
                                                    <PaginationLink
                                                        href="#"
                                                        isActive={currentPage === item}
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            handlePageChange(item as number);
                                                        }}
                                                        className="cursor-pointer"
                                                    >
                                                        {item}
                                                    </PaginationLink>
                                                )}
                                            </PaginationItem>
                                        ));
                                    })()}

                                    <PaginationItem>
                                        <PaginationNext
                                            href="#"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                if (currentPage < totalPages) handlePageChange(currentPage + 1);
                                            }}
                                            className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                        />
                                    </PaginationItem>
                                </PaginationContent>
                            </Pagination>
                        )}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
