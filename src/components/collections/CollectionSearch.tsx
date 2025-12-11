"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";

interface CollectionSearchProps {
    value: string;
    onChange: (value: string) => void;
}

const PLACEHOLDERS = [
    "bangles...",
    "rings...",
    "necklaces...",
    "earrings...",
    "bracelets...",
];

export function CollectionSearch({ value, onChange }: CollectionSearchProps) {
    const [placeholderIndex, setPlaceholderIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setPlaceholderIndex((prev) => (prev + 1) % PLACEHOLDERS.length);
        }, 3000); // 1.5s interval

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="mb-0 md:mb-12 px-4">
            <div className="relative mx-auto max-w-lg">
                <input
                    className="w-full rounded-full border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-black/20 py-3 pl-12 pr-4 text-lg focus:border-primary focus:ring-primary dark:text-gray-200 outline-none border focus:ring-1 transition-all"
                    type="search"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                />

                {/* Custom Placeholder Overlay */}
                {!value && (
                    <div className="absolute inset-y-0 left-0 flex items-center pl-12 pointer-events-none text-lg">
                        <span className="text-muted-foreground/60 dark:text-muted-foreground/50 italic font-work-sans">
                            Search for{" "}
                        </span>
                        <span
                            key={placeholderIndex}
                            className="text-primary italic font-medium ml-1 animate-in fade-in slide-in-from-bottom-1 duration-300 font-work-sans"
                        >
                            {PLACEHOLDERS[placeholderIndex]}
                        </span>
                    </div>
                )}

                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                    <Search className="text-gray-500 w-6 h-6" />
                </div>
            </div>
        </div>
    );
}
