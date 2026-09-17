import Link from "next/link";
import { StatCard } from "@/components/admin/stat-card";
import { OrderStatusBadge } from "@/components/admin/status-badge";
import { RevenueChart } from "@/components/admin/charts/revenue-chart";
import { getDashboardStats } from "@/lib/admin/stats";
import { formatPrice } from "@/lib/utils";

export const metadata = { title: "Dashboard" };

export default async function AdminDashboardPage() {
    const stats = await getDashboardStats();

    return (
        <div className="flex flex-col gap-8">
            <div>
                <p className="text-eyebrow text-muted-foreground">Overview</p>
                <h1 className="text-display mt-2 text-3xl md:text-4xl">Dashboard</h1>
            </div>

            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    label="Total revenue"
                    value={formatPrice(stats.revenue)}
                    hint={`${stats.orderCount} orders`}
                    accent
                />
                <StatCard label="Orders" value={String(stats.orderCount)} />
                <StatCard label="Customers" value={String(stats.customerCount)} />
                <StatCard
                    label="Products"
                    value={String(stats.productCount)}
                    hint={`${stats.totalStock} units in stock`}
                />
            </div>

            {/* Chart */}
            <section className="border border-border p-5">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-eyebrow">Revenue — last 30 days</h2>
                    <p className="text-xs text-muted-foreground">
                        {formatPrice(
                            stats.revenueSeries.reduce((s, d) => s + d.revenue, 0)
                        )}{" "}
                        in period
                    </p>
                </div>
                <RevenueChart data={stats.revenueSeries} />
            </section>

            <div className="grid gap-6 lg:grid-cols-2">
                {/* Recent orders */}
                <section className="border border-border">
                    <div className="flex items-center justify-between border-b border-border px-5 py-4">
                        <h2 className="text-eyebrow">Recent orders</h2>
                        <Link
                            href="/admin/orders"
                            className="text-xs text-muted-foreground hover:text-foreground"
                        >
                            View all →
                        </Link>
                    </div>
                    {stats.recentOrders.length === 0 ? (
                        <p className="p-5 text-sm text-muted-foreground">No orders yet.</p>
                    ) : (
                        <ul className="divide-y divide-border">
                            {stats.recentOrders.map((o) => (
                                <li key={o.id}>
                                    <Link
                                        href={`/admin/orders/${o.orderNumber}`}
                                        className="flex items-center justify-between gap-3 px-5 py-3 hover:bg-muted/30"
                                    >
                                        <div className="min-w-0">
                                            <p className="truncate font-mono text-xs">
                                                {o.orderNumber}
                                            </p>
                                            <p className="mt-0.5 truncate text-xs text-muted-foreground">
                                                {o.customerName}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="text-xs">{formatPrice(o.total)}</span>
                                            <OrderStatusBadge status={o.orderStatus} />
                                        </div>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </section>

                {/* Low stock */}
                <section className="border border-border">
                    <div className="flex items-center justify-between border-b border-border px-5 py-4">
                        <h2 className="text-eyebrow">Low stock</h2>
                        <Link
                            href="/admin/products"
                            className="text-xs text-muted-foreground hover:text-foreground"
                        >
                            Manage →
                        </Link>
                    </div>
                    {stats.lowStock.length === 0 ? (
                        <p className="p-5 text-sm text-muted-foreground">
                            All products are healthy.
                        </p>
                    ) : (
                        <ul className="divide-y divide-border">
                            {stats.lowStock.map((v) => (
                                <li
                                    key={v.id}
                                    className="flex items-center justify-between gap-3 px-5 py-3"
                                >
                                    <div className="min-w-0">
                                        <p className="truncate text-xs font-medium">
                                            {v.productName}
                                        </p>
                                        <p className="mt-0.5 text-xs text-muted-foreground">
                                            {v.color} · {v.size}
                                        </p>
                                    </div>
                                    <span
                                        className={
                                            v.stock === 0
                                                ? "text-xs text-sale"
                                                : "text-xs text-accent"
                                        }
                                    >
                                        {v.stock === 0 ? "Sold out" : `${v.stock} left`}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    )}
                </section>
            </div>

            {/* Recent customers */}
            <section className="border border-border">
                <div className="flex items-center justify-between border-b border-border px-5 py-4">
                    <h2 className="text-eyebrow">Recent customers</h2>
                    <Link
                        href="/admin/customers"
                        className="text-xs text-muted-foreground hover:text-foreground"
                    >
                        View all →
                    </Link>
                </div>
                <ul className="divide-y divide-border">
                    {stats.recentCustomers.map((c) => (
                        <li
                            key={c.id}
                            className="flex items-center justify-between gap-3 px-5 py-3"
                        >
                            <div className="min-w-0">
                                <p className="truncate text-xs font-medium">
                                    {c.name ?? "—"}
                                </p>
                                <p className="mt-0.5 truncate text-xs text-muted-foreground">
                                    {c.email}
                                </p>
                            </div>
                            <span className="text-xs text-muted-foreground">
                                {new Date(c.createdAt).toLocaleDateString()}
                            </span>
                        </li>
                    ))}
                </ul>
            </section>
        </div>
    );
}