"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";
import { Plus, Edit, Trash2, Search, Filter, MoreHorizontal } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import Link from "next/link";
import { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { EditCouponSheet } from "@/components/admin/discounts/EditCouponSheet";
import { Doc } from "@/convex/_generated/dataModel";

export default function CouponsPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Convert status filter to boolean or undefined for the query
    const isActiveArg = statusFilter === "all" ? undefined : statusFilter === "active";

    const coupons = useQuery(api.coupons.list, { isActive: isActiveArg });
    const removeCoupon = useMutation(api.coupons.remove);
    const [couponToDelete, setCouponToDelete] = useState<Id<"coupons"> | null>(null);
    const [couponToEdit, setCouponToEdit] = useState<Doc<"coupons"> | null>(null);
    const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);

    const filteredCoupons = coupons?.filter(coupon =>
        coupon.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        coupon.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Pagination logic
    const totalPages = Math.ceil((filteredCoupons?.length || 0) / itemsPerPage);
    const paginatedCoupons = filteredCoupons?.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleDelete = async () => {
        if (!couponToDelete) return;
        try {
            await removeCoupon({ id: couponToDelete });
            setCouponToDelete(null);
        } catch (error) {
            console.error("Failed to delete coupon:", error);
            alert("Failed to delete coupon");
        }
    };

    const getDiscountDisplay = (coupon: any) => {
        if (coupon.discountType === "percentage") {
            return `${coupon.discountValue}% OFF`;
        }
        return `₹${coupon.discountValue} OFF`;
    };

    const getApplicationTypeDisplay = (coupon: any) => {
        if (coupon.applicationType === "all") return "All Products";
        if (coupon.applicationType === "category") return "Category Specific";
        return "Product Specific";
    };

    const isExpired = (expiryDate: number) => {
        return Date.now() > expiryDate;
    };

    // Calculate stats
    const totalCoupons = coupons?.length || 0;
    const activeCoupons = coupons?.filter(c => c.isActive && !isExpired(c.expiryDate)).length || 0;
    const totalUses = coupons?.reduce((sum, c) => sum + c.stats.totalUsages, 0) || 0;
    const totalDiscount = coupons?.reduce((sum, c) => sum + c.stats.totalDiscount, 0) || 0;

    return (
        <div className="space-y-6">
            <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 -mx-4 -mt-4 mb-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10 transition-all">
                <SidebarTrigger className="-ml-1" />
                <div className="flex flex-col flex-1">
                    <span className="font-semibold text-lg leading-tight">Coupons</span>
                    <span className="text-xs text-muted-foreground hidden md:inline">Manage discount codes</span>
                </div>
            </header>
            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-4">
                <div className="rounded-lg border bg-card p-6 shadow-sm">
                    <h3 className="text-sm font-medium text-muted-foreground">Total Coupons</h3>
                    <div className="text-2xl font-bold mt-2">{coupons ? totalCoupons : <Skeleton className="h-8 w-16" />}</div>
                    <p className="text-xs text-muted-foreground mt-1">All time created</p>
                </div>
                <div className="rounded-lg border bg-card p-6 shadow-sm">
                    <h3 className="text-sm font-medium text-muted-foreground">Active Coupons</h3>
                    <div className="text-2xl font-bold mt-2">{coupons ? activeCoupons : <Skeleton className="h-8 w-16" />}</div>
                    <p className="text-xs text-muted-foreground mt-1">Currently valid</p>
                </div>
                <div className="rounded-lg border bg-card p-6 shadow-sm">
                    <h3 className="text-sm font-medium text-muted-foreground">Total Uses</h3>
                    <div className="text-2xl font-bold mt-2">{coupons ? totalUses : <Skeleton className="h-8 w-16" />}</div>
                    <p className="text-xs text-muted-foreground mt-1">across all orders</p>
                </div>
                <div className="rounded-lg border bg-card p-6 shadow-sm">
                    <h3 className="text-sm font-medium text-muted-foreground">Total Discount</h3>
                    <div className="text-2xl font-bold mt-2">{coupons ? `₹${totalDiscount.toFixed(2)}` : <Skeleton className="h-8 w-16" />}</div>
                    <p className="text-xs text-muted-foreground mt-1">Given to customers</p>
                </div>
            </div>

            {/* Main Content Card */}
            <Card>
                <CardHeader>
                    <CardTitle>All Coupons</CardTitle>
                    <CardDescription>
                        View and manage all discount coupons.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between items-center">
                        <div className="relative w-full md:w-72">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search coupons..."
                                className="pl-8 rounded-full"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-2 w-full md:w-auto">
                            <Link href="/admin/discounts/coupons/new">
                                <Button className="rounded-full whitespace-nowrap">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Create Coupon
                                </Button>
                            </Link>
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-full md:w-[180px]">
                                    <div className="flex items-center gap-2">
                                        <Filter className="h-4 w-4 text-muted-foreground" />
                                        <SelectValue placeholder="All Status" />
                                    </div>
                                </SelectTrigger>
                                <SelectContent position="popper">
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="inactive">Inactive</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Code</TableHead>
                                    <TableHead>Discount</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Valid Until</TableHead>
                                    <TableHead>Usage</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="w-[70px]"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {coupons === undefined ? (
                                    Array(5).fill(0).map((_, i) => (
                                        <TableRow key={i}>
                                            <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                                            <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                                            <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                                            <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                                            <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                                            <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                                            <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                                        </TableRow>
                                    ))
                                ) : paginatedCoupons?.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                                            No coupons found matching your filters.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    paginatedCoupons?.map((coupon) => (
                                        <TableRow key={coupon._id}>
                                            <TableCell className="font-mono font-semibold">
                                                {coupon.code}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="secondary">
                                                    {getDiscountDisplay(coupon)}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-sm text-muted-foreground">
                                                {getApplicationTypeDisplay(coupon)}
                                            </TableCell>
                                            <TableCell className="text-sm">
                                                {format(coupon.expiryDate, "MMM d, yyyy")}
                                            </TableCell>
                                            <TableCell>
                                                <div className="text-sm">
                                                    <div>{coupon.stats.totalUsages} uses</div>
                                                    <div className="text-xs text-muted-foreground">
                                                        {coupon.stats.uniqueUsers} users
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {isExpired(coupon.expiryDate) ? (
                                                    <Badge variant="destructive">Expired</Badge>
                                                ) : coupon.isActive ? (
                                                    <Badge variant="default" className="bg-emerald-600">
                                                        Active
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="secondary">Inactive</Badge>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                                            <span className="sr-only">Open menu</span>
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem
                                                            className="cursor-pointer"
                                                            onClick={() => {
                                                                setCouponToEdit(coupon);
                                                                setIsEditSheetOpen(true);
                                                            }}
                                                        >
                                                            <Edit className="mr-2 h-4 w-4" />
                                                            Edit
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={() => setCouponToDelete(coupon._id)}
                                                            className="text-red-600 focus:text-red-600 cursor-pointer"
                                                        >
                                                            <Trash2 className="mr-2 h-4 w-4" />
                                                            Delete
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

                    {totalPages > 1 && (
                        <div className="mt-4 flex justify-end">
                            <Pagination>
                                <PaginationContent>
                                    <PaginationItem>
                                        <PaginationPrevious
                                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                            className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                        />
                                    </PaginationItem>
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                        <PaginationItem key={page}>
                                            <PaginationLink
                                                isActive={currentPage === page}
                                                onClick={() => setCurrentPage(page)}
                                                className="cursor-pointer"
                                            >
                                                {page}
                                            </PaginationLink>
                                        </PaginationItem>
                                    ))}
                                    <PaginationItem>
                                        <PaginationNext
                                            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                            className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                        />
                                    </PaginationItem>
                                </PaginationContent>
                            </Pagination>
                        </div>
                    )}
                </CardContent>
            </Card>

            <AlertDialog open={!!couponToDelete} onOpenChange={(open) => !open && setCouponToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the coupon
                            and all its usage history.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <EditCouponSheet
                coupon={couponToEdit}
                isOpen={isEditSheetOpen}
                onClose={() => {
                    setIsEditSheetOpen(false);
                    setCouponToEdit(null);
                }}
            />
        </div>
    );
}
