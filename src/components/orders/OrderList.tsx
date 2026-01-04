import { OrderCard } from "./OrderCard";
import { Id } from "@/convex/_generated/dataModel";

interface OrderItem {
    productId: string;
    quantity: number;
    price: number;
    name: string;
    image?: string;
}

interface Order {
    _id: Id<"orders">; // Use Id type if possible, or string then cast
    _creationTime: number;
    orderNumber: string;
    amount: number;
    status: string;
    createdAt: number;
    items: OrderItem[];
}

interface OrderListProps {
    orders: any[]; // Using any[] to avoid strict type mismatch with Convex return type for now, or better to shape it.
}

export function OrderList({ orders }: OrderListProps) {
    return (
        <div className="space-y-8">
            {orders.map((order) => (
                <OrderCard key={order._id} order={order} />
            ))}
        </div>
    );
}
