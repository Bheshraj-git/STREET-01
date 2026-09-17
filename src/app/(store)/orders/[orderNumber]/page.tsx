import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { OrderTimeline } from "@/components/checkout/order-timeline";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";

export const metadata = {
    title: "Order confirmed",
    robots: { index: false, follow: false },
};

interface PageProps {
    params: Promise<{ orderNumber: string }>;
}

interface ShippingAddressShape {
    fullName: string;
    line1: string;
    line2?: string | null;
    city: string;
    state: string;
    postalCode: string;
    country: string;
}

export default async function OrderConfirmationPage({ params }: PageProps) {
    const { orderNumber } = await params;

    const order = await prisma.order.findUnique({
        where: { orderNumber },
        include: {
            items: {
                orderBy: { id: "asc" },
            },
        },
    });

    if (!order) notFound();

    const address = order.shippingAddress as unknown as ShippingAddressShape;
    const subtotal = Number(order.subtotal);
    const discount = Number(order.discount);
    const shipping = Number(order.shippingCost);
    const tax = Number(order.tax);
    const total = Number(order.total);

    return (
        <Container className="py-12 md:py-20">
            <div className="mb-10 flex items-start gap-4">
                <CheckCircle2
                    size={40}
                    strokeWidth={1.5}
                    className="text-success flex-shrink-0"
                />
                <div>
                    <p className="text-eyebrow text-muted-foreground">Thank you</p>
                    <h1 className="text-display mt-2 text-4xl md:text-6xl">
                        Order confirmed.
                    </h1>
                    <p className="mt-3 text-sm text-muted-foreground">
                        A confirmation has been sent to{" "}
                        <span className="text-foreground">{order.email}</span>.
                    </p>
                </div>
            </div>

            {/* Order number block */}
            <div className="grid gap-6 border-y border-border py-6 md:grid-cols-3">
                <div>
                    <p className="text-eyebrow text-muted-foreground">Order number</p>
                    <p className="mt-2 font-mono text-sm">{order.orderNumber}</p>
                </div>
                <div>
                    <p className="text-eyebrow text-muted-foreground">Placed</p>
                    <p className="mt-2 text-sm">
                        {new Date(order.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        })}
                    </p>
                </div>
                <div>
                    <p className="text-eyebrow text-muted-foreground">Total</p>
                    <p className="mt-2 text-sm font-medium">{formatPrice(total)}</p>
                </div>
            </div>

            {/* Timeline */}
            <div className="mt-10">
                <p className="text-eyebrow mb-6 text-muted-foreground">Status</p>
                <OrderTimeline status={order.orderStatus} />
            </div>

            {/* Items + address + totals */}
            <div className="mt-16 grid gap-12 lg:grid-cols-[1fr_360px]">
                <div>
                    <h2 className="text-eyebrow mb-6">Items</h2>
                    <ul className="divide-y divide-border border-y border-border">
                        {order.items.map((item) => (
                            <li key={item.id} className="flex gap-4 py-5">
                                <div className="relative h-24 w-20 flex-shrink-0 overflow-hidden bg-muted">
                                    {item.image && (
                                        <Image
                                            src={item.image}
                                            alt={item.productName}
                                            fill
                                            sizes="80px"
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

                    <div className="mt-10 grid gap-8 md:grid-cols-2">
                        <div>
                            <h2 className="text-eyebrow mb-3">Shipping to</h2>
                            <address className="not-italic text-sm leading-relaxed text-muted-foreground">
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
                        </div>

                        <div>
                            <h2 className="text-eyebrow mb-3">Payment</h2>
                            <p className="text-sm text-muted-foreground">
                                Paid via card
                                <br />
                                Status:{" "}
                                <span className="text-success">{order.paymentStatus}</span>
                            </p>
                        </div>
                    </div>
                </div>

                <aside className="lg:sticky lg:top-24 lg:h-fit">
                    <div className="border border-border p-6">
                        <h2 className="text-eyebrow mb-6">Summary</h2>

                        <dl className="flex flex-col gap-3 text-sm">
                            <div className="flex justify-between">
                                <dt className="text-muted-foreground">Subtotal</dt>
                                <dd>{formatPrice(subtotal)}</dd>
                            </div>

                            {discount > 0 && (
                                <div className="flex justify-between text-success">
                                    <dt>Discount {order.couponCode ? `(${order.couponCode})` : ""}</dt>
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

                        <div className="hairline my-5" />

                        <div className="flex items-end justify-between">
                            <span className="text-eyebrow">Total</span>
                            <span className="text-display text-2xl">
                                {formatPrice(total)}
                            </span>
                        </div>
                    </div>

                    <Link href="/shop" className="mt-6 block">
                        <Button variant="outline" size="lg" className="w-full">
                            Continue shopping
                        </Button>
                    </Link>
                </aside>
            </div>
        </Container>
    );
}