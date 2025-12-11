import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

interface CollectionPaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export function CollectionPagination({
    currentPage,
    totalPages,
    onPageChange,
}: CollectionPaginationProps) {
    if (totalPages <= 1) return null;

    return (
        <Pagination>
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            if (currentPage > 1) onPageChange(currentPage - 1);
                        }}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                </PaginationItem>

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
                                        onPageChange(item as number);
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
                            if (currentPage < totalPages) onPageChange(currentPage + 1);
                        }}
                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
}
