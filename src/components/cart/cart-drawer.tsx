"use client";

import Link from "next/link";
import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useCartStore } from "@/lib/stores/cart-store";
import { useUIStore } from "@/lib/stores/ui-store";
import { useMounted } from "@/lib/hooks/use-mounted";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CartLineItem } from "./cart-line-item";
import { CartEmpty } from "./cart-empty";

export function CartDrawer() {
    const mounted = useMounted();
    const open = useUIStore((s) => s.cartDrawerOpen);
    const close = useUIStore((s) => s.closeCartDrawer);
    const items = useCartStore((s) => s.items);
    const subtotal = useCartStore((s) => s.subtotal);

    // Lock body scroll when open
    useEffect(() => {
        if (!mounted) return;
        document.body.style.overflow = open ? "hidden" : "";
        return () => {
            document.body.style.overflow = "";
        };
    }, [open, mounted]);

    // ESC to close
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") close();
        };
        if (open) window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open, close]);

    if (!mounted) return null;

    const total = subtotal();

    return (
        <AnimatePresence>
            {open && (
                <div className="fixed inset-0 z-[70]">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={close}
                        className="absolute inset-0 bg-black/50"
                    />

                    <motion.aside
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                        className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-background"
                        role="dialog"
                        aria-modal="true"
                        aria-label="Shopping bag"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-border px-6 py-5">
                            <div>
                                <p className="text-eyebrow text-muted-foreground">Bag</p>
                                <h2 className="text-display mt-1 text-xl">
                                    {items.length === 0
                                        ? "Empty"
                                        : `${items.length} item${items.length === 1 ? "" : "s"}`}
                                </h2>
                            </div>
                            <button
                                aria-label="Close bag"
                                onClick={close}
                                className="text-muted-foreground transition-colors hover:text-foreground"
                            >
                                <X size={20} strokeWidth={1.5} />
                            </button>
                        </div>

                        {/* Items */}
                        <div className="flex-1 overflow-y-auto px-6">
                            {items.length === 0 ? (
                                <CartEmpty onClose={close} />
                            ) : (
                                <div className="divide-y divide-border">
                                    {items.map((item) => (
                                        <CartLineItem key={item.variantId} item={item} />
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        {items.length > 0 && (
                            <div className="border-t border-border bg-muted/40 px-6 py-5">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">Subtotal</span>
                                    <span className="font-medium">{formatPrice(total)}</span>
                                </div>
                                <p className="mt-2 text-xs text-muted-foreground">
                                    Shipping and taxes calculated at checkout.
                                </p>

                                <div className="mt-5 flex flex-col gap-2">
                                    <Link href="/checkout" onClick={close}>
                                        <Button size="lg" className="w-full">
                                            Checkout
                                        </Button>
                                    </Link>
                                    <Link href="/cart" onClick={close}>
                                        <Button variant="outline" size="md" className="w-full">
                                            View bag
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        )}
                    </motion.aside>
                </div>
            )}
        </AnimatePresence>
    );
}