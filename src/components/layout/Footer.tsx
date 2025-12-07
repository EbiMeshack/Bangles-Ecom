import Link from "next/link";
import { Facebook, Instagram, Twitter } from "lucide-react";

export function Footer() {
    return (
        <footer className="bg-white/50 dark:bg-black/20 mt-16 py-10 border-t">
            <div className="container mx-auto px-4 flex flex-col gap-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="flex flex-col gap-4">
                        <h3 className="font-bold text-lg">Bangle Co.</h3>
                        <p className="text-sm text-muted-foreground">
                            Get the latest on new designs and exclusive offers delivered straight to you.
                        </p>
                        <p className="text-sm text-muted-foreground">hello@bangleco.com</p>
                    </div>
                    <div className="col-span-1 md:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-8">
                        <div>
                            <h4 className="font-semibold mb-3">Shop</h4>
                            <ul className="space-y-2">
                                <li>
                                    <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                                        New Arrivals
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                                        Best Sellers
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                                        Collections
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-3">About</h4>
                            <ul className="space-y-2">
                                <li>
                                    <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                                        Our Story
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                                        Contact Us
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                                        FAQs
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-3">Follow Us</h4>
                            <div className="flex space-x-4">
                                <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                    <Facebook className="size-6" />
                                    <span className="sr-only">Facebook</span>
                                </Link>
                                <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                    <Instagram className="size-6" />
                                    <span className="sr-only">Instagram</span>
                                </Link>
                                <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                    <Twitter className="size-6" />
                                    <span className="sr-only">Twitter</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="w-full text-center py-10">
                    <h2 className="text-6xl sm:text-7xl md:text-8xl font-bold tracking-tight leading-none opacity-10">
                        Bangle Co.
                    </h2>
                </div>
                <div className="flex flex-col sm:flex-row justify-between items-center text-xs text-muted-foreground border-t pt-8 gap-4">
                    <span>© 2024 Bangle Co. All rights reserved.</span>
                    <div className="flex gap-4">
                        <Link href="#" className="hover:text-primary transition-colors">
                            Privacy Policy
                        </Link>
                        <Link href="#" className="hover:text-primary transition-colors">
                            Terms of Service
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
