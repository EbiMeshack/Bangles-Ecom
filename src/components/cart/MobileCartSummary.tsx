"use client";

import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { formatCurrency } from "@/lib/utils";

export function MobileCartSummary() {
    const { totalPrice } = useCart();

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-gray-50 border-t border-gray-200 p-4 shadow-lg lg:hidden">
            <div className="max-w-7xl mx-auto space-y-4">
                <dl className="space-y-4">
                    <div className="flex items-center justify-between">
                        <dt className="text-sm text-gray-600">Subtotal</dt>
                        <dd className="text-sm font-medium text-gray-900">{formatCurrency(totalPrice)}</dd>
                    </div>
                    <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                        <dt className="flex items-center text-sm text-gray-600">
                            <span>Shipping estimate</span>
                        </dt>
                        <dd className="text-sm font-medium text-gray-900">Calculated at checkout</dd>
                    </div>
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
