"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/context/CartContext";
import { Loader2, Tag, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface CouponInputProps {
    className?: string;
}

export function CouponInput({ className }: CouponInputProps) {
    const {
        applyCoupon,
        removeCoupon,
        isCouponApplied,
        couponCode,
        discountAmount
    } = useCart();

    const [inputCode, setInputCode] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleApply = async () => {
        if (!inputCode.trim()) return;

        setIsLoading(true);
        setError(null);

        try {
            const result = await applyCoupon(inputCode.trim());
            if (result.success) {
                toast.success(result.message);
                setInputCode("");
            } else {
                setError(result.message);
                toast.error(result.message);
            }
        } catch (err) {
            setError("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    const handleRemove = () => {
        removeCoupon();
        toast.info("Coupon removed");
    };

    if (isCouponApplied) {
        return (
            <div className={cn("rounded-lg border border-dashed border-green-500 bg-green-50 p-3", className)}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Tag className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium text-green-700">
                            Code: <span className="font-bold">{couponCode}</span> applied
                        </span>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleRemove}
                        className="h-6 w-6 p-0 text-green-700 hover:text-green-800 hover:bg-green-100"
                    >
                        <X className="h-4 w-4" />
                        <span className="sr-only">Remove coupon</span>
                    </Button>
                </div>
                <div className="mt-1 text-xs text-green-600 pl-6">
                    You saved ₹{discountAmount.toFixed(2)}
                </div>
            </div>
        );
    }

    return (
        <div className={cn("space-y-2", className)}>
            <div className="flex w-full items-center space-x-2">
                <Input
                    type="text"
                    placeholder="Coupon code"
                    value={inputCode}
                    onChange={(e) => {
                        setInputCode(e.target.value.toUpperCase());
                        if (error) setError(null);
                    }}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") handleApply();
                    }}
                    disabled={isLoading}
                    className={cn(error && "border-red-500 focus-visible:ring-red-500")}
                />
                <Button
                    type="button"
                    onClick={handleApply}
                    disabled={!inputCode || isLoading}
                >
                    {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        "Apply"
                    )}
                </Button>
            </div>
            {error && (
                <p className="text-xs text-red-500 font-medium ml-1">{error}</p>
            )}
        </div>
    );
}
