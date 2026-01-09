"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";
import { couponSchema, type CouponFormValues } from "@/schemas/coupon.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "convex/react";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import { useEffect } from "react";
import { Controller, Resolver, useForm } from "react-hook-form";
import { toast } from "sonner";

interface EditCouponSheetProps {
    coupon: Doc<"coupons"> | null;
    isOpen: boolean;
    onClose: () => void;
}

export function EditCouponSheet({ coupon, isOpen, onClose }: EditCouponSheetProps) {
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
        if (!coupon) return;
        try {
            await updateCoupon({
                id: coupon._id,
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
            toast.success("Coupon updated successfully");
            onClose();
        } catch (error: any) {
            console.error("Failed to update coupon:", error);
            toast.error(error.message || "Failed to update coupon");
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
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent className="flex w-full flex-col sm:max-w-lg">
                <SheetHeader>
                    <SheetTitle>Edit Coupon</SheetTitle>
                    <SheetDescription>
                        Modify coupon details and constraints.
                    </SheetDescription>
                </SheetHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="flex-1 flex flex-col min-h-0">
                    <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
                        {/* Basic Information */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-medium border-b pb-1 text-primary">Basic Info</h3>
                            <div className="grid grid-cols-4 gap-4 items-center">
                                <Label htmlFor="code" className="text-right">Code</Label>
                                <div className="col-span-3">
                                    <Input
                                        id="code"
                                        placeholder="SAVE20"
                                        {...register("code")}
                                        className={cn(errors.code && "border-red-500")}
                                    />
                                    {errors.code && <p className="text-[10px] text-red-500 mt-1">{errors.code.message}</p>}
                                </div>
                            </div>
                            <div className="grid grid-cols-4 gap-4 items-start pt-2">
                                <Label htmlFor="description" className="text-right pt-2">Description</Label>
                                <div className="col-span-3">
                                    <Textarea
                                        id="description"
                                        placeholder="Description of the coupon"
                                        rows={2}
                                        {...register("description")}
                                        className={cn(errors.description && "border-red-500")}
                                    />
                                    {errors.description && <p className="text-[10px] text-red-500 mt-1">{errors.description.message}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Discount Config */}
                        <div className="space-y-4 pt-2">
                            <h3 className="text-sm font-medium border-b pb-1 text-primary">Discount</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="discountType">Type</Label>
                                    <Controller
                                        name="discountType"
                                        control={control}
                                        render={({ field }) => (
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <SelectTrigger id="discountType">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="percentage">Percentage (%)</SelectItem>
                                                    <SelectItem value="flat">Flat Amount (₹)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="discountValue">Value</Label>
                                    <Input
                                        id="discountValue"
                                        type="number"
                                        {...register("discountValue")}
                                        className={cn(errors.discountValue && "border-red-500")}
                                    />
                                    {errors.discountValue && <p className="text-[10px] text-red-500 mt-1">{errors.discountValue.message}</p>}
                                </div>
                            </div>
                            {discountType === "percentage" && (
                                <div className="space-y-2">
                                    <Label htmlFor="maxDiscount">Max Discount Amount (₹)</Label>
                                    <Input
                                        id="maxDiscount"
                                        type="number"
                                        placeholder="Optional cap"
                                        {...register("maximumDiscountAmount")}
                                    />
                                </div>
                            )}
                        </div>

                        {/* Applicability */}
                        <div className="space-y-4 pt-2">
                            <h3 className="text-sm font-medium border-b pb-1 text-primary">Applicability</h3>
                            <div className="space-y-2">
                                <Label htmlFor="applicationType">Application Type</Label>
                                <Controller
                                    name="applicationType"
                                    control={control}
                                    render={({ field }) => (
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <SelectTrigger id="applicationType">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All Products</SelectItem>
                                                <SelectItem value="category">Categories</SelectItem>
                                                <SelectItem value="product">Products</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                            </div>

                            {applicationType === "category" && metadata && (
                                <div className="grid grid-cols-2 gap-2 mt-2">
                                    {metadata.categories.map((category) => (
                                        <div
                                            key={category}
                                            className={cn(
                                                "flex items-center space-x-2 rounded-md border p-2 cursor-pointer transition-colors text-xs",
                                                selectedCategories.includes(category)
                                                    ? "border-primary bg-primary/5"
                                                    : "hover:bg-accent"
                                            )}
                                            onClick={() => toggleCategory(category)}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={selectedCategories.includes(category)}
                                                onChange={() => { }}
                                                className="h-3 w-3"
                                            />
                                            <span className="truncate">{category}</span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {applicationType === "product" && products?.page && (
                                <div className="max-h-40 overflow-y-auto border rounded-md p-1 space-y-1 mt-2">
                                    {products.page.map((product) => (
                                        <div
                                            key={product.id}
                                            className={cn(
                                                "flex items-center space-x-2 rounded-md p-2 cursor-pointer transition-colors text-xs",
                                                selectedProducts.includes(product.id)
                                                    ? "bg-primary/5"
                                                    : "hover:bg-accent"
                                            )}
                                            onClick={() => toggleProduct(product.id)}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={selectedProducts.includes(product.id)}
                                                onChange={() => { }}
                                                className="h-3 w-3"
                                            />
                                            <span className="flex-1 truncate">{product.name}</span>
                                            <span className="text-[10px] text-muted-foreground">₹{product.price}</span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="minPurchase">Min Purchase Amount (₹)</Label>
                                <Input
                                    id="minPurchase"
                                    type="number"
                                    placeholder="No minimum"
                                    {...register("minimumPurchaseAmount")}
                                />
                            </div>
                        </div>

                        {/* Limits & Validity */}
                        <div className="space-y-4 pt-2">
                            <h3 className="text-sm font-medium border-b pb-1 text-primary">Limits & Validity</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="maxUsageCount">Total Limit</Label>
                                    <Input
                                        id="maxUsageCount"
                                        type="number"
                                        placeholder="Unlimited"
                                        {...register("maxUsageCount")}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="maxUsagePerUser">Per User Limit</Label>
                                    <Input
                                        id="maxUsagePerUser"
                                        type="number"
                                        placeholder="Unlimited"
                                        {...register("maxUsagePerUser")}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Start Date</Label>
                                    <Controller
                                        control={control}
                                        name="startDate"
                                        render={({ field }) => (
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        className={cn(
                                                            "w-full justify-start text-left font-normal text-xs px-2 h-9",
                                                            !field.value && "text-muted-foreground"
                                                        )}
                                                    >
                                                        <CalendarIcon className="mr-1 h-3 w-3" />
                                                        {field.value ? format(field.value, "MMM d, yyyy") : "Pick start"}
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0" align="start">
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
                                    <Label>Expiry Date</Label>
                                    <Controller
                                        control={control}
                                        name="expiryDate"
                                        render={({ field }) => (
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        className={cn(
                                                            "w-full justify-start text-left font-normal text-xs px-2 h-9",
                                                            errors.expiryDate ? "border-red-500" : ""
                                                        )}
                                                    >
                                                        <CalendarIcon className="mr-1 h-3 w-3" />
                                                        {field.value ? format(field.value, "MMM d, yyyy") : "Pick expiry"}
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0" align="start">
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
                                    {errors.expiryDate && <p className="text-[10px] text-red-500 mt-1">{errors.expiryDate.message}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Status */}
                        <div className="pt-2">
                            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border">
                                <div className="space-y-0.5">
                                    <Label className="text-sm">Active Status</Label>
                                    <p className="text-[10px] text-muted-foreground">Make this coupon available</p>
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
                        </div>
                    </div>

                    <div className="border-t border-gray-200 p-6">
                        <Button type="submit" disabled={isSubmitting} className="w-full">
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Saving...
                                </>
                            ) : "Save changes"}
                        </Button>
                    </div>
                </form>
            </SheetContent>
        </Sheet>
    );
}
