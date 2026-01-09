"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { SpinnerCustom } from "@/components/ui/spinner";
import { authClient } from "@/lib/auth-client";
import { useConvexAuth } from "convex/react";
import { Calendar, LogOut, Mail, ShieldCheck, User } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
    const { isAuthenticated, isLoading } = useConvexAuth();
    const { data: session, isPending: isSessionLoading } = authClient.useSession();
    const router = useRouter();

    const handleLogout = async () => {
        await authClient.signOut();
        router.push("/");
    };

    if (isLoading || isSessionLoading) {
        return (
            <div className="flex h-[calc(100vh-4rem)] items-center justify-center bg-muted/30">
                <SpinnerCustom />
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-muted/30 px-4 py-12">
                <Card className="w-full max-w-md text-center shadow-lg">
                    <CardHeader className="space-y-4 pb-8 pt-10">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                            <User className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-2xl font-bold tracking-tight">Access Denied</h2>
                            <p className="text-muted-foreground">
                                Please sign in to view your profile and manage your account settings.
                            </p>
                        </div>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-3 pb-10">
                        <Button onClick={() => router.push("/login")} className="w-full" size="lg">
                            Sign In
                        </Button>
                        <Button variant="outline" onClick={() => router.push("/signup")} className="w-full">
                            Create Account
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-[calc(100vh-4rem)] bg-muted/30 pb-20">
            {/* Header / Cover Area */}
            <div className="h-48 w-full bg-gradient-to-r from-primary/10 via-primary/5 to-background border-b">
                <div className="container mx-auto flex h-full items-start justify-between p-6">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.push("/")}
                        className="bg-background/50 hover:bg-background/80 backdrop-blur-sm"
                    >
                        ← Back to Home
                    </Button>
                </div>
            </div>

            <div className="container mx-auto max-w-4xl px-4 text-left">
                {/* Profile Card Overlay */}
                <div className="relative -mt-24 mb-8">
                    <div className="flex flex-col gap-6 md:flex-row md:items-end md:gap-8">
                        <Avatar className="h-32 w-32 rounded-2xl border-4 border-background shadow-xl ring-1 ring-border/50">
                            <AvatarImage src={session?.user?.image || ""} alt={session?.user?.name || "User"} className="object-cover" />
                            <AvatarFallback className="rounded-2xl text-3xl font-bold bg-primary/10 text-primary">
                                {session?.user?.name?.charAt(0).toUpperCase() || "U"}
                            </AvatarFallback>
                        </Avatar>

                        <div className="flex-1 space-y-2 pb-2">
                            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-left">
                                {session?.user?.name}
                            </h1>
                            <div className="flex flex-wrap items-center gap-3 text-muted-foreground">
                                <span className="flex items-center gap-1.5 text-sm">
                                    <Mail className="h-4 w-4" />
                                    {session?.user?.email}
                                </span>

                            </div>
                        </div>

                        <div className="flex items-center gap-3 pb-2">
                            <Button variant="outline" onClick={handleLogout} className="text-destructive hover:text-destructive hover:bg-destructive/5 border-destructive/20 shadow-sm">
                                <LogOut className="mr-2 h-4 w-4" />
                                Sign Out
                            </Button>

                        </div>
                    </div>
                </div>

                {/* Profile Details Grid */}
                <div className="w-full">
                    {/* Main Info Column */}
                    <div className="space-y-6">
                        <Card className="shadow-sm">
                            <CardHeader>
                                <h3 className="text-lg font-semibold leading-none tracking-tight">Personal Information</h3>
                                <p className="text-sm text-muted-foreground">Manage your personal details and account settings.</p>
                            </CardHeader>
                            <CardContent className="grid gap-6 sm:grid-cols-2">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Full Name</label>
                                    <div className="flex items-center gap-2 p-3 rounded-md bg-muted/50 border border-transparent hover:border-border transition-colors">
                                        <User className="h-4 w-4 text-primary" />
                                        <span className="font-medium text-sm">{session?.user?.name || "N/A"}</span>
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Email Address</label>
                                    <div className="flex items-center gap-2 p-3 rounded-md bg-muted/50 border border-transparent hover:border-border transition-colors">
                                        <Mail className="h-4 w-4 text-primary" />
                                        <span className="font-medium text-sm truncate" title={session?.user?.email || ""}>
                                            {session?.user?.email || "N/A"}
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">User ID</label>
                                    <div className="flex items-center gap-2 p-3 rounded-md bg-muted/50 border border-transparent hover:border-border transition-colors">
                                        <ShieldCheck className="h-4 w-4 text-primary" />
                                        <span className="font-medium text-sm font-mono truncate" title={session?.user?.id}>
                                            {session?.user?.id}
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Join Date</label>
                                    <div className="flex items-center gap-2 p-3 rounded-md bg-muted/50 border border-transparent hover:border-border transition-colors">
                                        <Calendar className="h-4 w-4 text-primary" />
                                        <span className="font-medium text-sm">
                                            {session?.user?.createdAt
                                                ? new Date(session.user.createdAt).toLocaleDateString(undefined, {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })
                                                : "N/A"}
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                </div>
            </div>
        </div>
    );
}
