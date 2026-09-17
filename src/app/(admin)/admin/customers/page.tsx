import Link from "next/link";
import { DataTable, type Column } from "@/components/admin/data-table";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";

export const metadata = { title: "Customers" };

interface PageProps {
    searchParams: Promise<{ q?: string }>;
}

interface Row {
    id: string;
    name: string | null;
    email: string;
    role: string;
    orderCount: number;
    totalSpent: number;
    joinedAt: string;
}

export default async function AdminCustomersPage({ searchParams }: PageProps) {
    const { q = "" } = await searchParams;

    const where: Record<string, unknown> = { role: "CUSTOMER" };

    if (q.trim()) {
        where.OR = [
            { email: { contains: q, mode: "insensitive" } },
            { name: { contains: q, mode: "insensitive" } },
        ];
    }

    const users = await prisma.user.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take: 100,
        include: {
            orders: {
                where: { orderStatus: { not: "CANCELLED" } },
                select: { total: true },
            },
        },
    });

    const rows: Row[] = users.map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        orderCount: u.orders.length,
        totalSpent: u.orders.reduce((s, o) => s + Number(o.total), 0),
        joinedAt: u.createdAt.toISOString(),
    }));

    const columns: Column<Row>[] = [
        {
            key: "customer",
            header: "Customer",
            render: (r) => (
                <Link
                    href={`/admin/customers/${r.id}`}
                    className="block hover:text-accent"
                >
                    <p className="text-xs font-medium">{r.name ?? "—"}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{r.email}</p>
                </Link>
            ),
        },
        {
            key: "orders",
            header: "Orders",
            align: "right",
            render: (r) => <span className="text-xs">{r.orderCount}</span>,
        },
        {
            key: "spent",
            header: "Total spent",
            align: "right",
            render: (r) => (
                <span className="text-xs font-medium">{formatPrice(r.totalSpent)}</span>
            ),
        },
        {
            key: "joined",
            header: "Joined",
            align: "right",
            render: (r) => (
                <span className="text-xs text-muted-foreground">
                    {new Date(r.joinedAt).toLocaleDateString("en-US", {
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
                    <h1 className="text-display mt-2 text-3xl">Customers</h1>
                </div>
                <p className="text-xs text-muted-foreground">
                    {rows.length} {rows.length === 1 ? "customer" : "customers"}
                </p>
            </div>

            <form className="flex flex-wrap items-end gap-3">
                <div className="min-w-[200px] flex-1">
                    <label className="text-eyebrow mb-2 block text-muted-foreground">
                        Search
                    </label>
                    <input
                        name="q"
                        defaultValue={q}
                        placeholder="Name or email"
                        className="h-10 w-full border border-border bg-background px-3 text-sm outline-none focus:border-foreground"
                    />
                </div>
                <button
                    type="submit"
                    className="h-10 border border-foreground bg-foreground px-5 text-xs uppercase tracking-wider text-background transition-opacity hover:opacity-90"
                >
                    Apply
                </button>
            </form>

            <DataTable
                columns={columns}
                rows={rows}
                empty="No customers match your search."
            />
        </div>
    );
}