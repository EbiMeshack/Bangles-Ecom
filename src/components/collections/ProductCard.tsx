import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Star, Heart, ShoppingCart } from "lucide-react";

interface Product {
    id: string;
    name: string;
    price: number;
    category: string;
    image: string;
    rating: number;
    reviews: number;
}

interface ProductCardProps {
    product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
    return (
        <Card className="overflow-hidden border-none shadow-none bg-transparent group relative">
            <CardContent className="p-0">
                <div className="overflow-hidden rounded-lg relative">
                    <div
                        className="aspect-square bg-cover bg-center transition-transform duration-500"
                        style={{ backgroundImage: `url("${product.image}")` }}
                    />

                    {/* Favorite Button */}
                    <button className="absolute top-2 right-2 p-1.5 bg-white/80 backdrop-blur-sm rounded-full text-foreground hover:bg-white hover:text-red-500 transition-colors shadow-sm">
                        <Heart className="w-4 h-4" />
                    </button>

                    {/* Add to Cart Button Overlay */}
                    <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out flex justify-center bg-gradient-to-t from-black/50 to-transparent">
                        <button className="flex items-center gap-2 bg-white text-black text-xs font-bold uppercase tracking-wider py-2.5 px-6 rounded-full hover:bg-white/90 transition-colors shadow-lg">
                            <ShoppingCart className="w-3.5 h-3.5" />
                            Add to Cart
                        </button>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="flex flex-col items-start gap-1 p-0 pl-3 pt-3">
                <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                    {product.category}
                </span>
                <h3 className="w-full font-semibold text-base text-foreground leading-tight truncate">{product.name}</h3>
                <div className="flex w-full items-center justify-between mt-1">
                    <p className="font-bold text-lg">${product.price.toFixed(2)}</p>
                    <div className="hidden md:flex items-center gap-1.5 text-sm">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{product.rating}</span>
                        <span className="text-muted-foreground text-xs">({product.reviews})</span>
                    </div>
                </div>
            </CardFooter>
        </Card>
    );
}
