"use client";

import Link from "next/link";
import { User, Heart, ShoppingCart, Menu, LogOut, Package, Settings, LogIn, UserPlus, ChevronDown } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useConvexAuth } from "convex/react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { CartSheet } from "@/components/cart/CartSheet";


export function Header() {
    const { isAuthenticated } = useConvexAuth();
    const router = useRouter();
    const { totalItems, toggleCart } = useCart();
    // Get user data directly from the session instead of querying the database
    const { data: session } = authClient.useSession();
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    const handleLogout = async () => {
        await authClient.signOut();
        router.push("/");
    };

    return (
        <header className="sticky top-0 z-50 w-full border-none bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6 relative">

                {/* Mobile Menu Trigger (Left) - Hidden on Desktop */}
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="md:hidden -ml-2">
                            <Menu className="size-6" />
                            <span className="sr-only">Menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-[300px] sm:w-[400px] p-0 flex flex-col">
                        <div className="p-6 border-b">
                            <SheetTitle className="text-left text-xl font-bold tracking-tight">Bangle Co.</SheetTitle>
                        </div>

                        <nav className="flex-1 overflow-y-auto py-6 px-6 flex flex-col gap-6">
                            <div className="flex flex-col gap-4">

                                <Link href="/collections" className="text-2xl font-semibold tracking-tight hover:text-primary transition-colors">
                                    Collections
                                </Link>
                                <Link href="/about" className="text-2xl font-semibold tracking-tight hover:text-primary transition-colors">
                                    About Us
                                </Link>
                                <Link href="#" className="text-2xl font-semibold tracking-tight hover:text-primary transition-colors">
                                    Help & Support
                                </Link>
                            </div>

                            <hr className="border-border/50" />

                            <div className="flex flex-col gap-4 text-muted-foreground">

                                <Link href="/favorites" className="flex items-center gap-3 text-lg font-medium hover:text-foreground transition-colors">
                                    <Heart className="size-5" />
                                    Favorites
                                </Link>
                                <Link href="/cart" className="flex items-center gap-3 text-lg font-medium hover:text-foreground transition-colors">
                                    <ShoppingCart className="size-5" />
                                    My Cart ({totalItems})
                                </Link>

                            </div>

                            <hr className="border-border/50" />

                            <div className="flex flex-col gap-4">
                                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Account</h3>
                                {isAuthenticated ? (
                                    <div className="flex flex-col gap-2">
                                        <button
                                            onClick={() => setIsProfileOpen(!isProfileOpen)}
                                            className="flex items-center justify-between w-full text-lg font-medium hover:text-primary transition-colors py-2"
                                        >
                                            <div className="flex items-center gap-3">
                                                <span>{session?.user?.name || "User"}</span>
                                            </div>
                                            <ChevronDown className={`size-5 transition-transform duration-200 ${isProfileOpen ? "rotate-180" : ""}`} />
                                        </button>

                                        {isProfileOpen && (
                                            <div className="flex flex-col gap-4 pl-4 animate-in slide-in-from-top-2 fade-in-0 duration-200">
                                                <Link href="/profile" className="flex items-center gap-3 text-lg font-medium hover:text-foreground transition-colors">
                                                    <User className="size-5" />
                                                    Profile
                                                </Link>
                                                <Link href="/orders" className="flex items-center gap-3 text-lg font-medium hover:text-foreground transition-colors">
                                                    <Package className="size-5" />
                                                    Orders
                                                </Link>
                                                <button
                                                    onClick={handleLogout}
                                                    className="flex items-center gap-3 text-lg font-medium hover:text-destructive transition-colors text-left"
                                                >
                                                    <LogOut className="size-5" />
                                                    Logout
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 gap-4">
                                        <Button asChild variant="outline">
                                            <Link href="/login">Login</Link>
                                        </Button>
                                        <Button asChild>
                                            <Link href="/signup">Sign Up</Link>
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </nav>
                        <div className="p-6 border-t bg-muted/20">
                            <p className="text-xs text-muted-foreground text-center">
                                © {new Date().getFullYear()} Bangle Co.
                            </p>
                        </div>
                    </SheetContent>
                </Sheet>

                {/* Logo - Absolute Center on Mobile, Static Left on Desktop */}
                <Link href="/" className="flex items-center gap-2 absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0 md:transform-none">
                    <div className="size-6 text-primary">
                        <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                            <path d="M42.4379 44C42.4379 44 36.0744 33.9038 41.1692 24C46.8624 12.9336 42.2078 4 42.2078 4L7.01134 4C7.01134 4 11.6577 12.932 5.96912 23.9969C0.876273 33.9029 7.27094 44 7.27094 44L42.4379 44Z" fill="currentColor"></path>
                        </svg>
                    </div>
                    <span className="text-lg font-bold tracking-tight">Bangle Co.</span>
                </Link>

                {/* Desktop Nav - Hidden on Mobile */}
                <nav className="hidden md:flex items-center gap-6">
                    <Link href="/collections" className="text-sm font-medium hover:text-primary transition-colors">
                        Collections
                    </Link>
                    <Link href="/orders" className="text-sm font-medium hover:text-primary transition-colors">
                        Orders
                    </Link>
                    <Link href="/about" className="text-sm font-medium hover:text-primary transition-colors">
                        About
                    </Link>
                    <Link href="#" className="text-sm font-medium hover:text-primary transition-colors">
                        Help
                    </Link>
                </nav>

                {/* Actions - Right */}
                <div className="flex items-center gap-2">
                    {/* User Menu - Hidden on Mobile, Visible on Desktop */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="hidden md:flex">
                                <User className="size-5" />
                                <span className="sr-only">User menu</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            {isAuthenticated ? (
                                <>
                                    <DropdownMenuLabel>
                                        <div className="flex flex-col space-y-1">
                                            <p className="text-sm font-medium leading-none">{session?.user?.name || "User"}</p>
                                            <p className="text-xs leading-none text-muted-foreground">{session?.user?.email}</p>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem asChild>
                                        <Link href="/profile" className="cursor-pointer w-full flex items-center">
                                            <User className="mr-2 h-4 w-4" />
                                            <span>Profile</span>
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link href="/orders" className="cursor-pointer w-full flex items-center">
                                            <Package className="mr-2 h-4 w-4" />
                                            <span>Orders</span>
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link href="/settings" className="cursor-pointer w-full flex items-center">
                                            <Settings className="mr-2 h-4 w-4" />
                                            <span>Settings</span>
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        onClick={handleLogout}
                                        className="cursor-pointer text-destructive focus:text-destructive"
                                    >
                                        <LogOut className="mr-2 h-4 w-4" />
                                        <span>Logout</span>
                                    </DropdownMenuItem>
                                </>
                            ) : (
                                <>
                                    <DropdownMenuItem asChild>
                                        <Link href="/login" className="cursor-pointer w-full flex items-center">
                                            <LogIn className="mr-2 h-4 w-4" />
                                            <span>Login</span>
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link href="/signup" className="cursor-pointer w-full flex items-center">
                                            <UserPlus className="mr-2 h-4 w-4" />
                                            <span>Signup</span>
                                        </Link>
                                    </DropdownMenuItem>
                                </>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <Button variant="ghost" size="icon" className="hidden md:flex" asChild>
                        <Link href="/favorites">
                            <Heart className="size-5" />
                            <span className="sr-only">Favorites</span>
                        </Link>
                    </Button>
                    <Button variant="ghost" size="icon" onClick={toggleCart} className="relative">
                        <ShoppingCart className="size-5" />
                        <span className="sr-only">Cart</span>
                        {totalItems > 0 && (
                            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] font-medium text-primary-foreground flex items-center justify-center">
                                {totalItems}
                            </span>
                        )}
                    </Button>
                    <CartSheet />
                </div>
            </div>
        </header>
    );
}
