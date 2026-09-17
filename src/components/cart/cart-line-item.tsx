"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, X } from "lucide-react";
import { useCartStore, type CartItem } from "@/lib/stores/cart-store";
import { formatPrice } from "@/lib/utils";
import { notify } from "@/lib/toast";

export function CartLineItem({ item }: { item: CartItem }) {
    const remove = useCartStore((s) => s.remove);
    const updateQuantity = useCartStore((s) => s.updateQuantity);

    const lineTotal = item.unitPrice * item.quantity;
    const atMax = item.quantity >= item.maxStock;

    return (
        <div className="flex gap-4 py-5">
            <Link
                href={`/products/${item.productSlug}`}
                className="relative h-24 w-20 flex-shrink-0 overflow-hidden bg-muted"
            >
                <Image
                    src={item.image}
                    alt={item.productName}
                    fill
                    sizes="80px"
                    className="object-cover"
                />
            </Link>

            <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex items-start justify-between gap-3">
                    <Link
                        href={`/products/${item.productSlug}`}
                        className="truncate text-sm font-medium hover:text-accent"
                    >
                        {item.productName}
                    </Link>
                    <button
                        aria-label="Remove item"
                        onClick={() => {
                            remove(item.variantId);
                            notify.cartRemoved(item.productName);
                        }}
                        className="text-muted-foreground transition-colors hover:text-foreground"
                    >
                        <X size={16} strokeWidth={1.5} />
                    </button>
                </div>

                <p className="mt-1 text-xs text-muted-foreground">
                    {item.color} · {item.size}
                </p>

                <div className="mt-auto flex items-end justify-between pt-3">
                    <div className="flex items-center border border-border">
                        <button
                            aria-label="Decrease quantity"
                            onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                            className="flex h-8 w-8 items-center justify-center transition-colors hover:bg-muted"
                        >
                            <Minus size={12} strokeWidth={2} />
                        </button>
                        <span className="flex h-8 w-8 items-center justify-center text-xs">
                            {item.quantity}
                        </span>
                        <button
                            aria-label="Increase quantity"
                            disabled={atMax}
                            onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                            className="flex h-8 w-8 items-center justify-center transition-colors hover:bg-muted disabled:opacity-30"
                        >
                            <Plus size={12} strokeWidth={2} />
                        </button>
                    </div>

                    <span className="text-sm">{formatPrice(lineTotal)}</span>
                </div>

                {atMax && (
                    <p className="mt-2 text-[10px] text-muted-foreground">
                        Max quantity reached
                    </p>
                )}
            </div>
        </div>
    );
}