"use client";

import { useCart } from "@/context/CartContext";
import { formatCurrency } from "@/lib/utils";
import { Minus, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function CartItemList() {
    const { cart, updateQuantity, removeFromCart } = useCart();

    return (
        <div className="lg:col-span-8">
            <div className="border-t border-gray-200 divide-y divide-gray-200">
                {cart.map((item) => (
                    <div key={item.id} className="flex py-6 sm:py-10">
                        <div className="relative h-24 w-24 sm:h-32 sm:w-32 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                            <Image
                                src={item.image}
                                alt={item.name}
                                fill
                                className="h-full w-full object-cover object-center"
                            />
                        </div>

                        <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
                            <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                                <div>
                                    <div className="flex justify-between">
                                        <h3 className="text-sm">
                                            <Link
                                                href={`/product/${item.id}`}
                                                className="font-medium text-gray-700 hover:text-gray-800"
                                            >
                                                {item.name}
                                            </Link>
                                        </h3>
                                    </div>
                                    <p className="mt-1 text-sm text-gray-500 capitalize">{item.category}</p>
                                    <p className="mt-1 text-sm font-medium text-gray-900">
                                        {formatCurrency(item.price)}
                                    </p>
                                </div>

                                <div className="mt-4 sm:mt-0 sm:pr-9">
                                    <div className="absolute right-0 top-0">
                                        <label htmlFor={`quantity-${item.id}`} className="sr-only">
                                            Quantity, {item.name}
                                        </label>
                                        <div className="flex items-center bg-background border border-gray-300 rounded-md w-max">
                                            <button
                                                type="button"
                                                className="p-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                                                onClick={() => {
                                                    if (item.quantity === 1) {
                                                        removeFromCart(item.id);
                                                    } else {
                                                        updateQuantity(item.id, item.quantity - 1);
                                                    }
                                                }}
                                            >
                                                {item.quantity === 1 ? (
                                                    <Trash2 className="h-4 w-4 text-red-500" />
                                                ) : (
                                                    <Minus className="h-4 w-4" />
                                                )}
                                            </button>
                                            <span className="px-4 text-gray-900 font-medium">{item.quantity}</span>
                                            <button
                                                type="button"
                                                className="p-2 text-gray-600 hover:bg-gray-100"
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                            >
                                                <Plus className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
