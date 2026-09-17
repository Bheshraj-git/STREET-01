import Link from "next/link";
import { Container } from "@/components/ui/container";
import { DataTable, type Column } from "@/components/admin/data-table";
import {
    OrderStatusBadge,
    PaymentStatusBadge,
} from "@/components/admin/status-badge";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";

export const metadata = { title: "Orders" };

const ORDER_STATUSES = [
    "ALL",
    "PENDING",
    "CONFIRMED",
    "PROCESSING",
    "SHIPPED",
    "DELIVERED",
    "CANCELLED",
] as const;

interface PageProps {
    searchParams: Promise<{
        status?: string;
        q?: string;
    }>;
}

interface Row {
    id: string;
    orderNumber: string;
    customerName: string;
    email: string;
    total: number;
    orderStatus: string;
    paymentStatus: string;
    createdAt: string;
    itemCount: number;
}

export default async function AdminOrdersPage({ searchParams }: PageProps) {
    const { status = "ALL", q = "" } = await searchParams;

    const where: Record<string, unknown> = {};

    if (status !== "ALL") {
        where.orderStatus = status;
    }

    if (q.trim()) {
        where.OR = [
            { orderNumber: { contains: q, mode: "insensitive" } },
            { email: { contains: q, mode: "insensitive" } },
            { customerName: { contains: q, mode: "insensitive" } },
        ];
    }

    const orders = await prisma.order.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take: 100,
        include: { _count: { select: { items: true } } },
    });

    const rows: Row[] = orders.map((o) => ({
        id: o.id,
        orderNumber: o.orderNumber,
        customerName: o.customerName,
        email: o.email,
        total: Number(o.total),
        orderStatus: o.orderStatus,
        paymentStatus: o.paymentStatus,
        createdAt: o.createdAt.toISOString(),
        itemCount: o._count.items,
    }));

    const columns: Column<Row>[] = [
        {
            key: "orderNumber",
            header: "Order",
            render: (r) => (
                <Link
                    href={`/admin/orders/${r.orderNumber}`}
                    className="font-mono text-xs hover:text-accent"
                >
                    {r.orderNumber}
                </Link>
            ),
        },
        {
            key: "customer",
            header: "Customer",
            render: (r) => (
                <div>
                    <p className="text-xs font-medium">{r.customerName}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{r.email}</p>
                </div>
            ),
        },
        {
            key: "items",
            header: "Items",
            render: (r) => <span className="text-xs">{r.itemCount}</span>,
        },
        {
            key: "total",
            header: "Total",
            align: "right",
            render: (r) => (
                <span className="text-xs font-medium">{formatPrice(r.total)}</span>
            ),
        },
        {
            key: "payment",
            header: "Payment",
            render: (r) => <PaymentStatusBadge status={r.paymentStatus} />,
        },
        {
            key: "status",
            header: "Status",
            render: (r) => <OrderStatusBadge status={r.orderStatus} />,
        },
        {
            key: "date",
            header: "Date",
            align: "right",
            render: (r) => (
                <span className="text-xs text-muted-foreground">
                    {new Date(r.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                    })}
                </span>
            ),
        },
    ];

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-end justify-between gap-4">
                <div>
                    <p className="text-eyebrow text-muted-foreground">Manage</p>
                    <h1 className="text-display mt-2 text-3xl">Orders</h1>
                </div>
                <p className="text-xs text-muted-foreground">
                    {rows.length} {rows.length === 1 ? "order" : "orders"}
                </p>
            </div>

            {/* Filters */}
            <form className="flex flex-wrap items-end gap-3">
                <div className="flex-1 min-w-[200px]">
                    <label className="text-eyebrow mb-2 block text-muted-foreground">
                        Search
                    </label>
                    <input
                        name="q"
                        defaultValue={q}
                        placeholder="Order #, email, or name"
                        className="h-10 w-full border border-border bg-background px-3 text-sm outline-none focus:border-foreground"
                    />
                </div>

                <div>
                    <label className="text-eyebrow mb-2 block text-muted-foreground">
                        Status
                    </label>
                    <select
                        name="status"
                        defaultValue={status}
                        className="h-10 border border-border bg-background px-3 text-xs uppercase tracking-wider outline-none focus:border-foreground"
                    >
                        {ORDER_STATUSES.map((s) => (
                            <option key={s} value={s}>
                                {s}
                            </option>
                        ))}
                    </select>
                </div>

                <button
                    type="submit"
                    className="h-10 border border-foreground bg-foreground px-5 text-xs uppercase tracking-wider text-background transition-opacity hover:opacity-90"
                >
                    Apply
                </button>
            </form>

            <DataTable columns={columns} rows={rows} empty="No orders match your filters." />
        </div>
    );
}