"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import { ArrowLeft, Package, IndianRupee, Image as ImageIcon, Layers } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { useForm, Controller, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productSchema, ProductFormValues } from "@/schemas/product.schema";
import { toast } from "sonner";

export default function NewProductPage() {
    const router = useRouter();
    const createProduct = useMutation(api.products.createProduct);
    const metadata = useQuery(api.products.getCollectionMetadata);

    const {
        register,
        handleSubmit,
        control,
        formState: { errors, isSubmitting },
    } = useForm<ProductFormValues>({
        resolver: zodResolver(productSchema) as Resolver<ProductFormValues>,
        defaultValues: {
            name: "",
            price: 0,
            category: "",
            image: "",
            quantity: 0,
        },
    });

    const onSubmit = async (data: ProductFormValues) => {
        try {
            await createProduct({
                name: data.name,
                price: data.price,
                category: data.category,
                image: data.image,
                quantity: data.quantity,
            });

            toast.success("Product created successfully");
            router.push("/admin/products");
        } catch (error: any) {
            console.error("Failed to create product:", error);
            toast.error(error.message || "Failed to create product");
        }
    };

    return (
        <div className="space-y-6">
            <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 -mx-4 -mt-4 mb-4">
                <SidebarTrigger className="-ml-1" />
                <span className="font-medium">Create Product</span>
            </header>
            <div className="flex items-center gap-2">
                <Link href="/admin/products">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-xl font-semibold tracking-tight">Back to Products</h1>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Basic Information */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Package className="h-4 w-4 text-primary" />
                            <CardTitle className="text-base">Basic Information</CardTitle>
                        </div>
                        <CardDescription>
                            Essential product details
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Product Name *</Label>
                            <Input
                                id="name"
                                placeholder="e.g., Silk Bangle Set"
                                {...register("name")}
                            />
                            {errors.name && (
                                <p className="text-red-500 text-sm">{errors.name.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="category">Category *</Label>
                            <Controller
                                name="category"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <SelectTrigger id="category">
                                            <SelectValue placeholder="Select category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {metadata?.categories.map((cat) => (
                                                <SelectItem key={cat} value={cat}>
                                                    {cat}
                                                </SelectItem>
                                            ))}

                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.category && (
                                <p className="text-red-500 text-sm">{errors.category.message}</p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Media */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <ImageIcon className="h-4 w-4 text-primary" />
                            <CardTitle className="text-base">Product Image</CardTitle>
                        </div>
                        <CardDescription>
                            Visual representation of the product
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="image">Image URL *</Label>
                            <Input
                                id="image"
                                placeholder="https://example.com/image.jpg"
                                {...register("image")}
                            />
                            {errors.image && (
                                <p className="text-red-500 text-sm">{errors.image.message}</p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Pricing and Inventory */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <IndianRupee className="h-4 w-4 text-primary" />
                            <CardTitle className="text-base">Pricing & Inventory</CardTitle>
                        </div>
                        <CardDescription>
                            Manage price and stock levels
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="price">Price (₹) *</Label>
                                <Input
                                    id="price"
                                    type="number"
                                    step="0.01"
                                    placeholder="0.00"
                                    {...register("price")}
                                />
                                {errors.price && (
                                    <p className="text-red-500 text-sm">{errors.price.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="quantity">Stock Quantity *</Label>
                                <Input
                                    id="quantity"
                                    type="number"
                                    placeholder="0"
                                    {...register("quantity")}
                                />
                                {errors.quantity && (
                                    <p className="text-red-500 text-sm">{errors.quantity.message}</p>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Actions */}
                <div className="flex justify-end gap-4">
                    <Link href="/admin/products">
                        <Button type="button" variant="outline">
                            Cancel
                        </Button>
                    </Link>
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Creating..." : "Create Product"}
                    </Button>
                </div>
            </form>
        </div>
    );
}
