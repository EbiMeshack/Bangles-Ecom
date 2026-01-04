import Image from "next/image";
import { formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { CalendarDays, Package } from "lucide-react";

interface OrderItem {
    productId: string; // ID type from convex
    quantity: number;
    price: number;
    name: string;
    image?: string;
}

interface OrderProps {
    order: {
        _id: string;
        _creationTime: number;
        orderNumber: string;
        amount: number;
        status: string;
        createdAt: number;
        items: OrderItem[];
    };
}

export function OrderCard({ order }: OrderProps) {
    const formatDate = (timestamp: number) => {
        return new Date(timestamp).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case "completed":
            case "delivered":
                return "bg-green-100 text-green-800 hover:bg-green-100";
            case "processing":
            case "shipped":
                return "bg-blue-100 text-blue-800 hover:bg-blue-100";
            case "pending":
                return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
            case "cancelled":
                return "bg-red-100 text-red-800 hover:bg-red-100";
            default:
                return "bg-gray-100 text-gray-800 hover:bg-gray-100";
        }
    };

    return (
        <Card className="overflow-hidden">
            <CardHeader className="bg-muted/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <span className="font-semibold text-lg">{order.orderNumber}</span>
                        <Badge variant="secondary" className={getStatusColor(order.status)}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CalendarDays className="h-4 w-4" />
                        <span>Placed on {formatDate(order.createdAt)}</span>
                    </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                    <span className="text-sm text-muted-foreground">Total Amount</span>
                    <span className="text-lg font-bold">{formatCurrency(order.amount)}</span>
                </div>
            </CardHeader>
            <CardContent className="p-6">
                <div className="space-y-6">
                    {order.items.map((item, index) => (
                        <div key={index} className="flex gap-4 items-start">
                            <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border bg-muted">
                                {item.image ? (
                                    <Image
                                        src={item.image}
                                        alt={item.name}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center">
                                        <Package className="h-8 w-8 text-muted-foreground" />
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-base truncate">{item.name}</h4>
                                <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                                    <span>Qty: {item.quantity}</span>
                                    <span>{formatCurrency(item.price)} each</span>
                                </div>
                            </div>
                            <div className="text-right font-medium">
                                {formatCurrency(item.price * item.quantity)}
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
