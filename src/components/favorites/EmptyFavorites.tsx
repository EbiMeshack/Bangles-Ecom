import { Button } from "@/components/ui/button";
import { ArrowRight, Heart } from "lucide-react";
import Link from "next/link";

export const EmptyFavorites = () => (
    <div className="flex flex-col min-h-[60vh] md:min-h-[75vh] items-center justify-center text-center">
        <div className="bg-muted/50 p-6 rounded-full mb-6">
            <Heart className="size-12 text-muted-foreground" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-6">No favorites yet</h1>
        <p className="text-lg text-gray-500 mb-8 max-w-md">
            Start exploring our collections and save items you love to your favorites list.
        </p>
        <Link href="/collections">
            <Button size="lg" className="rounded-full px-8">
                Explore Collections <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
        </Link>
    </div>
);
