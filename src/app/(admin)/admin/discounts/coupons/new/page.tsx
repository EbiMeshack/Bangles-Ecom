"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import { ArrowLeft, CalendarIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Id } from "@/convex/_generated/dataModel";
import { useForm, Controller, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { couponSchema, CouponFormValues } from "@/schemas/coupon.schema";

export default function NewCouponPage() {
    const router = useRouter();
    const createCoupon = useMutation(api.coupons.create);
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
        formState: { errors, isSubmitting },
    } = useForm<CouponFormValues>({
        resolver: zodResolver(couponSchema) as Resolver<CouponFormValues>,
        defaultValues: {
            code: "",
            description: "",
            discountType: "percentage",
            discountValue: 10,
            applicationType: "all",
            categoryIds: [], // Note: schema expects categoryIds
            productIds: [],   // Note: schema expects productIds
            minimumPurchaseAmount: undefined,
            maximumDiscountAmount: undefined,
            maxUsageCount: undefined,
            maxUsagePerUser: undefined,
            startDate: new Date(),
            expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
            isActive: true,
        },
    });

    const discountType = watch("discountType");
    const applicationType = watch("applicationType");
    const selectedCategories = watch("categoryIds") || [];
    const selectedProducts = watch("productIds") || [];

    const onSubmit = async (data: CouponFormValues) => {
        try {
            await createCoupon({
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
            console.error("Failed to create coupon:", error);
            alert(error.message || "Failed to create coupon");
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

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex items-center gap-4">
                <Link href="/admin/discounts/coupons">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Create New Coupon</h1>
                    <p className="text-muted-foreground">
                        Add a new discount code for your customers
                    </p>
                </div>
            </div>

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
                            <p className="text-xs text-muted-foreground">
                                Enter a unique code customers will use at checkout
                            </p>
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
                                <p className="text-xs text-muted-foreground">
                                    Cap the maximum discount amount (optional)
                                </p>
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
                        {isSubmitting ? "Creating..." : "Create Coupon"}
                    </Button>
                </div>
            </form>
        </div>
    );
}
