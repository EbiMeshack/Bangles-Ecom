"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash2, Search, Filter } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { EditOrderSheet } from "@/components/admin/orders/EditOrderSheet";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { format } from "date-fns";
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
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";

type Order = Doc<"orders">;
type UserProfile = Doc<"userProfiles">;

export default function OrdersPage() {
    const orders = useQuery(api.orders.getAllOrders);
    const users = useQuery(api.userProfiles.getAllUserProfiles);
    const deleteOrder = useMutation(api.orders.deleteOrder);

    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
    const [orderToDelete, setOrderToDelete] = useState<Order | null>(null);

    // Filter states
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const handleEdit = (order: Order) => {
        setSelectedOrder(order);
        setIsEditSheetOpen(true);
    };

    const handleDelete = (order: Order) => {
        setOrderToDelete(order);
    };

    const confirmDelete = async () => {
        if (!orderToDelete) return;
        try {
            await deleteOrder({ orderId: orderToDelete._id });
            toast.success("Order deleted successfully");
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete order");
        } finally {
            setOrderToDelete(null);
        }
    };

    // Helper to get user info
    const getUserName = (userId: string) => {
        const user = users?.find(u => u.userId === userId);
        return user ? user.name || user.email : "Unknown User";
    };

    // Calculate stats
    const totalOrders = orders?.length || 0;
    const pendingOrders = orders?.filter((o) => o.status === "pending").length || 0;
    const completedOrders = orders?.filter((o) => o.status === "completed").length || 0;
    const totalRevenue = orders?.reduce((acc, o) => acc + (o.amount || 0), 0) || 0;

    // Filter logic
    const filteredOrders = orders?.filter((order) => {
        const orderNumber = order.orderNumber || "";
        const userName = getUserName(order.userId).toLowerCase();
        const status = order.status || "pending";

        const matchesSearch =
            orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
            userName.includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === "all" || status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    // Pagination logic
    const totalPages = Math.ceil((filteredOrders?.length || 0) / itemsPerPage);
    const paginatedOrders = filteredOrders?.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const getStatusColor = (status: string) => {
        switch (status) {
            case "completed": return "success"; // Assuming you have a variant or use default/secondary
            case "pending": return "secondary";
            case "cancelled": return "destructive";
            case "shipped": return "default";
            default: return "outline";
        }
    };

    return (
        <div className="space-y-6">
            <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 -mx-4 -mt-4 mb-4">
                <SidebarTrigger className="-ml-1" />
                <span className="font-medium">Orders</span>
            </header>
            <div className="grid gap-4 md:grid-cols-4">
                <div className="rounded-lg border bg-card p-6 shadow-sm">
                    <h3 className="text-sm font-medium text-muted-foreground">Total Orders</h3>
                    <div className="text-2xl font-bold mt-2">{orders ? totalOrders : <Skeleton className="h-8 w-16" />}</div>
                    <p className="text-xs text-muted-foreground mt-1">All time orders</p>
                </div>
                <div className="rounded-lg border bg-card p-6 shadow-sm">
                    <h3 className="text-sm font-medium text-muted-foreground">Pending</h3>
                    <div className="text-2xl font-bold mt-2">{orders ? pendingOrders : <Skeleton className="h-8 w-16" />}</div>
                    <p className="text-xs text-muted-foreground mt-1">Orders processing</p>
                </div>
                <div className="rounded-lg border bg-card p-6 shadow-sm">
                    <h3 className="text-sm font-medium text-muted-foreground">Completed</h3>
                    <div className="text-2xl font-bold mt-2">{orders ? completedOrders : <Skeleton className="h-8 w-16" />}</div>
                    <p className="text-xs text-muted-foreground mt-1">Successfully delivered</p>
                </div>
                <div className="rounded-lg border bg-card p-6 shadow-sm">
                    <h3 className="text-sm font-medium text-muted-foreground">Total Revenue</h3>
                    <div className="text-2xl font-bold mt-2">
                        {orders ? `₹${(totalRevenue).toLocaleString()}` : <Skeleton className="h-8 w-16" />}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Gross sales</p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Orders</CardTitle>
                    <CardDescription>
                        Manage and track customer orders.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between items-center">
                        <div className="relative w-full md:w-72">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search orders..."
                                className="pl-8 rounded-full"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-2 w-full md:w-auto">
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-full md:w-[180px]">
                                    <div className="flex items-center gap-2">
                                        <Filter className="h-4 w-4 text-muted-foreground" />
                                        <SelectValue placeholder="All Status" />
                                    </div>
                                </SelectTrigger>
                                <SelectContent position="popper">
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="shipped">Shipped</SelectItem>
                                    <SelectItem value="completed">Completed</SelectItem>
                                    <SelectItem value="cancelled">Cancelled</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Order No.</TableHead>
                                    <TableHead>Customer</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="w-[70px]"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {orders === undefined ? (
                                    Array(5).fill(0).map((_, i) => (
                                        <TableRow key={i}>
                                            <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                            <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                                            <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                            <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                                            <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                                            <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                                        </TableRow>
                                    ))
                                ) : paginatedOrders?.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                                            No orders found matching your filters.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    paginatedOrders?.map((order) => (
                                        <TableRow key={order._id}>
                                            <TableCell className="font-medium">{order.orderNumber}</TableCell>
                                            <TableCell>{getUserName(order.userId)}</TableCell>
                                            <TableCell>{format(new Date(order.createdAt), "MMM d, yyyy")}</TableCell>
                                            <TableCell>₹{order.amount.toLocaleString()}</TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={getStatusColor(order.status) as any}
                                                    className="capitalize"
                                                >
                                                    {order.status}
                                                </Badge>
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
                                                        <DropdownMenuItem onClick={() => handleEdit(order)}>
                                                            <Pencil className="mr-2 h-4 w-4" />
                                                            Edit
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={() => handleDelete(order)}
                                                            className="text-red-600 focus:text-red-600"
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

            <EditOrderSheet
                order={selectedOrder}
                isOpen={isEditSheetOpen}
                onClose={() => setIsEditSheetOpen(false)}
            />

            <AlertDialog open={!!orderToDelete} onOpenChange={(open) => !open && setOrderToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the order record.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
