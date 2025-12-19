"use client";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { api } from "../../../../convex/_generated/api";
import { completeProfileSchema, type CompleteProfileFormData } from "@/schemas/auth.schema";



export default function CompleteProfilePage() {
    const router = useRouter();
    const { data: session, isPending: isSessionLoading } = authClient.useSession();
    const userProfile = useQuery(api.userProfiles.getCurrentUserProfile);
    const createUserProfile = useMutation(api.userProfiles.createUserProfile);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<CompleteProfileFormData>({
        resolver: zodResolver(completeProfileSchema),
    });

    // Handle redirection logic
    useEffect(() => {
        if (!isSessionLoading) {
            if (!session) {
                // Not logged in, redirect to login
                router.push("/login");
            } else if (userProfile) {
                // Profile already exists, redirect to home
                router.push("/");
            }
        }
    }, [session, isSessionLoading, userProfile, router]);

    const onSubmit = async (data: CompleteProfileFormData) => {
        if (!session?.user) return;

        try {
            setIsLoading(true);
            setError(null);

            await createUserProfile({
                userId: session.user.id,
                email: session.user.email || "",
                name: session.user.name || "",
                phoneNumber: data.phone,
            });

            // Redirect to home on success
            router.push("/");
        } catch (err: any) {
            console.error("Profile creation error:", err);
            setError(err.message || "Failed to create profile. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    if (isSessionLoading || userProfile === undefined) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50/50">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
        );
    }

    // If profile exists or no session (and waiting for redirect), show loading or nothing
    if (!session || userProfile) {
        return null;
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50/50 p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-2xl text-center">
                        Complete your Profile
                    </CardTitle>
                    <CardDescription className="text-center">
                        Please provide your phone number to finish setting up your account.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        {error && (
                            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input
                                id="phone"
                                type="tel"
                                placeholder="+1 (555) 000-0000"
                                {...register("phone")}
                                disabled={isLoading}
                            />
                            {errors.phone && (
                                <p className="text-sm text-red-600">
                                    {errors.phone.message}
                                </p>
                            )}
                        </div>

                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? "Saving..." : "Complete Profile"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
