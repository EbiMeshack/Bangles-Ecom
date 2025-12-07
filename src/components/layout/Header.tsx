import Link from "next/link";
import { Search, Heart, ShoppingCart, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";

export function Header() {
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
                                <Link href="#" className="text-2xl font-semibold tracking-tight hover:text-primary transition-colors">
                                    Shop All
                                </Link>
                                <Link href="#" className="text-2xl font-semibold tracking-tight hover:text-primary transition-colors">
                                    Collections
                                </Link>
                                <Link href="#" className="text-2xl font-semibold tracking-tight hover:text-primary transition-colors">
                                    About Us
                                </Link>
                                <Link href="#" className="text-2xl font-semibold tracking-tight hover:text-primary transition-colors">
                                    Contact
                                </Link>
                            </div>

                            <hr className="border-border/50" />

                            <div className="flex flex-col gap-4 text-muted-foreground">
                                <Link href="#" className="flex items-center gap-3 text-lg font-medium hover:text-foreground transition-colors">
                                    <Search className="size-5" />
                                    Search
                                </Link>
                                <Link href="#" className="flex items-center gap-3 text-lg font-medium hover:text-foreground transition-colors">
                                    <Heart className="size-5" />
                                    Favorites
                                </Link>
                                <Link href="#" className="flex items-center gap-3 text-lg font-medium hover:text-foreground transition-colors">
                                    <ShoppingCart className="size-5" />
                                    My Cart
                                </Link>
                                <Link href="#" className="text-lg font-medium hover:text-foreground transition-colors">
                                    Help & Support
                                </Link>
                            </div>
                        </nav>
                        <div className="p-6 border-t bg-muted/20">
                            <p className="text-xs text-muted-foreground text-center">
                                © 2024 Bangle Co.
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
                    <Link href="#" className="text-sm font-medium hover:text-primary transition-colors">
                        Shop All
                    </Link>
                    <Link href="#" className="text-sm font-medium hover:text-primary transition-colors">
                        Collections
                    </Link>
                    <Link href="#" className="text-sm font-medium hover:text-primary transition-colors">
                        About Us
                    </Link>
                    <Link href="#" className="text-sm font-medium hover:text-primary transition-colors">
                        Contact
                    </Link>
                </nav>

                {/* Actions - Right */}
                <div className="flex items-center gap-2">
                    {/* Search - Hidden on Mobile, Visible on Desktop */}
                    <Button variant="ghost" size="icon" className="hidden md:flex">
                        <Search className="size-5" />
                        <span className="sr-only">Search</span>
                    </Button>
                    <Button variant="ghost" size="icon" className="hidden md:flex">
                        <Heart className="size-5" />
                        <span className="sr-only">Favorites</span>
                    </Button>
                    <Button variant="ghost" size="icon">
                        <ShoppingCart className="size-5" />
                        <span className="sr-only">Cart</span>
                    </Button>
                </div>
            </div>
        </header>
    );
}
