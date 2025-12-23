"use client";

import { CartHeader } from "@/components/cart/CartHeader";
import { CartItemList } from "@/components/cart/CartItemList";
import { CartSkeleton } from "@/components/cart/CartSkeleton";
import { CartSummary } from "@/components/cart/CartSummary";
import { EmptyCart } from "@/components/cart/EmptyCart";
import { MobileCartSummary } from "@/components/cart/MobileCartSummary";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { useCart } from "@/context/CartContext";


export default function CartPage() {
    const { cart, clearCart, isLoaded } = useCart();

    const isLoading = !isLoaded;

    return (
        <div className="flex min-h-screen flex-col font-sans">
            <Header />
            <main className="flex-1 flex flex-col pb-64 lg:pb-0">
                <div className="container mx-auto px-4 py-8 md:py-12 flex-1 max-w-7xl">
                    {isLoading ? (
                        <CartSkeleton onClearCart={clearCart} />
                    ) : cart.length === 0 ? (
                        <EmptyCart />
                    ) : (
                        <>
                            <CartHeader onClearCart={clearCart} />

                            <div className="lg:grid lg:grid-cols-12 lg:gap-12 items-start relative">
                                <CartItemList />
                                <CartSummary />
                            </div>
                            <MobileCartSummary />
                        </>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
}
