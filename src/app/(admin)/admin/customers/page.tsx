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
import { EditUserSheet } from "@/components/admin/customers/EditUserSheet";
import { Doc } from "@/convex/_generated/dataModel";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";

export default function CustomersPage() {
    const users = useQuery(api.userProfiles.getAllUserProfiles);
    const deleteUser = useMutation(api.userProfiles.deleteUserProfile);

    const [selectedUser, setSelectedUser] = useState<Doc<"userProfiles"> | null>(null);
    const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<Doc<"userProfiles"> | null>(null);

    // Filter states
    const [searchQuery, setSearchQuery] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const handleEdit = (user: Doc<"userProfiles">) => {
        setSelectedUser(user);
        setIsEditSheetOpen(true);
    };

    const handleDelete = (user: Doc<"userProfiles">) => {
        setUserToDelete(user);
    };

    const confirmDelete = async () => {
        if (!userToDelete) return;
        try {
            await deleteUser({ userId: userToDelete.userId });
            toast.success("User deleted successfully");
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete user");
        } finally {
            setUserToDelete(null);
        }
    };

    // Calculate stats
    const totalUsers = users?.length || 0;
    const totalAdmins = users?.filter((u) => u.role === "admin").length || 0;
    const newUsers = users?.filter((u) => {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return new Date(u.createdAt) > thirtyDaysAgo;
    }).length || 0;

    // Filter logic
    const filteredUsers = users?.filter((user) => {
        const name = user.name || "";
        const email = user.email || "";
        const role = user.role || "user";

        const matchesSearch =
            name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesRole = roleFilter === "all" || role === roleFilter;
        return matchesSearch && matchesRole;
    });

    // Pagination logic
    const totalPages = Math.ceil((filteredUsers?.length || 0) / itemsPerPage);
    const paginatedUsers = filteredUsers?.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const getInitials = (name?: string) => {
        if (!name) return "U";
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .substring(0, 2);
    };

    return (
        <div className="space-y-6">
            <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 -mx-4 -mt-4 mb-4">
                <SidebarTrigger className="-ml-1" />
                <span className="font-medium">Customers</span>
            </header>

            <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-lg border bg-card p-6 shadow-sm">
                    <h3 className="text-sm font-medium text-muted-foreground">Total Customers</h3>
                    <div className="text-2xl font-bold mt-2">{users ? totalUsers : <Skeleton className="h-8 w-16" />}</div>
                    <p className="text-xs text-muted-foreground mt-1">Across all regions</p>
                </div>
                <div className="rounded-lg border bg-card p-6 shadow-sm">
                    <h3 className="text-sm font-medium text-muted-foreground">Administrators</h3>
                    <div className="text-2xl font-bold mt-2">{users ? totalAdmins : <Skeleton className="h-8 w-16" />}</div>
                    <p className="text-xs text-muted-foreground mt-1">Manage the platform</p>
                </div>
                <div className="rounded-lg border bg-card p-6 shadow-sm">
                    <h3 className="text-sm font-medium text-muted-foreground">New Customers</h3>
                    <div className="text-2xl font-bold mt-2">{users ? newUsers : <Skeleton className="h-8 w-16" />}</div>
                    <p className="text-xs text-muted-foreground mt-1">In the last 30 days</p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Customers</CardTitle>
                    <CardDescription>
                        Manage your customers, view their details and permissions.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between items-center">
                        <div className="relative w-full md:w-72">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search customers..."
                                className="pl-8 rounded-full"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-2 w-full md:w-auto">
                            <Select value={roleFilter} onValueChange={setRoleFilter}>
                                <SelectTrigger className="w-full md:w-[180px]">
                                    <div className="flex items-center gap-2">
                                        <Filter className="h-4 w-4 text-muted-foreground" />
                                        <SelectValue placeholder="All Roles" />
                                    </div>
                                </SelectTrigger>
                                <SelectContent position="popper">
                                    <SelectItem value="all">All Roles</SelectItem>
                                    <SelectItem value="user">User</SelectItem>
                                    <SelectItem value="admin">Admin</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[50px]"></TableHead>
                                    <TableHead>Customer</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead>Joined</TableHead>
                                    <TableHead className="w-[70px]"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {users === undefined ? (
                                    Array(5).fill(0).map((_, i) => (
                                        <TableRow key={i}>
                                            <TableCell><Skeleton className="h-10 w-10 rounded-full" /></TableCell>
                                            <TableCell>
                                                <div className="space-y-2">
                                                    <Skeleton className="h-4 w-[150px]" />
                                                    <Skeleton className="h-3 w-[100px]" />
                                                </div>
                                            </TableCell>
                                            <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                                            <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                            <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                                        </TableRow>
                                    ))
                                ) : paginatedUsers?.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                                            No customers found matching your filters.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    paginatedUsers?.map((user) => (
                                        <TableRow key={user._id}>
                                            <TableCell>
                                                <Avatar>
                                                    <AvatarImage src="" /> {/* Add user image if available */}
                                                    <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                                                </Avatar>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span className="font-medium">{user.name || "Unknown User"}</span>
                                                    <span className="text-xs text-muted-foreground">{user.email}</span>
                                                    {user.phoneNumber && (
                                                        <span className="text-xs text-muted-foreground">{user.phoneNumber}</span>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={user.role === "admin" ? "default" : "secondary"}
                                                    className="capitalize"
                                                >
                                                    {user.role}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>{format(new Date(user.createdAt), "MMM d, yyyy")}</TableCell>
                                            <TableCell>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                                            <span className="sr-only">Open menu</span>
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem onClick={() => handleEdit(user)}>
                                                            <Pencil className="mr-2 h-4 w-4" />
                                                            Edit
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={() => handleDelete(user)}
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

            <EditUserSheet
                user={selectedUser}
                isOpen={isEditSheetOpen}
                onClose={() => setIsEditSheetOpen(false)}
            />

            <AlertDialog open={!!userToDelete} onOpenChange={(open) => !open && setUserToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the user account
                            and remove their data from our servers.
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
