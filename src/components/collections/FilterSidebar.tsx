"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Star } from "lucide-react";

import { cn } from "@/lib/utils";

export interface FilterSidebarProps {
    categories: string[];
    selectedCategories: string[];
    setSelectedCategories: (categories: string[]) => void;
    priceRange: [number, number];
    setPriceRange: (range: [number, number]) => void;
    minPrice: number;
    maxPrice: number;
    minRating: number | null;
    setMinRating: (rating: number | null) => void;
    className?: string;
}

export function FilterSidebar({
    categories,
    selectedCategories,
    setSelectedCategories,
    priceRange,
    setPriceRange,
    minPrice,
    maxPrice,
    minRating,
    setMinRating,
    className,
}: FilterSidebarProps) {
    const handleCategoryChange = (category: string) => {
        if (selectedCategories.includes(category)) {
            setSelectedCategories(selectedCategories.filter((c) => c !== category));
        } else {
            setSelectedCategories([...selectedCategories, category]);
        }
    };

    return (
        <aside className={cn("w-full md:w-64 lg:w-72 space-y-8 sticky top-24 max-h-[calc(100vh-6rem)] overflow-y-auto pl-2 pr-4 scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent", className)}>
            <div>
                <h3 className="text-xl font-bold mb-6">Filters</h3>
            </div>

            <div>
                <h4 className="font-semibold mb-3">Category</h4>
                <div className="space-y-2">
                    {categories.map((category) => (
                        <div key={category} className="flex items-center space-x-2">
                            <Checkbox
                                id={`category-${category}`}
                                checked={selectedCategories.includes(category)}
                                onCheckedChange={() => handleCategoryChange(category)}
                            />
                            <Label
                                htmlFor={`category-${category}`}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 capitalize cursor-pointer"
                            >
                                {category}
                            </Label>
                        </div>
                    ))}
                </div>
            </div>

            <div>
                <h4 className="font-semibold mb-3">Price Range</h4>
                <div className="space-y-4">
                    <Slider
                        defaultValue={[minPrice, maxPrice]}
                        max={maxPrice}
                        min={minPrice}
                        step={10}
                        value={priceRange}
                        onValueChange={(value) => setPriceRange(value as [number, number])}
                    />
                    <div className="flex justify-between text-sm text-muted-foreground">
                        <span>₹{priceRange[0]}</span>
                        <span>₹{priceRange[1]}</span>
                    </div>
                </div>
            </div>

            <div>
                <h4 className="font-semibold mb-3">Reviews</h4>
                <div className="space-y-2">
                    {[4, 3, 2, 1].map((star) => (
                        <div
                            key={star}
                            className="flex items-center space-x-2 cursor-pointer group"
                            onClick={() => setMinRating(minRating === star ? null : star)}
                        >
                            <Checkbox id={`rating-${star}`} checked={minRating === star} onCheckedChange={() => setMinRating(minRating === star ? null : star)} />
                            <div className="flex items-center group-hover:text-primary transition-colors">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`h-4 w-4 ${i < star ? "fill-primary text-primary" : "text-muted-foreground"
                                            }`}
                                    />
                                ))}
                                <span className="ml-2 text-sm text-muted-foreground">& Up</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </aside>
    );
}
