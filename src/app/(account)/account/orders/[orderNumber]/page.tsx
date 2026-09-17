import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { OrderTimeline } from "@/components/checkout/order-timeline";
import { requireUser } from "@/lib/auth/session";
import { getUserOrder } from "@/lib/queries/account";
import { formatPrice } from "@/lib/utils";

interface PageProps {
    params: Promise<{ orderNumber: string }>;
}

export default async function OrderDetailPage({ params }: PageProps) {
    const { orderNumber } = await params;
    const user = await requireUser();
    const order = await getUserOrder(user.id, orderNumber);

    if (!order) notFound();

    const addr = order.shippingAddress;

    return (
        <div>
            <Link
                href="/account/orders"
                className="text-eyebrow inline-flex items-center gap-2 text-muted-foreground hover:text-foreground"
            >
                <ArrowLeft size={14} strokeWidth={1.5} />
                All orders
            </Link>

            <div className="mt-8 flex items-end justify-between">
                <div>
                    <p className="text-eyebrow text-muted-foreground">Order</p>
                    <h2 className="text-display mt-2 font-mono text-2xl md:text-3xl">
                        {order.orderNumber}
                    </h2>
                </div>
                <p className="text-sm text-muted-foreground">
                    {new Date(order.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                    })}
                </p>
            </div>

            <div className="mt-10">
                <OrderTimeline status={order.orderStatus as never} />
            </div>

            <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_320px]">
                <div>
                    <h3 className="text-eyebrow mb-4">Items</h3>
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
                                            {formatPrice(item.total)}
                                        </span>
                                    </div>
                                    <p className="mt-1 text-xs text-muted-foreground">
                                        {item.color} · {item.size}
                                    </p>
                                    <p className="mt-1 text-xs text-muted-foreground">
                                        Qty {item.quantity} × {formatPrice(item.unitPrice)}
                                    </p>
                                </div>
                            </li>
                        ))}
                    </ul>

                    <div className="mt-8 grid gap-6 sm:grid-cols-2">
                        <div>
                            <h3 className="text-eyebrow mb-3">Shipping to</h3>
                            <address className="not-italic text-sm leading-relaxed text-muted-foreground">
                                {addr.fullName}
                                <br />
                                {addr.line1}
                                {addr.line2 ? (
                                    <>
                                        <br />
                                        {addr.line2}
                                    </>
                                ) : null}
                                <br />
                                {addr.city}, {addr.state} {addr.postalCode}
                                <br />
                                {addr.country}
                            </address>
                        </div>
                        <div>
                            <h3 className="text-eyebrow mb-3">Payment</h3>
                            <p className="text-sm text-muted-foreground">
                                Status:{" "}
                                <span className="text-success">{order.paymentStatus}</span>
                            </p>
                        </div>
                    </div>
                </div>

                <aside>
                    <div className="border border-border p-5">
                        <h3 className="text-eyebrow mb-4">Summary</h3>
                        <dl className="flex flex-col gap-3 text-sm">
                            <div className="flex justify-between">
                                <dt className="text-muted-foreground">Subtotal</dt>
                                <dd>{formatPrice(order.subtotal)}</dd>
                            </div>
                            {order.discount > 0 && (
                                <div className="flex justify-between text-success">
                                    <dt>
                                        Discount
                                        {order.couponCode ? ` (${order.couponCode})` : ""}
                                    </dt>
                                    <dd>− {formatPrice(order.discount)}</dd>
                                </div>
                            )}
                            <div className="flex justify-between">
                                <dt className="text-muted-foreground">Shipping</dt>
                                <dd>
                                    {order.shippingCost === 0
                                        ? "Free"
                                        : formatPrice(order.shippingCost)}
                                </dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-muted-foreground">Tax</dt>
                                <dd>{formatPrice(order.tax)}</dd>
                            </div>
                        </dl>
                        <div className="hairline my-4" />
                        <div className="flex items-end justify-between">
                            <span className="text-eyebrow">Total</span>
                            <span className="text-display text-lg">
                                {formatPrice(order.total)}
                            </span>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}