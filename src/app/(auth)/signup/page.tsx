"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signupSchema, type SignupFormData } from "@/schemas/auth.schema";
import { authClient } from "@/lib/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function SignupPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const createUserProfile = useMutation(api.userProfiles.createUserProfile);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SignupFormData>({
        resolver: zodResolver(signupSchema),
    });

    const handleGoogleSignup = async () => {
        try {
            setIsLoading(true);
            setError(null);

            await authClient.signIn.social({
                provider: "google",
                callbackURL: "/complete-profile",
            });
        } catch (err) {
            setError("Google sign-in failed. Please try again.");
            console.error("Google signup error:", err);
            setIsLoading(false);
        }
    };

    const onSubmit = async (data: SignupFormData) => {
        try {
            setIsLoading(true);
            setError(null);

            const result = await authClient.signUp.email({
                email: data.email,
                password: data.password,
                name: data.name,
                callbackURL: "/",
            });

            if (result.error) {
                setError(result.error.message || "Signup failed. Please try again.");
                return;
            }

            // Create user profile in Convex with email and phone
            if (result.data?.user?.id) {
                await createUserProfile({
                    userId: result.data.user.id,
                    email: data.email,
                    phoneNumber: data.phone,
                    name: data.name,
                });
            }

            // Redirect to home or dashboard on success
            router.push("/");
        } catch (err) {
            setError("An unexpected error occurred. Please try again.");
            console.error("Signup error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative flex min-h-screen flex-col items-center justify-center bg-background px-4 py-24 text-foreground">
            {/* Branding - Top Left */}
            <div className="absolute top-8 left-4 md:top-12 md:left-12">
                <Link href="/" className="flex items-center gap-2">
                    <div className="size-6 text-primary">
                        <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                            <path d="M42.4379 44C42.4379 44 36.0744 33.9038 41.1692 24C46.8624 12.9336 42.2078 4 42.2078 4L7.01134 4C7.01134 4 11.6577 12.932 5.96912 23.9969C0.876273 33.9029 7.27094 44 7.27094 44L42.4379 44Z" fill="currentColor"></path>
                        </svg>
                    </div>
                    <span className="text-lg font-bold tracking-tight">Bangle Co.</span>
                </Link>
            </div>

            <div className="w-full max-w-[400px] space-y-8">
                {/* Header */}
                <div className="text-start space-y-1">
                    <h1 className="text-2xl font-medium tracking-tight">
                        Create an account
                    </h1>
                    <p className="text-muted-foreground text-[15px]">
                        Enter your information to get started with Bangle
                    </p>
                </div>

                {/* Social Login */}
                <div className="space-y-3">
                    <Button
                        type="button"
                        variant="outline"
                        className="w-full h-11 font-medium transition-all"
                        disabled={isLoading}
                        onClick={handleGoogleSignup}
                    >
                        <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                            <path
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                fill="#4285F4"
                            />
                            <path
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                fill="#34A853"
                            />
                            <path
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                fill="#FBBC05"
                            />
                            <path
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                fill="#EA4335"
                            />
                        </svg>
                        Continue with Google
                    </Button>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
                        {error}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-1">
                        <Label
                            htmlFor="name"
                            className="text-[13px] font-medium text-muted-foreground"
                        >
                            Full Name
                        </Label>
                        <Input
                            id="name"
                            placeholder="John Doe"
                            className="h-11"
                            {...register("name")}
                            disabled={isLoading}
                        />
                        {errors.name && (
                            <p className="text-sm text-destructive">{errors.name.message}</p>
                        )}
                    </div>

                    <div className="space-y-1">
                        <Label
                            htmlFor="phone"
                            className="text-[13px] font-medium text-muted-foreground"
                        >
                            Phone Number
                        </Label>
                        <Input
                            id="phone"
                            type="tel"
                            placeholder="+91 "
                            className="h-11"
                            {...register("phone")}
                            disabled={isLoading}
                        />
                        {errors.phone && (
                            <p className="text-sm text-destructive">{errors.phone.message}</p>
                        )}
                    </div>

                    <div className="space-y-1">
                        <Label
                            htmlFor="email"
                            className="text-[13px] font-medium text-muted-foreground"
                        >
                            Email
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="m@example.com"
                            className="h-11"
                            {...register("email")}
                            disabled={isLoading}
                        />
                        {errors.email && (
                            <p className="text-sm text-destructive">{errors.email.message}</p>
                        )}
                    </div>

                    <div className="space-y-1">
                        <Label
                            htmlFor="password"
                            className="text-[13px] font-medium text-muted-foreground"
                        >
                            Password
                        </Label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="Enter your password"
                            className="h-11"
                            {...register("password")}
                            disabled={isLoading}
                        />
                        {errors.password && (
                            <p className="text-sm text-destructive">
                                {errors.password.message}
                            </p>
                        )}
                    </div>

                    <div className="space-y-1">
                        <Label
                            htmlFor="confirmPassword"
                            className="text-[13px] font-medium text-muted-foreground"
                        >
                            Confirm Password
                        </Label>
                        <Input
                            id="confirmPassword"
                            type="password"
                            placeholder="Enter your password again"
                            className="h-11"
                            {...register("confirmPassword")}
                            disabled={isLoading}
                        />
                        {errors.confirmPassword && (
                            <p className="text-sm text-destructive">
                                {errors.confirmPassword.message}
                            </p>
                        )}
                    </div>

                    <Button
                        type="submit"
                        className="w-full h-11 font-medium"
                        disabled={isLoading}
                    >
                        {isLoading ? "Creating account..." : "Sign Up"}
                    </Button>
                </form>

                {/* Footer Links */}
                <div className="text-center">
                    <p className="text-[14px] text-muted-foreground">
                        Already have an account?{" "}
                        <Link
                            href="/login"
                            className="text-foreground hover:underline font-medium"
                        >
                            Log in
                        </Link>
                    </p>
                </div>
            </div>

            {/* Bottom info */}
            <div className="fixed bottom-6 text-center">
                <p className="text-[13px] text-muted-foreground/60">
                    Terms of Service and Privacy Policy
                </p>
            </div>
        </div>
    );
}
