export interface Product {
    id: string;
    name: string;
    price: number;
    category: 'bangles' | 'earrings' | 'necklace' | 'rings';
    image: string;
    rating: number;
    reviews: number;
}
