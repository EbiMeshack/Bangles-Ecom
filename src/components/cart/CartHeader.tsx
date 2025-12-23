import { Button } from "@/components/ui/button";

interface CartHeaderProps {
    onClearCart?: () => void;
}

export function CartHeader({ onClearCart }: CartHeaderProps) {
    return (
        <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Shopping Cart</h1>
            <Button
                variant="ghost"
                onClick={onClearCart}
                className="text-red-500 hover:text-red-600 hover:bg-red-50"
            >
                Clear Cart
            </Button>
        </div>
    );
}
