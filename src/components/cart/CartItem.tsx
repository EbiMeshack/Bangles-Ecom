"use client";

import { Button } from "@/components/ui/button";
import { CartItem as CartItemType, useCart } from "@/context/CartContext";
import { formatCurrency } from "@/lib/utils";
import { Minus, Plus, Trash2 } from "lucide-react";
import Image from "next/image";

interface CartItemProps {
    item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
    const { updateQuantity, removeFromCart } = useCart();

    return (
        <div className="flex gap-4 py-3 p-2 border border-border rounded-lg mb-3">
            <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="h-full w-full object-cover"
                />
            </div>

            <div className="flex flex-1 flex-col justify-between">
                <div>
                    <div className="flex justify-between">
                        <h3 className="text-sm font-medium text-gray-900 line-clamp-1">
                            <a href={`/product/${item.id}`}>{item.name}</a>
                        </h3>
                        <p className="ml-4 text-sm font-medium text-gray-900 px-1 rounded-sm">
                            {formatCurrency(item.price)}
                        </p>
                    </div>
                    <p className="mt-1 text-sm text-gray-500 capitalize">{item.category}</p>
                </div>

                <div className="flex flex-1 items-end justify-between text-sm">
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => updateQuantity(item.id, item.cartQuantity - 1)}
                            disabled={item.cartQuantity <= 1}
                        >
                            <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-4 text-center">{item.cartQuantity}</span>
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => updateQuantity(item.id, item.cartQuantity + 1)}
                        >
                            <Plus className="h-3 w-3" />
                        </Button>
                    </div>

                    <button
                        type="button"
                        onClick={() => removeFromCart(item.id)}
                        className="font-medium text-red-600 hover:text-red-500 flex items-center gap-1"
                    >
                        <Trash2 className="h-3 w-3" />
                        <span className="text-xs">Remove</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
