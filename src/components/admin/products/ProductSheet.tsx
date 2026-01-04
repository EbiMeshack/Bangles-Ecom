"use client";

import { useState, useEffect } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Doc, Id } from "@/convex/_generated/dataModel";

interface ProductSheetProps {
    product: Doc<"products"> | null;
    isOpen: boolean;
    onClose: () => void;
}

export function ProductSheet({ product, isOpen, onClose }: ProductSheetProps) {
    const createProduct = useMutation(api.products.createProduct);
    const updateProduct = useMutation(api.products.updateProduct);
    const [isLoading, setIsLoading] = useState(false);

    // Form state
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [category, setCategory] = useState("");
    const [image, setImage] = useState("");
    const [quantity, setQuantity] = useState("");

    useEffect(() => {
        if (product) {
            setName(product.name);
            setPrice(product.price.toString());
            setCategory(product.category);
            setImage(product.image);
            setQuantity(product.quantity.toString());
        } else {
            // Reset form for create mode
            setName("");
            setPrice("");
            setCategory("");
            setImage("");
            setQuantity("");
        }
    }, [product, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const priceNum = parseFloat(price);
            const quantityNum = parseInt(quantity);

            if (isNaN(priceNum) || isNaN(quantityNum)) {
                toast.error("Price and Quantity must be valid numbers");
                return;
            }

            if (product) {
                await updateProduct({
                    id: product._id,
                    name,
                    price: priceNum,
                    category,
                    image,
                    quantity: quantityNum,
                });
                toast.success("Product updated successfully");
            } else {
                await createProduct({
                    name,
                    price: priceNum,
                    category,
                    image,
                    quantity: quantityNum,
                });
                toast.success("Product created successfully");
            }
            onClose();
        } catch (error) {
            console.error(error);
            toast.error(product ? "Failed to update product" : "Failed to create product");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent className="flex flex-col h-full">
                <SheetHeader className="px-1">
                    <SheetTitle>{product ? "Edit Product" : "Add Product"}</SheetTitle>
                    <SheetDescription>
                        {product ? "Make changes to the product here." : "Add a new product to your inventory."}
                    </SheetDescription>
                </SheetHeader>
                <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0 pt-6">
                    <div className="flex-1 overflow-y-auto px-1 space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                placeholder="Product Name"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="price">Price</Label>
                            <Input
                                id="price"
                                type="number"
                                step="0.01"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                required
                                placeholder="0.00"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="category">Category</Label>
                            <Input
                                id="category"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                required
                                placeholder="Category (e.g., Electronics)"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="image">Image URL</Label>
                            <Input
                                id="image"
                                value={image}
                                onChange={(e) => setImage(e.target.value)}
                                required
                                placeholder="https://example.com/image.jpg"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="quantity">Stock Quantity</Label>
                            <Input
                                id="quantity"
                                type="number"
                                value={quantity}
                                onChange={(e) => setQuantity(e.target.value)}
                                required
                                placeholder="0"
                            />
                        </div>
                    </div>
                    <SheetFooter className="mt-auto px-1 pt-6 pb-2">
                        <Button type="submit" disabled={isLoading} className="w-full">
                            {isLoading ? "Saving..." : (product ? "Save Changes" : "Create Product")}
                        </Button>
                    </SheetFooter>
                </form>
            </SheetContent>
        </Sheet>
    );
}
