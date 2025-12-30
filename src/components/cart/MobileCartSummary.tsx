"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { formatCurrency } from "@/lib/utils";
import { CouponInput } from "./CouponInput";

export function MobileCartSummary() {
    const { subtotal, discountAmount, totalPrice, isCouponApplied } = useCart();
    const [showCouponInput, setShowCouponInput] = useState(false);

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-gray-50 border-t border-gray-200 p-4 shadow-lg lg:hidden">
            <div className="max-w-7xl mx-auto space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-medium text-gray-900">Summary</h2>
                    {!isCouponApplied && !showCouponInput && (
                        <button
                            onClick={() => setShowCouponInput(true)}
                            className="text-sm text-primary hover:underline hover:text-primary/80 font-medium"
                        >
                            Add coupon
                        </button>
                    )}
                </div>

                {(showCouponInput || isCouponApplied) && (
                    <div className="pb-2">
                        <CouponInput />
                    </div>
                )}

                <dl className="space-y-4">
                    <div className="flex items-center justify-between">
                        <dt className="text-sm text-gray-600">Subtotal</dt>
                        <dd className="text-sm font-medium text-gray-900">{formatCurrency(subtotal)}</dd>
                    </div>

                    {discountAmount > 0 && (
                        <div className="flex items-center justify-between pt-2">
                            <dt className="text-sm text-green-600">Discount</dt>
                            <dd className="text-sm font-medium text-green-600">-{formatCurrency(discountAmount)}</dd>
                        </div>
                    )}

                    <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                        <dt className="text-base font-medium text-gray-900">Order total</dt>
                        <dd className="text-base font-medium text-gray-900">{formatCurrency(totalPrice)}</dd>
                    </div>
                </dl>

                <div className="mt-6">
                    <Button className="w-full text-base py-6">Checkout</Button>
                </div>
            </div>
        </div>
    );
}
