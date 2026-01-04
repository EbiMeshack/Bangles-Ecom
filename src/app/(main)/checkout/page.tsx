"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { CheckoutForm, CheckoutFormData } from "@/components/checkout/CheckoutForm";
import { formatCurrency } from "@/lib/utils";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { useMutation, useAction, useConvexAuth } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRazorpay } from "react-razorpay";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

export default function CheckoutPage() {
    const router = useRouter();
    const { cart, totalPrice, subtotal, discountAmount, clearCart } = useCart();
    const [isProcessing, setIsProcessing] = useState(false);
    const { isAuthenticated } = useConvexAuth();
    const { data: session } = authClient.useSession();

    // Mutations and Actions
    const createOrder = useMutation(api.orders.create);
    const createRazorpayOrder = useAction(api.razorpay.createOrder);
    const markAsPaid = useMutation(api.orders.markAsPaid);

    const { Razorpay } = useRazorpay();

    useEffect(() => {
        if (cart.length === 0) {
            router.push("/");
        }
    }, [cart, router]);

    const handleCheckout = async (formData: CheckoutFormData) => {
        setIsProcessing(true);

        if (!isAuthenticated) {
            toast.error("Please login to proceed with checkout");
            router.push("/login");
            setIsProcessing(false);
            return;
        }

        const userId = session?.user?.id;
        if (!userId) {
            toast.error("Something went wrong. Please try again.");
            setIsProcessing(false);
            return;
        }

        try {
            // 1. Create Pending Order in Convex
            const { orderId, orderNumber } = await createOrder({
                userId, // Use authenticated user ID
                items: cart.map(item => ({
                    productId: item.id as any,
                    quantity: item.cartQuantity,
                    price: item.price,
                    name: item.name,
                    image: item.image,
                })),
                shippingAddress: {
                    street: formData.street,
                    city: formData.city,
                    state: formData.state,
                    zip: formData.zip,
                    country: formData.country,
                },
                amount: totalPrice,
            });

            // 2. Create Razorpay Order
            const razorpayOrder = await createRazorpayOrder({
                amount: totalPrice * 100, // Amount in paisa
                receipt: orderNumber,
                currency: "INR",
            });

            // 3. Initialize Razorpay Payment
            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
                amount: Number(razorpayOrder.amount),
                currency: razorpayOrder.currency as any,
                name: "Bangle Co.",
                description: `Order #${orderNumber}`,
                order_id: razorpayOrder.id,
                handler: async (response: any) => {
                    try {
                        // 4. Mark Order as Paid on Success
                        await markAsPaid({
                            orderId,
                            paymentId: response.razorpay_payment_id,
                            signature: response.razorpay_signature,
                            razorpayOrderId: response.razorpay_order_id,
                        });

                        clearCart();
                        toast.success("Payment Successful! Order placed.");
                        router.push("/");
                    } catch (err) {
                        console.error("Payment verification failed", err);
                        toast.error("Payment verification failed. Please contact support.");
                    }
                },
                prefill: {
                    email: formData.email,
                    contact: formData.phone,
                },
                theme: {
                    color: "#cc8a33ff",
                },
            };

            const rzp1 = new Razorpay(options);
            rzp1.on("payment.failed", function (response: any) {
                toast.error(response.error.description || "Payment failed");
            });
            rzp1.open();

        } catch (error) {
            console.error("Checkout error:", error);
            toast.error("Checkout failed. Please try again.");
        } finally {
            setIsProcessing(false);
        }
    };

    if (cart.length === 0) {
        return null;
    }

    return (
        <div className="flex min-h-screen flex-col font-sans bg-white">
            <main className="flex-1">
                <div className="grid grid-cols-1 md:grid-cols-2 min-h-screen">
                    {/* Back Button Section */}
                    <div className="md:col-start-1 md:row-start-1 flex flex-col px-4 pt-8 md:px-12 md:pt-16 bg-muted/30 md:bg-transparent">
                        <div className="max-w-lg mx-auto w-full">
                            <button
                                onClick={() => router.push("/cart")}
                                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-0"
                            >
                                <ArrowLeft className="size-4" />
                                Back to Cart
                            </button>
                        </div>
                    </div>

                    {/* Order Summary Section */}
                    <div className="md:col-start-2 md:row-start-1 md:row-span-2 px-4 py-8 md:px-12 md:py-16 xl:px-24 xl:py-20 bg-muted/30">
                        <div className="max-w-lg mx-auto lg:mx-0 lg:max-w-xl w-full sticky top-24">
                            <h2 className="text-xl font-semibold mb-6">Order Summary</h2>

                            <div className="space-y-6 mb-8">
                                {cart.map((item) => (
                                    <div key={item.id} className="flex gap-4 items-start">
                                        <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border bg-white">
                                            {item.image && (
                                                <Image
                                                    src={item.image}
                                                    alt={item.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            )}

                                        </div>
                                        <div className="flex flex-1 items-start justify-between">
                                            <div className="space-y-1">
                                                <h3 className="font-medium text-base">{item.name}</h3>
                                                <p className="text-muted-foreground text-sm">{formatCurrency(item.price)} each</p>
                                            </div>
                                            <span className="font-medium">{formatCurrency(item.price * item.cartQuantity)}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-4 pt-6 border-t border-border/50">
                                <div className="flex justify-between text-muted-foreground">
                                    <span>Subtotal</span>
                                    <span>{formatCurrency(subtotal)}</span>
                                </div>
                                <div className="flex justify-between text-muted-foreground">
                                    <span>Shipping</span>
                                    <span className="text-foreground font-medium">Free</span>
                                </div>
                                {discountAmount > 0 && (
                                    <div className="flex justify-between text-green-600 font-medium">
                                        <span>Discount</span>
                                        <span>-{formatCurrency(discountAmount)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-2xl font-bold pt-4 border-t border-border/50">
                                    <span>Total</span>
                                    <span className="text-primary">{formatCurrency(totalPrice)}</span>
                                </div>
                            </div>

                            <div className="mt-8 flex items-center gap-2 text-sm text-muted-foreground bg-white/50 p-4 rounded-lg border border-border/50">
                                <ShieldCheck className="size-5 text-green-600" />
                                <span>Secure SSL Encryption & Guaranteed Safe Checkout</span>
                            </div>
                        </div>
                    </div>

                    {/* Checkout Form Section */}
                    <div className="md:col-start-1 md:row-start-2 flex flex-col px-4 pt-10 pb-8 md:px-12 md:pb-16 md:pt-0">
                        <div className="max-w-lg mx-auto w-full">
                            <CheckoutForm onSubmit={handleCheckout} isProcessing={isProcessing} />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
