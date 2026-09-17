"use client";

import Image from "next/image";
import { useCartStore } from "@/lib/stores/cart-store";
import { formatPrice } from "@/lib/utils";
import type { AppliedCoupon } from "./coupon-input";

const FREE_SHIPPING_THRESHOLD = 5000;
const STANDARD_SHIPPING = 200;

export function OrderSummary({
    applied,
}: {
    applied: AppliedCoupon | null;
}) {
    const items = useCartStore((s) => s.items);
    const subtotal = useCartStore((s) => s.subtotal());

    const discount = applied?.discount ?? 0;
    const postDiscount = Math.max(0, subtotal - discount);
    const shipping =
        postDiscount >= FREE_SHIPPING_THRESHOLD || postDiscount === 0
            ? 0
            : STANDARD_SHIPPING;
    const tax = 0;
    const total = postDiscount + shipping + tax;

    return (
        <div className="border border-border">
            <div className="border-b border-border px-6 py-4">
                <h2 className="text-eyebrow">Order summary</h2>
            </div>

            <div className="max-h-80 overflow-y-auto px-6 py-4">
                {items.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Your bag is empty.</p>
                ) : (
                    <ul className="flex flex-col gap-4">
                        {items.map((item) => (
                            <li key={item.variantId} className="flex gap-3">
                                <div className="relative h-16 w-14 flex-shrink-0 overflow-hidden bg-muted">
                                    {item.image && (
                                        <Image
                                            src={item.image}
                                            alt={item.productName}
                                            fill
                                            sizes="56px"
                                            className="object-cover"
                                        />
                                    )}
                                    <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center bg-foreground text-[10px] font-medium text-background">
                                        {item.quantity}
                                    </span>
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-xs font-medium">
                                        {item.productName}
                                    </p>
                                    <p className="mt-0.5 text-[10px] text-muted-foreground">
                                        {item.color} · {item.size}
                                    </p>
                                    <p className="mt-1 text-xs">
                                        {formatPrice(item.unitPrice * item.quantity)}
                                    </p>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <div className="border-t border-border px-6 py-4">
                <dl className="flex flex-col gap-2 text-sm">
                    <div className="flex justify-between">
                        <dt className="text-muted-foreground">Subtotal</dt>
                        <dd>{formatPrice(subtotal)}</dd>
                    </div>

                    {discount > 0 && (
                        <div className="flex justify-between text-success">
                            <dt>Discount</dt>
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
                    <span className="text-display text-xl">{formatPrice(total)}</span>
                </div>
            </div>
        </div>
    );
}