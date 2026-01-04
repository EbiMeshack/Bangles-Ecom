"use client";

import { useState, useEffect } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Doc } from "@/convex/_generated/dataModel";

interface EditOrderSheetProps {
    order: Doc<"orders"> | null;
    isOpen: boolean;
    onClose: () => void;
}

type OrderStatus = "pending" | "completed" | "cancelled" | "refunded";

export function EditOrderSheet({ order, isOpen, onClose }: EditOrderSheetProps) {
    const updateStatus = useMutation(api.orders.updateOrderStatus);
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState<OrderStatus>("pending");

    useEffect(() => {
        if (order) {
            // Ensure the status from DB matches our local type, fallback to pending if invalid/mismatched
            const currentStatus = order.status as OrderStatus;
            setStatus(currentStatus ?? "pending");
        }
    }, [order]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!order) return;

        setIsLoading(true);
        try {
            await updateStatus({
                orderId: order._id,
                status,
            });
            toast.success("Order updated successfully");
            onClose();
        } catch (error) {
            console.error(error);
            toast.error("Failed to update order");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent className="flex flex-col h-full">
                <SheetHeader className="px-1">
                    <SheetTitle>Edit Order Status</SheetTitle>
                    <SheetDescription>
                        Update the status of the order.
                    </SheetDescription>
                </SheetHeader>
                <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0 pt-6">
                    <div className="flex-1 overflow-y-auto space-y-4 px-1">
                        <div className="space-y-2">
                            <Label htmlFor="orderNumber">Order Number</Label>
                            <div className="p-2 border rounded-md bg-muted text-sm text-muted-foreground">
                                {order?.orderNumber}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="status">Status</Label>
                            <Select value={status} onValueChange={(value: OrderStatus) => setStatus(value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="completed">Completed</SelectItem>
                                    <SelectItem value="cancelled">Cancelled</SelectItem>
                                    <SelectItem value="refunded">Refunded</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <SheetFooter className="mt-auto px-1 pt-6 pb-2">
                        <Button type="submit" disabled={isLoading} className="w-full">
                            {isLoading ? "Saving..." : "Save changes"}
                        </Button>
                    </SheetFooter>
                </form>
            </SheetContent>
        </Sheet>
    );
}
