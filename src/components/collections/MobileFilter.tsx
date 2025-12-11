"use client";

import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal } from "lucide-react";
import { FilterSidebar } from "./FilterSidebar";

interface MobileFilterProps {
    selectedCategories: string[];
    setSelectedCategories: (categories: string[]) => void;
    priceRange: [number, number];
    setPriceRange: (range: [number, number]) => void;
    minRating: number | null;
    setMinRating: (rating: number | null) => void;
}

export function MobileFilter(props: MobileFilterProps) {
    return (
        <div className="md:hidden block mt-1 mb-6">
            <Drawer>
                <DrawerTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-2 w-full">
                        <SlidersHorizontal className="h-4 w-4" />
                        <span>Filters</span>
                    </Button>
                </DrawerTrigger>
                <DrawerContent>
                    <div className="mx-auto w-full max-w-sm">
                        <DrawerHeader>
                            <DrawerTitle>Filters</DrawerTitle>
                            <DrawerDescription>
                                Refine your search results.
                            </DrawerDescription>
                        </DrawerHeader>
                        <div className="p-4 overflow-y-auto max-h-[50vh]">
                            <FilterSidebar
                                {...props}
                                className="w-full h-auto static max-h-none overflow-visible p-0"
                            />
                        </div>
                        <DrawerFooter>
                            <DrawerClose asChild>
                                <Button>Show Results</Button>
                            </DrawerClose>
                        </DrawerFooter>
                    </div>
                </DrawerContent>
            </Drawer>
        </div>
    );
}
