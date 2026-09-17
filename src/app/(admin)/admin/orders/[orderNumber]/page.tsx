import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Mail, Phone } from "lucide-react";
import { OrderTimeline } from "@/components/checkout/order-timeline";
import {
    OrderStatusSelect,
    PaymentStatusSelect,
} from "@/components/admin/order-status-select";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";

interface PageProps {
    params: Promise<{ orderNumber: string }>;
}

export async function generateMetadata({ params }: PageProps) {
    const { orderNumber } = await params;
    return { title: orderNumber };
}

interface ShippingAddress {
    fullName: string;
    line1: string;
    line2?: string | null;
    city: string;
    state: string;
    postalCode: string;
    country: string;
}

export default async function AdminOrderDetailPage({ params }: PageProps) {
    const { orderNumber } = await params;

    const order = await prisma.order.findUnique({
        where: { orderNumber },
        include: {
            items: { orderBy: { id: "asc" } },
            user: { select: { id: true, email: true, name: true } },
        },
    });

    if (!order) notFound();

    const address = order.shippingAddress as unknown as ShippingAddress;
    const subtotal = Number(order.subtotal);
    const discount = Number(order.discount);
    const shipping = Number(order.shippingCost);
    const tax = Number(order.tax);
    const total = Number(order.total);

    return (
        <div className="flex flex-col gap-8">
            <Link
                href="/admin/orders"
                className="text-eyebrow inline-flex items-center gap-2 text-muted-foreground hover:text-foreground"
            >
                <ArrowLeft size={14} strokeWidth={1.5} />
                All orders
            </Link>

            <div className="flex flex-wrap items-start justify-between gap-6">
                <div>
                    <p className="text-eyebrow text-muted-foreground">Order</p>
                    <h1 className="text-display mt-2 font-mono text-2xl md:text-3xl">
                        {order.orderNumber}
                    </h1>
                    <p className="mt-2 text-xs text-muted-foreground">
                        Placed{" "}
                        {new Date(order.createdAt).toLocaleString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                        })}
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <div>
                        <p className="text-eyebrow mb-2 text-muted-foreground">Order status</p>
                        <OrderStatusSelect orderId={order.id} current={order.orderStatus} />
                    </div>
                    <div>
                        <p className="text-eyebrow mb-2 text-muted-foreground">Payment</p>
                        <PaymentStatusSelect
                            orderId={order.id}
                            current={order.paymentStatus}
                        />
                    </div>
                </div>
            </div>

            <div className="border border-border p-6">
                <p className="text-eyebrow mb-4 text-muted-foreground">Timeline</p>
                <OrderTimeline status={order.orderStatus as never} />
            </div>

            <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
                {/* Left: items + customer info */}
                <div className="flex flex-col gap-8">
                    <section>
                        <h2 className="text-eyebrow mb-4">Items</h2>
                        <ul className="divide-y divide-border border-y border-border">
                            {order.items.map((item) => (
                                <li key={item.id} className="flex gap-4 py-4">
                                    <div className="relative h-20 w-16 flex-shrink-0 overflow-hidden bg-muted">
                                        {item.image && (
                                            <Image
                                                src={item.image}
                                                alt={item.productName}
                                                fill
                                                sizes="64px"
                                                className="object-cover"
                                            />
                                        )}
                                    </div>
                                    <div className="flex min-w-0 flex-1 flex-col">
                                        <div className="flex items-start justify-between gap-3">
                                            <p className="text-sm font-medium">{item.productName}</p>
                                            <span className="text-sm">
                                                {formatPrice(Number(item.total))}
                                            </span>
                                        </div>
                                        <p className="mt-1 text-xs text-muted-foreground">
                                            {item.color} · {item.size}
                                        </p>
                                        <p className="mt-1 text-xs text-muted-foreground">
                                            Qty {item.quantity} × {formatPrice(Number(item.unitPrice))}
                                        </p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </section>

                    <div className="grid gap-6 md:grid-cols-2">
                        <section>
                            <h2 className="text-eyebrow mb-3">Customer</h2>
                            <p className="text-sm">{order.customerName}</p>
                            <p className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                                <Mail size={11} strokeWidth={1.5} />
                                {order.email}
                            </p>
                            {order.phone && (
                                <p className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                                    <Phone size={11} strokeWidth={1.5} />
                                    {order.phone}
                                </p>
                            )}
                            {order.user && (
                                <p className="mt-3 text-xs">
                                    <Link
                                        href={`/admin/customers/${order.user.id}`}
                                        className="text-muted-foreground hover:text-foreground underline underline-offset-4"
                                    >
                                        View customer profile →
                                    </Link>
                                </p>
                            )}
                        </section>

                        <section>
                            <h2 className="text-eyebrow mb-3">Shipping address</h2>
                            <address className="not-italic text-xs leading-relaxed text-muted-foreground">
                                {address.fullName}
                                <br />
                                {address.line1}
                                {address.line2 ? (
                                    <>
                                        <br />
                                        {address.line2}
                                    </>
                                ) : null}
                                <br />
                                {address.city}, {address.state} {address.postalCode}
                                <br />
                                {address.country}
                            </address>
                        </section>
                    </div>
                </div>

                {/* Right: summary */}
                <aside>
                    <div className="border border-border p-5">
                        <h2 className="text-eyebrow mb-4">Summary</h2>
                        <dl className="flex flex-col gap-3 text-sm">
                            <div className="flex justify-between">
                                <dt className="text-muted-foreground">Subtotal</dt>
                                <dd>{formatPrice(subtotal)}</dd>
                            </div>
                            {discount > 0 && (
                                <div className="flex justify-between text-success">
                                    <dt>
                                        Discount
                                        {order.couponCode ? ` (${order.couponCode})` : ""}
                                    </dt>
                                    <dd>− {formatPrice(discount)}</dd>
                                </div>
                            )}
                            <div className="flex justify-between">
                                <dt className="text-muted-foreground">Shipping</dt>
                                <dd>{shipping === 0 ? "Free" : formatPrice(shipping)}</dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-muted-foreground">Tax</dt>
                                <dd>{formatPrice(tax)}</dd>
                            </div>
                        </dl>
                        <div className="hairline my-4" />
                        <div className="flex items-end justify-between">
                            <span className="text-eyebrow">Total</span>
                            <span className="text-display text-lg">
                                {formatPrice(total)}
                            </span>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}