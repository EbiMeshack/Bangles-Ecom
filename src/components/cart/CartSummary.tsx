"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { formatCurrency } from "@/lib/utils";

export function CartSummary() {
    const { totalPrice } = useCart();

    return (
        <section
            aria-labelledby="summary-heading"
            className="mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-4 lg:mt-0 lg:p-8 sticky top-24 h-fit shadow-sm hidden lg:block"
        >
            <h2 id="summary-heading" className="text-lg font-medium text-gray-900">
                Order summary
            </h2>

            <dl className="mt-6 space-y-4">
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

            <div className="mt-6 text-center text-sm text-gray-500">
                <p>
                    or{" "}
                    <Link href="/collections" className="font-medium text-primary hover:text-primary/80">
                        Continue Shopping
                        <span aria-hidden="true"> &rarr;</span>
                    </Link>
                </p>
            </div>
        </section>
    );
}
