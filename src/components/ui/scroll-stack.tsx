import React from "react";
import { cn } from "@/lib/utils";

interface ScrollStackProps {
    children: React.ReactNode;
    className?: string;
    offset?: number;
}

export const ScrollStack = ({
    children,
    className,
    offset = 40
}: ScrollStackProps) => {
    const childrenArray = React.Children.toArray(children);

    return (
        <div className={cn("relative flex flex-col items-center w-full", className)}>
            {childrenArray.map((child, index) => (
                <div
                    key={index}
                    className="sticky w-full mx-auto"
                    style={{
                        top: `calc(10vh + ${index * offset}px)`, // Start sticking a bit down the screen
                        zIndex: index,
                    }}
                >
                    {child}
                </div>
            ))}
            <div className="h-[10vh] w-full" aria-hidden="true" />
        </div>
    );
};
