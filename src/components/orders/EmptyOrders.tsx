import Link from "next/link";
import { PackageX } from "lucide-react";
import { Button } from "@/components/ui/button";

export function EmptyOrders() {
    return (
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center mb-6">
                <PackageX className="h-12 w-12 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight mb-2">No orders found</h2>
            <p className="text-muted-foreground max-w-sm mb-8">
                You haven&apos;t placed any orders yet. Start shopping to find your favorite bangles.
            </p>
            <Link href="/">
                <Button size="lg" className="h-12 px-8">
                    Start Shopping
                </Button>
            </Link>
        </div>
    );
}
