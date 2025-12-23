export interface Product {
    id: string;
    name: string;
    price: number;
    category: 'bangles' | 'earrings' | 'necklaces' | 'rings';
    image: string;
    rating: number;
    reviews: number;
}
