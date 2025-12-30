"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { Product } from "@/types/product";
import { useConvex } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

export interface CartItem extends Product {
    cartQuantity: number; // Number of items in cart
}

interface CartContextType {
    cart: CartItem[];
    addToCart: (product: Product) => void;
    removeFromCart: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;
    totalItems: number;
    subtotal: number;
    totalPrice: number;
    isCartOpen: boolean;
    toggleCart: () => void;
    isLoaded: boolean;

    // Coupon related
    couponCode: string | null;
    discountAmount: number;
    isCouponApplied: boolean;
    applyCoupon: (code: string) => Promise<{ success: boolean; message: string }>;
    removeCoupon: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const convex = useConvex();
    const [cart, setCart] = useState<CartItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    // Coupon state
    const [couponCode, setCouponCode] = useState<string | null>(null);
    const [couponId, setCouponId] = useState<Id<"coupons"> | null>(null);
    const [discountAmount, setDiscountAmount] = useState(0);

    useEffect(() => {
        setIsMounted(true);
        const savedCart = localStorage.getItem("cart");
        if (savedCart) {
            try {
                const parsedCart = JSON.parse(savedCart);
                const migratedCart = parsedCart.map((item: any) => {
                    if (item.quantity !== undefined && item.stockQuantity === undefined) {
                        const { quantity, ...rest } = item;
                        return { ...rest, stockQuantity: quantity };
                    }
                    return {
                        ...item,
                        cartQuantity: typeof item.cartQuantity === 'number' ? item.cartQuantity : 1,
                        stockQuantity: typeof item.stockQuantity === 'number' ? item.stockQuantity : 10
                    };
                });
                setCart(migratedCart);
            } catch (error) {
                console.error("Failed to parse cart from local storage:", error);
            }
        }

        // Load saved coupon state if any (optional, but good for persistence)
        const savedCoupon = localStorage.getItem("coupon");
        if (savedCoupon) {
            try {
                const { code, id, discount } = JSON.parse(savedCoupon);
                setCouponCode(code);
                setCouponId(id);
                setDiscountAmount(discount);
            } catch (e) {
                console.error("Failed to parse coupon from local storage", e);
            }
        }

        setIsLoaded(true);
    }, []);

    useEffect(() => {
        if (isMounted) {
            localStorage.setItem("cart", JSON.stringify(cart));

            // Re-validate coupon when cart changes if a coupon is applied
            if (couponCode && cart.length > 0) {
                revalidateCoupon();
            } else if (cart.length === 0 && couponCode) {
                // Remove coupon if cart becomes empty
                removeCoupon();
            }
        }
    }, [cart, isMounted]);

    // Construct the payload for validation
    const getValidationPayload = () => {
        return {
            code: couponCode!,
            cartItems: cart.map(item => ({
                productId: item.id as Id<"products">,
                quantity: item.cartQuantity,
                price: item.price,
                category: item.category
            }))
        };
    };

    const revalidateCoupon = async () => {
        if (!couponCode) return;
        try {
            const result = await convex.query(api.coupons.validateCoupon, {
                code: couponCode,
                userId: "guest", // Placeholder
                cartItems: cart.map(item => ({
                    productId: item.id as Id<"products">,
                    quantity: item.cartQuantity,
                    price: item.price,
                    category: item.category
                }))
            });

            if (result.valid) {
                setDiscountAmount(result.discount || 0);
                updateLocalStorageCoupon(couponCode, result.couponId!, result.discount || 0);
            } else {
                removeCoupon();
            }
        } catch (e) {
            console.error("Failed to revalidate coupon", e);
        }
    };

    const updateLocalStorageCoupon = (code: string, id: string, discount: number) => {
        localStorage.setItem("coupon", JSON.stringify({ code, id, discount }));
    }

    const applyCoupon = async (code: string): Promise<{ success: boolean; message: string }> => {
        try {
            const result = await convex.query(api.coupons.validateCoupon, {
                code,
                userId: "guest", // Placeholder until we integrate AuthContext
                cartItems: cart.map(item => ({
                    productId: item.id as Id<"products">,
                    quantity: item.cartQuantity,
                    price: item.price,
                    category: item.category
                }))
            });

            if (result.valid) {
                setCouponCode(code);
                setCouponId(result.couponId!);
                setDiscountAmount(result.discount || 0);
                updateLocalStorageCoupon(code, result.couponId!, result.discount || 0);
                return { success: true, message: `Coupon applied: ${result.description}` };
            } else {
                return { success: false, message: result.error || "Invalid coupon" };
            }
        } catch (error) {
            console.error("Error applying coupon:", error);
            return { success: false, message: "Failed to apply coupon. Please try again." };
        }
    };

    const removeCoupon = () => {
        setCouponCode(null);
        setCouponId(null);
        setDiscountAmount(0);
        localStorage.removeItem("coupon");
    };

    const addToCart = (product: Product) => {
        setCart((prev) => {
            const existing = prev.find((item) => item.id === product.id);
            const currentCartQty = existing?.cartQuantity || 0;

            if (currentCartQty >= product.stockQuantity) {
                return prev;
            }

            if (existing) {
                return prev.map((item) =>
                    item.id === product.id
                        ? { ...item, cartQuantity: Math.min(item.cartQuantity + 1, product.stockQuantity) }
                        : item
                );
            }
            return [...prev, { ...product, cartQuantity: 1 }];
        });
        setIsCartOpen(true);
    };

    const removeFromCart = (productId: string) => {
        setCart((prev) => prev.filter((item) => item.id !== productId));
    };

    const updateQuantity = (productId: string, newCartQuantity: number) => {
        setCart((prev) =>
            prev.map((item) => {
                if (item.id === productId) {
                    const validatedQty = Math.min(Math.max(0, newCartQuantity), item.stockQuantity);
                    return { ...item, cartQuantity: validatedQty };
                }
                return item;
            }).filter(item => item.cartQuantity > 0)
        );
    };

    const clearCart = () => {
        setCart([]);
        removeCoupon();
    };

    const toggleCart = () => {
        setIsCartOpen((prev) => !prev);
    }

    const totalItems = cart.reduce((acc, item) => acc + item.cartQuantity, 0);
    const subtotal = cart.reduce((acc, item) => acc + item.price * item.cartQuantity, 0);
    const totalPrice = Math.max(0, subtotal - discountAmount);

    return (
        <CartContext.Provider
            value={{
                cart,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                totalItems,
                subtotal,
                totalPrice,
                isCartOpen,
                toggleCart,
                isLoaded,

                couponCode,
                discountAmount,
                isCouponApplied: !!couponCode,
                applyCoupon,
                removeCoupon
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
}
