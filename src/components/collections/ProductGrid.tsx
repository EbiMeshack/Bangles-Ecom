import { Product } from "@/types/product";
import { ProductCard } from "./ProductCard";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ProductGridProps {
    products: Product[];
    currentPage: number;
    totalPages: number;
    totalResults: number;
    itemsPerPage: number;
    handlePageChange: (page: number) => void;
}

export function ProductGrid({
    products,
    currentPage,
    totalPages,
    totalResults,
    itemsPerPage,
    handlePageChange
}: ProductGridProps) {
    if (products.length === 0) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center text-muted-foreground min-h-[400px]">
                <p className="text-lg font-medium">No products found</p>
                <p className="text-sm mt-2">Try adjusting your filters or search criteria.</p>
            </div>
        );
    }

    return (
        <>
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-[#181611] dark:text-gray-100">Search Results</h1>
                <div className="flex items-center gap-4 mt-2 sm:mt-0">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Showing {Math.min((currentPage - 1) * itemsPerPage + 1, totalResults)}-{Math.min(currentPage * itemsPerPage, totalResults)} of {totalResults} results
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

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1 lg:gap-4 pb-10">
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </>
    );
}
