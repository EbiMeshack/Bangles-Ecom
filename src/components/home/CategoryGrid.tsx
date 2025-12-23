import { Button } from "@/components/ui/button";
import { MoveRight } from "lucide-react";
import Link from "next/link";

const categories = [
    {
        title: "Bangles",
        image: "https://i.pinimg.com/736x/f9/ae/5c/f9ae5cd9221cd279e401ba6a7d7f72f1.jpg",
        alt: "A close-up of intricate gold bangles.",
    },
    {
        title: "Rings",
        image: "https://i.pinimg.com/736x/24/1f/c8/241fc8abe5c1619201e354f902792d6d.jpg",
        alt: "Elegant rings for every occasion.",
    },
    {
        title: "Earrings",
        image: "https://i.pinimg.com/736x/fc/8f/88/fc8f888198c0f86f37e5c09b0f162734.jpg",
        alt: "Beautiful earrings to match your style.",
    },
    {
        title: "Necklaces",
        image: "https://i.pinimg.com/1200x/d3/67/fd/d367fd0bd12f6d6b7e42b4eff3cee3d1.jpg",
        alt: "Stunning necklaces for special moments.",
    },
];

export function CategoryGrid() {
    return (
        <section className="container mx-auto px-4 py-8 md:px-12">
            <div className="flex items-center gap-2 mb-4">
                <h2 className="text-2xl font-bold leading-tight tracking-[-0.015em]">
                    Shop by Category
                </h2>
                <Link href="/collections">
                    <Button variant="ghost" size="sm" className="rounded-full hover:bg-gray-100 mt-1 hover:translate-x-2">
                        <MoveRight className="h-5 w-5 size-5 " />
                    </Button>
                </Link>
            </div>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(158px,1fr))] gap-4">
                {categories.map((category) => (
                    <Link
                        key={category.title}
                        href={`/collections`}
                        className="group relative flex aspect-square flex-col justify-end overflow-hidden rounded-lg bg-gray-100 bg-cover bg-center p-4 transition-transform hover:scale-105 hover:shadow-lg"
                        style={{
                            backgroundImage: `linear-gradient(0deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0) 100%), url("${category.image}")`,
                        }}
                    >
                        <span className="relative z-10 w-4/5 text-base font-bold leading-tight text-white line-clamp-2">
                            {category.title}
                        </span>
                    </Link>
                ))}
            </div>
        </section>
    );
}
