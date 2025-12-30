"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";
import { Plus, Edit, Trash2, Search, Tag, Calendar, Users, TrendingUp } from "lucide-react";
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
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function CouponsPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [filterActive, setFilterActive] = useState<boolean | undefined>(undefined);

    const coupons = useQuery(api.coupons.list, { isActive: filterActive });
    const removeCoupon = useMutation(api.coupons.remove);

    const filteredCoupons = coupons?.filter(coupon =>
        coupon.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        coupon.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDelete = async (id: Id<"coupons">) => {
        try {
            await removeCoupon({ id });
        } catch (error) {
            console.error("Failed to delete coupon:", error);
            alert("Failed to delete coupon");
        }
    };

    const formatDate = (timestamp: number) => {
        return new Date(timestamp).toLocaleDateString("en-IN", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
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

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Coupons</h1>
                    <p className="text-muted-foreground">
                        Manage discount codes and promotional offers
                    </p>
                </div>
                <Link href="/admin/discounts/coupons/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Create Coupon
                    </Button>
                </Link>
            </div>

            {/* Stats Cards */}
            {coupons && (
                <div className="grid gap-4 md:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Coupons</CardTitle>
                            <Tag className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{coupons.length}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Coupons</CardTitle>
                            <TrendingUp className="h-4 w-4 text-emerald-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {coupons.filter(c => c.isActive && !isExpired(c.expiryDate)).length}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Uses</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {coupons.reduce((sum, c) => sum + c.stats.totalUsages, 0)}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Discount Given</CardTitle>
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                ₹{coupons.reduce((sum, c) => sum + c.stats.totalDiscount, 0).toFixed(2)}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Filters */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search coupons..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-8"
                            />
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant={filterActive === undefined ? "default" : "outline"}
                                onClick={() => setFilterActive(undefined)}
                            >
                                All
                            </Button>
                            <Button
                                variant={filterActive === true ? "default" : "outline"}
                                onClick={() => setFilterActive(true)}
                            >
                                Active
                            </Button>
                            <Button
                                variant={filterActive === false ? "default" : "outline"}
                                onClick={() => setFilterActive(false)}
                            >
                                Inactive
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {!coupons ? (
                        <div className="text-center py-8 text-muted-foreground">
                            Loading coupons...
                        </div>
                    ) : filteredCoupons && filteredCoupons.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            No coupons found
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Code</TableHead>
                                    <TableHead>Discount</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Valid Until</TableHead>
                                    <TableHead>Usage</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredCoupons?.map((coupon) => (
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
                                            {formatDate(coupon.expiryDate)}
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
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link href={`/admin/discounts/coupons/${coupon._id}`}>
                                                    <Button variant="ghost" size="sm">
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button variant="ghost" size="sm">
                                                            <Trash2 className="h-4 w-4 text-destructive" />
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Delete Coupon?</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                Are you sure you want to delete coupon "{coupon.code}"?
                                                                This action cannot be undone and will delete all usage history.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                            <AlertDialogAction
                                                                onClick={() => handleDelete(coupon._id)}
                                                                className="bg-destructive text-destructive-foreground"
                                                            >
                                                                Delete
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
