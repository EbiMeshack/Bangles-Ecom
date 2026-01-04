"use client";

import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetHeader,
    SheetTitle
} from "@/components/ui/sheet";
import { useCart } from "@/context/CartContext";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { CartItem } from "./CartItem";
import { formatCurrency } from "@/lib/utils";

export function CartSheet() {
    const { cart, totalItems, totalPrice, isCartOpen, toggleCart } = useCart();

    return (
        <Sheet open={isCartOpen} onOpenChange={toggleCart}>
            <SheetContent className="flex w-full flex-col sm:max-w-lg">
                <SheetHeader>
                    <SheetTitle>Shopping Cart ({totalItems})</SheetTitle>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto px-6 py-6">
                    {cart.length === 0 ? (
                        <div className="flex h-full flex-col items-center justify-center space-y-2">
                            <ShoppingCart className="h-12 w-12 text-gray-400" />
                            <p className="text-lg font-medium text-gray-900">Your cart is empty</p>
                            <p className="text-sm text-gray-500">
                                Add items to your cart to checkout.
                            </p>
                            <SheetClose asChild>
                                <Button variant="link" className="text-sm underline">
                                    Continue Shopping
                                </Button>
                            </SheetClose>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {cart.map((item) => (
                                <CartItem key={item.id} item={item} />
                            ))}
                        </div>
                    )}
                </div>

                {cart.length > 0 && (
                    <div className="border-t border-gray-200 p-6">
                        <div className="flex justify-between text-base font-medium text-gray-900 mb-4">
                            <p>Subtotal</p>
                            <p>{formatCurrency(totalPrice)}</p>
                        </div>
                        <div className="space-y-4">
                            <SheetClose asChild>
                                <Link href="/cart" className="w-full block">
                                    <Button variant="outline" className="w-full h-10 text-base">
                                        View Full Cart
                                    </Button>
                                </Link>
                            </SheetClose>

                            <SheetClose asChild>
                                <Link href="/checkout" className="w-full block">
                                    <Button className="w-full h-10 text-base">Checkout</Button>
                                </Link>
                            </SheetClose>
                        </div>
                        <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                            <p>
                                or{" "}
                                <SheetClose asChild>
                                    <button
                                        type="button"
                                        className="font-medium text-primary hover:text-primary/80"
                                    >
                                        Continue Shopping
                                        <span aria-hidden="true"> &rarr;</span>
                                    </button>
                                </SheetClose>
                            </p>
                        </div>
                    </div>
                )}
            </SheetContent>
        </Sheet>
    );
}
