export default function AdminPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground">
                    Welcome to your admin dashboard.
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-lg border bg-card p-6 shadow-sm">
                    <h3 className="text-sm font-medium text-muted-foreground">Total Revenue</h3>
                    <p className="text-2xl font-bold">$45,231.89</p>
                    <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                </div>
                <div className="rounded-lg border bg-card p-6 shadow-sm">
                    <h3 className="text-sm font-medium text-muted-foreground">Subscriptions</h3>
                    <p className="text-2xl font-bold">+2350</p>
                    <p className="text-xs text-muted-foreground">+180.1% from last month</p>
                </div>
                <div className="rounded-lg border bg-card p-6 shadow-sm">
                    <h3 className="text-sm font-medium text-muted-foreground">Sales</h3>
                    <p className="text-2xl font-bold">+12,234</p>
                    <p className="text-xs text-muted-foreground">+19% from last month</p>
                </div>
                <div className="rounded-lg border bg-card p-6 shadow-sm">
                    <h3 className="text-sm font-medium text-muted-foreground">Active Now</h3>
                    <p className="text-2xl font-bold">+573</p>
                    <p className="text-xs text-muted-foreground">+201 since last hour</p>
                </div>
            </div>
        </div>
    )
}
