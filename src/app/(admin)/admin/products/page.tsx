"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus, MoreHorizontal, Edit, Trash2, Search } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ProductSheet } from "@/components/admin/products/ProductSheet";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { toast } from "sonner";
import Image from "next/image";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";

export default function AdminProductsPage() {
    const [search, setSearch] = useState("");
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Doc<"products"> | null>(null);

    // Using pagination with a large limit for now to simulate "all" with search
    // Ideally use usePaginatedQuery but for simplicity with search filtering we'll grab a chunk
    // Use the getAdminProducts query we created
    const productsResult = useQuery(api.products.getAdminProducts, {
        paginationOpts: { numItems: 50, cursor: null },
        search: search
    });

    const deleteProduct = useMutation(api.products.deleteProduct);

    const handleEdit = (product: Doc<"products">) => {
        setSelectedProduct(product);
        setIsSheetOpen(true);
    };

    const handleCreate = () => {
        setSelectedProduct(null);
        setIsSheetOpen(true);
    };

    const handleDelete = async (id: Id<"products">) => {
        if (confirm("Are you sure you want to delete this product?")) {
            try {
                await deleteProduct({ id });
                toast.success("Product deleted successfully");
            } catch (error) {
                console.error(error);
                toast.error("Failed to delete product");
            }
        }
    };

    const products = productsResult?.page || [];

    return (
        <div className="space-y-6">
            <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 -mx-4 -mt-4 mb-6">
                <SidebarTrigger className="-ml-1" />
                <span className="font-medium">Products</span>
            </header>

            <div className="flex items-center justify-between py-4">
                <div className="relative w-full max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search products..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-8 rounded-full"
                    />
                </div>
                <Link href="/admin/products/new">
                    <Button className="rounded-full">
                        <Plus className="mr-2 h-4 w-4" /> Add Product
                    </Button>
                </Link>
            </div>

            <div className="rounded-md border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[80px]">Image</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Stock</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {productsResult === undefined ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">
                                    Loading products...
                                </TableCell>
                            </TableRow>
                        ) : products.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">
                                    No products found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            products.map((product) => (
                                <TableRow key={product._id}>
                                    <TableCell>
                                        <div className="relative h-10 w-10">
                                            <Image
                                                src={product.image}
                                                alt={product.name}
                                                fill
                                                className="rounded-md object-cover"
                                            />
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-medium">{product.name}</TableCell>
                                    <TableCell>{product.category}</TableCell>
                                    <TableCell>{formatCurrency(product.price)}</TableCell>
                                    <TableCell>{product.quantity}</TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <span className="sr-only">Open menu</span>
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => handleEdit(product)} className="cursor-pointer">
                                                    <Edit className="mr-2 h-4 w-4" /> Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => handleDelete(product._id)}
                                                    className="text-red-600 focus:text-red-600 cursor-pointer"
                                                >
                                                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <ProductSheet
                isOpen={isSheetOpen}
                onClose={() => setIsSheetOpen(false)}
                product={selectedProduct}
            />
        </div>
    );
}
