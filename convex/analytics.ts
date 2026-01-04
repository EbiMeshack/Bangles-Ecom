import { query } from "./_generated/server";
import { v } from "convex/values";

export const getDashboardStats = query({
    args: {},
    handler: async (ctx) => {
        const orders = await ctx.db.query("orders").collect();
        console.log("Dashboard Stats: Found orders:", orders.length);

        const totalRevenue = orders.reduce((sum, order) => sum + order.amount, 0);
        const totalOrders = orders.length;

        const customers = await ctx.db.query("userProfiles").collect();
        const totalCustomers = customers.length;

        const activeCoupons = await ctx.db
            .query("coupons")
            .withIndex("by_isActive", (q) => q.eq("isActive", true))
            .collect();
        const totalActiveCoupons = activeCoupons.length;

        const recentOrders = [...orders].sort((a, b) => b.createdAt - a.createdAt).slice(0, 5);

        // --- Analytics Data Calculation ---
        const days = 30;
        const now = Date.now();
        const pastDate = now - days * 24 * 60 * 60 * 1000;

        // Filter orders for the last 30 days for the chart
        const recentOrdersForChart = orders.filter(o => o.createdAt >= pastDate);

        const revenueByDate: Record<string, number> = {};
        const statusCounts: Record<string, number> = {};

        // Product sales Aggregation
        const productSales: Record<string, { name: string; sales: number; revenue: number }> = {};


        recentOrdersForChart.forEach((order) => {
            const date = new Date(order.createdAt).toISOString().split('T')[0];
            revenueByDate[date] = (revenueByDate[date] || 0) + order.amount;
        });

        // Use all orders for status distribution ?? Or just recent? Let's use all for overall health
        orders.forEach(order => {
            statusCounts[order.status] = (statusCounts[order.status] || 0) + 1;

            // Calculate top products based on ALL orders
            if (order.items) {
                order.items.forEach(item => {
                    const productId = item.productId;
                    if (!productSales[productId]) {
                        productSales[productId] = { name: item.name, sales: 0, revenue: 0 };
                    }
                    productSales[productId].sales += item.quantity;
                    productSales[productId].revenue += item.quantity * item.price;
                });
            }
        });

        const chartData = Object.entries(revenueByDate).map(([date, amount]) => ({
            date,
            revenue: amount,
        })).sort((a, b) => a.date.localeCompare(b.date));

        const statusData = Object.entries(statusCounts).map(([status, count]) => ({
            name: status.charAt(0).toUpperCase() + status.slice(1),
            value: count,
            fill: status === 'completed' ? '#22c55e' : status === 'pending' ? '#f59e0b' : status === 'cancelled' ? '#ef4444' : '#94a3b8'
        }));

        const topProducts = Object.values(productSales)
            .sort((a, b) => b.sales - a.sales)
            .slice(0, 5);

        return {
            totalRevenue,
            totalOrders,
            totalCustomers,
            totalActiveCoupons,
            recentOrders,
            chartData,
            statusData,
            topProducts
        };
    },
});

export const getAnalyticsData = query({
    args: { days: v.optional(v.number()) },
    handler: async (ctx, args) => {
        const days = args.days || 30;
        const now = Date.now();
        const pastDate = now - days * 24 * 60 * 60 * 1000;

        const orders = await ctx.db
            .query("orders")
            .withIndex("by_createdAt", (q) => q.gte("createdAt", pastDate))
            .collect();

        const revenueByDate: Record<string, number> = {};
        const statusCounts: Record<string, number> = {};

        orders.forEach((order) => {
            const date = new Date(order.createdAt).toISOString().split('T')[0];
            revenueByDate[date] = (revenueByDate[date] || 0) + order.amount;

            statusCounts[order.status] = (statusCounts[order.status] || 0) + 1;
        });

        const chartData = Object.entries(revenueByDate).map(([date, amount]) => ({
            date,
            revenue: amount,
        })).sort((a, b) => a.date.localeCompare(b.date));

        const statusData = Object.entries(statusCounts).map(([status, count]) => ({
            name: status.charAt(0).toUpperCase() + status.slice(1),
            value: count,
        }));

        return {
            chartData,
            statusData
        };
    },
});
