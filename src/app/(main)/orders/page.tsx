"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { OrderList } from "@/components/orders/OrderList";
import { EmptyOrders } from "@/components/orders/EmptyOrders";
import { OrdersSkeleton } from "@/components/orders/OrdersSkeleton";
import { authClient } from "@/lib/auth-client";
import { useQuery, useConvexAuth } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function OrdersPage() {
    const router = useRouter();
    // We can use session to get userId
    const { data: session, isPending: isSessionLoading } = authClient.useSession();
    const { isAuthenticated, isLoading: isAuthLoading } = useConvexAuth();

    const userId = session?.user?.id;

    // Fetch orders only if we have a userId
    const orders = useQuery(api.orders.getUserOrders, userId ? { userId } : "skip");

    const isLoading = isSessionLoading || isAuthLoading || (isAuthenticated && orders === undefined);

    useEffect(() => {
        if (!isSessionLoading && !isAuthLoading && !session) {
            router.push("/login"); // Or standard auth redirect logic
        }
    }, [session, isSessionLoading, isAuthLoading, router]);

    if (!session && !isSessionLoading) {
        return null; // Redirecting...
    }

    return (
        <div className="flex min-h-screen flex-col font-sans">
            <Header />
            <main className="flex-1 flex flex-col">
                <div className="container mx-auto px-4 py-8 md:py-12 flex-1 max-w-5xl">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900">My Orders</h1>
                        <p className="text-muted-foreground mt-2">
                            View and track your past orders.
                        </p>
                    </div>

                    {isLoading ? (
                        <OrdersSkeleton />
                    ) : !orders || orders.length === 0 ? (
                        <EmptyOrders />
                    ) : (
                        <OrderList orders={orders} />
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
}
