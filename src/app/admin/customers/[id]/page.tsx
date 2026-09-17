import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, Mail, Phone } from "lucide-react";
import { OrderStatusBadge } from "@/components/admin/status-badge";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";

interface PageProps {
    params: Promise<{ id: string }>;
}

export const metadata = { title: "Customer" };

export default async function AdminCustomerDetailPage({ params }: PageProps) {
    const { id } = await params;

    const user = await prisma.user.findUnique({
        where: { id },
        include: {
            orders: {
                orderBy: { createdAt: "desc" },
                include: { _count: { select: { items: true } } },
            },
            addresses: { orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }] },
            _count: {
                select: { orders: true, reviews: true },
            },
        },
    });

    if (!user) notFound();

    const totalSpent = user.orders
        .filter((o) => o.orderStatus !== "CANCELLED")
        .reduce((s, o) => s + Number(o.total), 0);

    return (
        <div className="flex flex-col gap-8">
            <Link
                href="/admin/customers"
                className="text-eyebrow inline-flex items-center gap-2 text-muted-foreground hover:text-foreground"
            >
                <ArrowLeft size={14} strokeWidth={1.5} />
                All customers
            </Link>

            <div className="flex items-end justify-between gap-4">
                <div>
                    <p className="text-eyebrow text-muted-foreground">Customer</p>
                    <h1 className="text-display mt-2 text-3xl">
                        {user.name ?? "Unnamed"}
                    </h1>
                    <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-2">
                            <Mail size={11} strokeWidth={1.5} />
                            {user.email}
                        </span>
                        {user.phone && (
                            <span className="flex items-center gap-2">
                                <Phone size={11} strokeWidth={1.5} />
                                {user.phone}
                            </span>
                        )}
                        <span>
                            Joined{" "}
                            {new Date(user.createdAt).toLocaleDateString("en-US", {
                                month: "long",
                                day: "numeric",
                                year: "numeric",
                            })}
                        </span>
                    </div>
                </div>
                <span className="text-eyebrow">{user.role}</span>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
                <div className="border border-border p-5">
                    <p className="text-eyebrow text-muted-foreground">Orders</p>
                    <p className="text-display mt-2 text-3xl">{user._count.orders}</p>
                </div>
                <div className="border border-border p-5">
                    <p className="text-eyebrow text-muted-foreground">Total spent</p>
                    <p className="text-display mt-2 text-3xl">
                        {formatPrice(totalSpent)}
                    </p>
                </div>
                <div className="border border-border p-5">
                    <p className="text-eyebrow text-muted-foreground">Reviews</p>
                    <p className="text-display mt-2 text-3xl">{user._count.reviews}</p>
                </div>
            </div>

            <section>
                <h2 className="text-eyebrow mb-4">Orders</h2>
                {user.orders.length === 0 ? (
                    <div className="border border-border p-8 text-center text-sm text-muted-foreground">
                        No orders yet.
                    </div>
                ) : (
                    <ul className="divide-y divide-border border-y border-border">
                        {user.orders.map((o) => (
                            <li key={o.id}>
                                <Link
                                    href={`/admin/orders/${o.orderNumber}`}
                                    className="flex items-center justify-between gap-4 py-4 hover:bg-muted/30"
                                >
                                    <div className="min-w-0">
                                        <p className="font-mono text-xs">{o.orderNumber}</p>
                                        <p className="mt-0.5 text-xs text-muted-foreground">
                                            {o._count.items} item{o._count.items === 1 ? "" : "s"} ·{" "}
                                            {new Date(o.createdAt).toLocaleDateString("en-US", {
                                                month: "short",
                                                day: "numeric",
                                                year: "numeric",
                                            })}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="text-xs">{formatPrice(Number(o.total))}</span>
                                        <OrderStatusBadge status={o.orderStatus} />
                                    </div>
                                </Link>
                            </li>
                        ))}
                    </ul>
                )}
            </section>

            {user.addresses.length > 0 && (
                <section>
                    <h2 className="text-eyebrow mb-4">Saved addresses</h2>
                    <div className="grid gap-3 md:grid-cols-2">
                        {user.addresses.map((a) => (
                            <div key={a.id} className="border border-border p-5">
                                {a.label && <p className="text-eyebrow">{a.label}</p>}
                                <address className="mt-2 not-italic text-xs leading-relaxed text-muted-foreground">
                                    {a.fullName}
                                    <br />
                                    {a.line1}
                                    {a.line2 ? (
                                        <>
                                            <br />
                                            {a.line2}
                                        </>
                                    ) : null}
                                    <br />
                                    {a.city}, {a.state} {a.postalCode}
                                    <br />
                                    {a.country}
                                </address>
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}