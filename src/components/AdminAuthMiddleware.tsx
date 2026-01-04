"use client";

import { useConvexAuth, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { SpinnerCustom } from "@/components/ui/spinner";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminAuthMiddleware({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, isLoading: isAuthLoading } = useConvexAuth();
    const router = useRouter();

    const userProfile = useQuery(api.userProfiles.getCurrentUserProfile,
        isAuthenticated ? {} : "skip"
    );

    if (isAuthLoading || (isAuthenticated && userProfile === undefined)) {
        return (
            <div className="flex h-screen w-full items-center justify-center">
                <SpinnerCustom />
            </div>
        );
    }

    const isNotAdmin = !isAuthenticated || (userProfile && userProfile.role !== "admin") || (isAuthenticated && userProfile === null);

    if (isNotAdmin) {
        return (
            <div className="flex h-screen w-full flex-col items-center justify-center gap-4">
                <h1 className="text-2xl font-bold text-destructive">Access Denied</h1>
                <p className="text-muted-foreground">You do not have permission to view this page.</p>
                <button
                    onClick={() => router.push("/")}
                    className="text-primary hover:underline"
                >
                    Return to Home
                </button>
            </div>
        );
    }

    return <>{children}</>;
}

export function RedirectAuthenticatedUser({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, isLoading: isAuthLoading } = useConvexAuth();
    const router = useRouter();

    const userProfile = useQuery(api.userProfiles.getCurrentUserProfile,
        isAuthenticated ? {} : "skip"
    );

    useEffect(() => {
        if (!isAuthLoading && isAuthenticated && userProfile !== undefined) {
            if (userProfile?.role === "admin") {
                router.push("/admin");
            } else {
                router.push("/");
            }
        }
    }, [isAuthenticated, isAuthLoading, userProfile, router]);

    if (isAuthLoading || isAuthenticated) {
        return (
            <div className="flex h-screen w-full items-center justify-center">
                <SpinnerCustom />
            </div>
        );
    }

    return <>{children}</>;
}

