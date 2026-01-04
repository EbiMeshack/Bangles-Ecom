"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const checkoutFormSchema = z.object({
    street: z.string().min(5, "Street address must be at least 5 characters"),
    city: z.string().min(2, "City must be at least 2 characters"),
    state: z.string().min(2, "State must be at least 2 characters"),
    zip: z.string().regex(/^\d{6}$/, "ZIP code must be 6 digits"),
    country: z.string().min(2, "Country must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number"),
});

export type CheckoutFormData = z.infer<typeof checkoutFormSchema>;

interface CheckoutFormProps {
    onSubmit: (data: CheckoutFormData) => void;
    isProcessing: boolean;
}

export function CheckoutForm({ onSubmit, isProcessing }: CheckoutFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<CheckoutFormData>({
        resolver: zodResolver(checkoutFormSchema),
        defaultValues: {
            country: "India",
        },
    });

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
            <div className="space-y-10">
                <div>
                    <h2 className="text-xl font-semibold mb-6">Contact Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <Label htmlFor="email" className="text-base text-muted-foreground font-normal">Email</Label>
                            <Input id="email" type="email" {...register("email")} placeholder="john@example.com" className="bg-background h-12" />
                            {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
                        </div>
                        <div className="space-y-3">
                            <Label htmlFor="phone" className="text-base text-muted-foreground font-normal">Phone</Label>
                            <Input id="phone" type="tel" {...register("phone")} placeholder="+91 9876543210" className="bg-background h-12" />
                            {errors.phone && <p className="text-sm text-red-500">{errors.phone.message}</p>}
                        </div>
                    </div>
                </div>

                <div>
                    <h2 className="text-xl font-semibold mb-6">Shipping Address</h2>
                    <div className="space-y-6">
                        <div className="space-y-3">
                            <Label htmlFor="street" className="text-base text-muted-foreground font-normal">Street Address</Label>
                            <Input id="street" {...register("street")} placeholder="123 Floor, Apt 4B" className="bg-background h-12" />
                            {errors.street && <p className="text-sm text-red-500">{errors.street.message}</p>}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <Label htmlFor="city" className="text-base text-muted-foreground font-normal">City</Label>
                                <Input id="city" {...register("city")} placeholder="Mumbai" className="bg-background h-12" />
                                {errors.city && <p className="text-sm text-red-500">{errors.city.message}</p>}
                            </div>
                            <div className="space-y-3">
                                <Label htmlFor="state" className="text-base text-muted-foreground font-normal">State</Label>
                                <Input id="state" {...register("state")} placeholder="Maharashtra" className="bg-background h-12" />
                                {errors.state && <p className="text-sm text-red-500">{errors.state.message}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <Label htmlFor="zip" className="text-base text-muted-foreground font-normal">ZIP / Pincode</Label>
                                <Input id="zip" {...register("zip")} placeholder="400001" className="bg-background h-12" />
                                {errors.zip && <p className="text-sm text-red-500">{errors.zip.message}</p>}
                            </div>
                            <div className="space-y-3">
                                <Label htmlFor="country" className="text-base text-muted-foreground font-normal">Country</Label>
                                <Input id="country" {...register("country")} disabled className="bg-muted h-12" />
                                {errors.country && <p className="text-sm text-red-500">{errors.country.message}</p>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Button type="submit" className="w-full text-lg h-14 mt-4" size="lg" disabled={isProcessing}>
                {isProcessing ? "Processing..." : "Proceed to Payment"}
            </Button>
        </form>
    );
}
