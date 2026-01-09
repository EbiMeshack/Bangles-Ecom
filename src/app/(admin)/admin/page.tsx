"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { api } from "@/convex/_generated/api";
import { formatCurrency } from "@/lib/utils";
import { useQuery } from "convex/react";
import { Package, ShoppingBag, Tag, TrendingUp, Users } from "lucide-react";
import { useState } from "react";
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Legend,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from 'recharts';

const COLORS = ['var(--chart-1)', 'var(--chart-2)', 'var(--chart-3)', 'var(--chart-4)', 'var(--chart-5)'];

import { Skeleton } from "@/components/ui/skeleton";


export default function AdminPage() {
    const [dateRange, setDateRange] = useState("30");
    const stats = useQuery(api.analytics.getDashboardStats);
    const analyticsData = useQuery(api.analytics.getAnalyticsData, { days: parseInt(dateRange) });

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 -mx-4 -mt-4 mb-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10 transition-all">
                <SidebarTrigger className="-ml-1" />
                <div className="flex flex-col flex-1">
                    <span className="font-semibold text-lg leading-tight">Dashboard</span>
                    <span className="text-xs text-muted-foreground hidden md:inline">Overview of your store's performance</span>
                </div>
            </header>

            {/* Top Stats Cards */}
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-lg border bg-card p-6 shadow-sm">
                    <div className="flex flex-row items-center justify-between space-y-0">
                        <h3 className="text-sm font-medium text-muted-foreground">Total Revenue</h3>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="text-2xl font-bold mt-2">
                        {stats ? formatCurrency(stats.totalRevenue) : <Skeleton className="h-8 w-32" />}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                        {stats ? "+20.1% from last month" : <Skeleton className="h-3 w-24 mt-1" />}
                    </div>
                </div>
                <div className="rounded-lg border bg-card p-6 shadow-sm">
                    <div className="flex flex-row items-center justify-between space-y-0">
                        <h3 className="text-sm font-medium text-muted-foreground">Orders</h3>
                        <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="text-2xl font-bold mt-2">
                        {stats ? `+${stats.totalOrders}` : <Skeleton className="h-8 w-20" />}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                        {stats ? "+19% from last month" : <Skeleton className="h-3 w-24 mt-1" />}
                    </div>
                </div>
                <div className="rounded-lg border bg-card p-6 shadow-sm">
                    <div className="flex flex-row items-center justify-between space-y-0">
                        <h3 className="text-sm font-medium text-muted-foreground">Customers</h3>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="text-2xl font-bold mt-2">
                        {stats ? `+${stats.totalCustomers}` : <Skeleton className="h-8 w-20" />}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                        {stats ? "+12% from last month" : <Skeleton className="h-3 w-24 mt-1" />}
                    </div>
                </div>
                <div className="rounded-lg border bg-card p-6 shadow-sm">
                    <div className="flex flex-row items-center justify-between space-y-0">
                        <h3 className="text-sm font-medium text-muted-foreground">Active Coupons</h3>
                        <Tag className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="text-2xl font-bold mt-2">
                        {stats ? stats.totalActiveCoupons : <Skeleton className="h-8 w-16" />}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                        {stats ? "Currently active" : <Skeleton className="h-3 w-20 mt-1" />}
                    </div>
                </div>
            </div>

            <Separator className="my-6" />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Charts</h2>
                    <p className="text-sm text-muted-foreground">Visualize your store's data trends</p>
                </div>
                <Select value={dateRange} onValueChange={setDateRange}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select period" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="7">Last 7 days</SelectItem>
                        <SelectItem value="30">Last 30 days</SelectItem>
                        <SelectItem value="90">Last 3 months</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-7">
                <Card className="col-span-1 md:col-span-5 shadow-sm">
                    <CardHeader>
                        <CardTitle>Revenue Over Time</CardTitle>
                        <CardDescription>Your total revenue for the selected period</CardDescription>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <div className="h-[350px] w-full">
                            {!analyticsData ? (
                                <Skeleton className="h-full w-full" />
                            ) : (analyticsData?.chartData || []).length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                        data={analyticsData?.chartData || []}
                                        margin={{
                                            top: 10,
                                            right: 30,
                                            left: 0,
                                            bottom: 0,
                                        }}
                                        barSize={60}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                                        <XAxis
                                            dataKey="date"
                                            tickLine={false}
                                            axisLine={false}
                                            tickMargin={10}
                                            tickFormatter={(value) => new Date(value).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
                                            style={{ fontSize: '12px', fill: 'var(--muted-foreground)' }}
                                        />
                                        <YAxis
                                            tickLine={false}
                                            axisLine={false}
                                            tickFormatter={(value) => `₹${value}`}
                                            style={{ fontSize: '12px', fill: 'var(--muted-foreground)' }}
                                        />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: 'var(--popover)',
                                                borderColor: 'var(--border)',
                                                borderRadius: 'var(--radius)',
                                                color: 'var(--popover-foreground)'
                                            }}
                                            itemStyle={{ color: 'var(--primary)' }}
                                            cursor={{ fill: 'var(--muted)', opacity: 0.1 }}
                                            formatter={(value: any) => [formatCurrency(value || 0), 'Revenue']}
                                            labelFormatter={(label) => new Date(label).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                        />
                                        <Bar
                                            dataKey="revenue"
                                            fill="var(--primary)"
                                            radius={[4, 4, 0, 0]}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="flex h-full items-center justify-center text-muted-foreground">
                                    No revenue data for this period
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card className="col-span-1 md:col-span-2 shadow-sm">
                    <CardHeader>
                        <CardTitle>Order Status Distribution</CardTitle>
                        <CardDescription>Overview of order statuses</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[350px] w-full">
                            {!analyticsData ? (
                                <Skeleton className="h-full w-full" />
                            ) : (analyticsData?.statusData || []).length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={analyticsData?.statusData || []}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {(analyticsData?.statusData || []).map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            contentStyle={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', borderRadius: 'var(--radius)' }}
                                        />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="flex h-full items-center justify-center text-muted-foreground">
                                    No order status data
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Bottom Details Section */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-7">
                <Card className="col-span-1 md:col-span-4 shadow-sm overflow-hidden">
                    <CardHeader>
                        <CardTitle>Recent Orders</CardTitle>
                        <CardDescription>Latest 5 orders from customers</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="pl-6">Order</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Amount</TableHead>
                                        <TableHead className="text-right pr-6">Date</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {!stats ? (
                                        Array(5).fill(0).map((_, i) => (
                                            <TableRow key={i}>
                                                <TableCell className="pl-6"><Skeleton className="h-4 w-16" /></TableCell>
                                                <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                                                <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                                                <TableCell className="pr-6"><Skeleton className="h-4 w-24 ml-auto" /></TableCell>
                                            </TableRow>
                                        ))
                                    ) : (stats.recentOrders || []).length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={4} className="text-center text-muted-foreground py-6">
                                                No recent orders found.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        (stats.recentOrders || []).map((order) => (
                                            <TableRow key={order._id}>
                                                <TableCell className="font-medium pl-6">{order.orderNumber}</TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant={order.status === "completed" ? "default" : "secondary"}
                                                        className={
                                                            order.status === "pending" ? "bg-amber-500 hover:bg-amber-600 text-white" :
                                                                order.status === "cancelled" ? "bg-red-500 hover:bg-red-600 text-white" : ""
                                                        }
                                                    >
                                                        {order.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>{formatCurrency(order.amount)}</TableCell>
                                                <TableCell className="text-right text-muted-foreground pr-6">
                                                    {new Date(order.createdAt).toLocaleDateString()}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>

                <Card className="col-span-1 md:col-span-3 shadow-sm">
                    <CardHeader>
                        <CardTitle>Top Products</CardTitle>
                        <CardDescription>Best selling items this period</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {!stats ? (
                                Array(3).fill(0).map((_, i) => (
                                    <div key={i} className="flex items-center">
                                        <Skeleton className="h-9 w-9 rounded mr-3" />
                                        <div className="space-y-2 flex-1">
                                            <Skeleton className="h-4 w-3/4" />
                                            <Skeleton className="h-3 w-1/2" />
                                        </div>
                                        <Skeleton className="h-4 w-12" />
                                    </div>
                                ))
                            ) : (stats.topProducts || []).length === 0 ? (
                                <p className="text-sm text-muted-foreground text-center py-4">No data available.</p>
                            ) : (
                                (stats.topProducts || []).map((product, i) => (
                                    <div key={i} className="flex items-center">
                                        <div className="h-9 w-9 rounded bg-primary/10 flex items-center justify-center mr-3">
                                            <Package className="h-4 w-4 text-primary" />
                                        </div>
                                        <div className="space-y-1 flex-1">
                                            <p className="text-sm font-medium leading-none truncate">{product.name}</p>
                                            <p className="text-xs text-muted-foreground">{product.sales} sold</p>
                                        </div>
                                        <div className="font-medium text-sm">
                                            {formatCurrency(product.revenue)}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
