"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";
import { useMutation, useQuery } from "convex/react";
import { format } from "date-fns";
import { ArrowLeft, CalendarIcon, Loader2 } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, use } from "react";
import { useForm, Controller, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { couponSchema, type CouponFormValues } from "@/schemas/coupon.schema";

export default function EditCouponPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const { id } = use(params);
    const couponId = id as Id<"coupons">;

    const coupon = useQuery(api.coupons.get, { id: couponId });
    const updateCoupon = useMutation(api.coupons.update);
    const products = useQuery(api.products.getAllProducts, {
        paginationOpts: { numItems: 1000, cursor: null },
    });
    const metadata = useQuery(api.products.getCollectionMetadata);

    const {
        register,
        handleSubmit,
        control,
        watch,
        setValue,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<CouponFormValues>({
        resolver: zodResolver(couponSchema) as Resolver<CouponFormValues>,
        defaultValues: {
            code: "",
            description: "",
            discountType: "percentage",
            discountValue: 0,
            applicationType: "all",
            categoryIds: [],
            productIds: [],
            minimumPurchaseAmount: undefined,
            maximumDiscountAmount: undefined,
            maxUsageCount: undefined,
            maxUsagePerUser: undefined,
            startDate: new Date(),
            expiryDate: new Date(),
            isActive: true,
        },
    });

    // Populate form when coupon data is loaded
    useEffect(() => {
        if (coupon) {
            reset({
                code: coupon.code,
                description: coupon.description,
                discountType: (coupon.discountType === "percentage" || coupon.discountType === "flat") ? coupon.discountType : "percentage",
                discountValue: coupon.discountValue,
                applicationType: (coupon.applicationType === "category" || coupon.applicationType === "product") ? coupon.applicationType : "all",
                categoryIds: coupon.categoryIds || [],
                productIds: coupon.productIds || [],
                minimumPurchaseAmount: coupon.minimumPurchaseAmount,
                maximumDiscountAmount: coupon.maximumDiscountAmount,
                maxUsageCount: coupon.maxUsageCount,
                maxUsagePerUser: coupon.maxUsagePerUser,
                startDate: new Date(coupon.startDate),
                expiryDate: new Date(coupon.expiryDate),
                isActive: coupon.isActive,
            });
        }
    }, [coupon, reset]);

    const discountType = watch("discountType");
    const applicationType = watch("applicationType");
    const selectedCategories = watch("categoryIds") || [];
    const selectedProducts = watch("productIds") || [];

    const onSubmit = async (data: CouponFormValues) => {
        try {
            await updateCoupon({
                id: couponId,
                code: data.code,
                description: data.description,
                discountType: data.discountType,
                discountValue: data.discountValue,
                applicationType: data.applicationType,
                categoryIds: data.applicationType === "category" ? data.categoryIds : undefined,
                productIds: data.applicationType === "product" ? (data.productIds as Id<"products">[]) : undefined,
                minimumPurchaseAmount: data.minimumPurchaseAmount,
                maximumDiscountAmount: data.maximumDiscountAmount,
                maxUsageCount: data.maxUsageCount,
                maxUsagePerUser: data.maxUsagePerUser,
                startDate: data.startDate.getTime(),
                expiryDate: data.expiryDate.getTime(),
                isActive: data.isActive,
            });

            router.push("/admin/discounts/coupons");
        } catch (error: any) {
            console.error("Failed to update coupon:", error);
            alert(error.message || "Failed to update coupon");
        }
    };

    const toggleCategory = (category: string) => {
        const current = selectedCategories;
        const updated = current.includes(category)
            ? current.filter((c) => c !== category)
            : [...current, category];
        setValue("categoryIds", updated, { shouldValidate: true });
    };

    const toggleProduct = (productId: string) => {
        const current = selectedProducts;
        const updated = current.includes(productId)
            ? current.filter((p) => p !== productId)
            : [...current, productId];
        setValue("productIds", updated, { shouldValidate: true });
    };

    if (!coupon) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 -mx-4 -mt-4 mb-4">
                <SidebarTrigger className="-ml-1" />
                <span className="font-medium">Edit Coupon</span>
            </header>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Link href="/admin/discounts/coupons">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-xl font-semibold tracking-tight">Back to Coupons</h1>

                    </div>
                </div>
            </div>

            {/* Usage Statistics */}
            <Card>
                <CardHeader>
                    <CardTitle>Usage Statistics</CardTitle>
                    <CardDescription>Current performance of this coupon</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <div className="text-sm font-medium text-muted-foreground">Total Uses</div>
                            <div className="text-2xl font-bold">{coupon.stats.totalUsages}</div>
                        </div>
                        <div>
                            <div className="text-sm font-medium text-muted-foreground">Unique Users</div>
                            <div className="text-2xl font-bold">{coupon.stats.uniqueUsers}</div>
                        </div>
                        <div>
                            <div className="text-sm font-medium text-muted-foreground">Total Discount</div>
                            <div className="text-2xl font-bold">₹{coupon.stats.totalDiscount}</div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Basic Information */}
                <Card>
                    <CardHeader>
                        <CardTitle>Basic Information</CardTitle>
                        <CardDescription>
                            Define the coupon code and description
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="code">Coupon Code *</Label>
                            <Input
                                id="code"
                                placeholder="e.g., SAVE20, WELCOME10"
                                maxLength={20}
                                {...register("code")}
                            />
                            {errors.code && (
                                <p className="text-red-500 text-sm">{errors.code.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description *</Label>
                            <Textarea
                                id="description"
                                placeholder="e.g., 20% off on all bangles"
                                rows={3}
                                {...register("description")}
                            />
                            {errors.description && (
                                <p className="text-red-500 text-sm">{errors.description.message}</p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Discount Configuration */}
                <Card>
                    <CardHeader>
                        <CardTitle>Discount Configuration</CardTitle>
                        <CardDescription>
                            Set how much discount to apply
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="discountType">Discount Type *</Label>
                                <Controller
                                    name="discountType"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <SelectTrigger id="discountType">
                                                <SelectValue placeholder="Select type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="percentage">Percentage (%)</SelectItem>
                                                <SelectItem value="flat">Flat Amount (₹)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                                {errors.discountType && (
                                    <p className="text-red-500 text-sm">{errors.discountType.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="discountValue">
                                    {discountType === "percentage" ? "Percentage (%)" : "Amount (₹)"} *
                                </Label>
                                <Input
                                    id="discountValue"
                                    type="number"
                                    step={discountType === "percentage" ? "1" : "0.01"}
                                    {...register("discountValue")}
                                />
                                {errors.discountValue && (
                                    <p className="text-red-500 text-sm">{errors.discountValue.message}</p>
                                )}
                            </div>
                        </div>

                        {discountType === "percentage" && (
                            <div className="space-y-2">
                                <Label htmlFor="maxDiscount">Maximum Discount Amount (₹)</Label>
                                <Input
                                    id="maxDiscount"
                                    type="number"
                                    step="0.01"
                                    placeholder="Optional cap on discount"
                                    {...register("maximumDiscountAmount")}
                                />
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Applicability */}
                <Card>
                    <CardHeader>
                        <CardTitle>Applicability</CardTitle>
                        <CardDescription>
                            Choose where this coupon can be applied
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="applicationType">Application Type *</Label>
                            <Controller
                                name="applicationType"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <SelectTrigger id="applicationType">
                                            <SelectValue placeholder="Select application" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Products</SelectItem>
                                            <SelectItem value="category">Specific Categories</SelectItem>
                                            <SelectItem value="product">Specific Products</SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.applicationType && (
                                <p className="text-red-500 text-sm">{errors.applicationType.message}</p>
                            )}
                        </div>

                        {applicationType === "category" && metadata && (
                            <div className="space-y-2">
                                <Label>Select Categories *</Label>
                                <div className="grid grid-cols-2 gap-2">
                                    {metadata.categories.map((category) => (
                                        <div
                                            key={category}
                                            className={cn(
                                                "flex items-center space-x-2 rounded-md border p-3 cursor-pointer transition-colors",
                                                selectedCategories.includes(category)
                                                    ? "border-primary bg-primary/10"
                                                    : "hover:bg-accent"
                                            )}
                                            onClick={() => toggleCategory(category)}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={selectedCategories.includes(category)}
                                                onChange={() => toggleCategory(category)}
                                                className="h-4 w-4"
                                            />
                                            <span className="text-sm font-medium">{category}</span>
                                        </div>
                                    ))}
                                </div>
                                {errors.categoryIds && (
                                    <p className="text-red-500 text-sm">{errors.categoryIds.message}</p>
                                )}
                            </div>
                        )}

                        {applicationType === "product" && products?.page && (
                            <div className="space-y-2">
                                <Label>Select Products *</Label>
                                <div className="max-h-64 overflow-y-auto border rounded-md p-2">
                                    {products.page.map((product) => (
                                        <div
                                            key={product.id}
                                            className={cn(
                                                "flex items-center space-x-2 rounded-md p-2 cursor-pointer transition-colors",
                                                selectedProducts.includes(product.id)
                                                    ? "bg-primary/10"
                                                    : "hover:bg-accent"
                                            )}
                                            onClick={() => toggleProduct(product.id)}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={selectedProducts.includes(product.id)}
                                                onChange={() => toggleProduct(product.id)}
                                                className="h-4 w-4"
                                            />
                                            <span className="text-sm">{product.name}</span>
                                            <span className="text-xs text-muted-foreground ml-auto">
                                                ₹{product.price}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                                {errors.productIds && (
                                    <p className="text-red-500 text-sm">{errors.productIds.message}</p>
                                )}
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="minPurchase">Minimum Purchase Amount (₹)</Label>
                            <Input
                                id="minPurchase"
                                type="number"
                                step="0.01"
                                placeholder="No minimum"
                                {...register("minimumPurchaseAmount")}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Usage Limits */}
                <Card>
                    <CardHeader>
                        <CardTitle>Usage Limits</CardTitle>
                        <CardDescription>
                            Control how many times the coupon can be used
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="maxUsageCount">Total Usage Limit</Label>
                                <Input
                                    id="maxUsageCount"
                                    type="number"
                                    min="1"
                                    placeholder="Unlimited"
                                    {...register("maxUsageCount")}
                                />
                                {coupon.currentUsageCount > 0 && (
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Current: {coupon.currentUsageCount} used
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="maxUsagePerUser">Usage per User</Label>
                                <Input
                                    id="maxUsagePerUser"
                                    type="number"
                                    min="1"
                                    placeholder="Unlimited"
                                    {...register("maxUsagePerUser")}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Validity Period */}
                <Card>
                    <CardHeader>
                        <CardTitle>Validity Period</CardTitle>
                        <CardDescription>
                            Set when the coupon is valid
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Start Date *</Label>
                                <Controller
                                    control={control}
                                    name="startDate"
                                    render={({ field }) => (
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    className={cn(
                                                        "w-full justify-start text-left font-normal",
                                                        !field.value && "text-muted-foreground"
                                                    )}
                                                >
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    {field.value ? format(field.value, "PPP") : "Pick a date"}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0">
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value}
                                                    onSelect={field.onChange}
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    )}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Expiry Date *</Label>
                                <Controller
                                    control={control}
                                    name="expiryDate"
                                    render={({ field }) => (
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    className={cn(
                                                        "w-full justify-start text-left font-normal",
                                                        !field.value && "text-muted-foreground"
                                                    )}
                                                >
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    {field.value ? format(field.value, "PPP") : "Pick a date"}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0">
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value}
                                                    onSelect={field.onChange}
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    )}
                                />
                                {errors.expiryDate && (
                                    <p className="text-red-500 text-sm">{errors.expiryDate.message}</p>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Status */}
                <Card>
                    <CardHeader>
                        <CardTitle>Status</CardTitle>
                        <CardDescription>
                            Enable or disable the coupon
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>Active Status</Label>
                                <p className="text-sm text-muted-foreground">
                                    Make this coupon available for use
                                </p>
                            </div>
                            <Controller
                                control={control}
                                name="isActive"
                                render={({ field }) => (
                                    <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                )}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Actions */}
                <div className="flex justify-end gap-4">
                    <Link href="/admin/discounts/coupons">
                        <Button type="button" variant="outline">
                            Cancel
                        </Button>
                    </Link>
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Updating..." : "Update Coupon"}
                    </Button>
                </div>
            </form>
        </div>
    );
}
