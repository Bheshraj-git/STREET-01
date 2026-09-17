"use client";

import Link from "next/link";
import { ArrowLeft, Trash2 } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { CartLineItem } from "@/components/cart/cart-line-item";
import { CartEmpty } from "@/components/cart/cart-empty";
import { useCartStore } from "@/lib/stores/cart-store";
import { useMounted } from "@/lib/hooks/use-mounted";
import { formatPrice } from "@/lib/utils";
import { notify } from "@/lib/toast";

export default function CartPage() {
  const mounted = useMounted();
  const items = useCartStore((s) => s.items);
  const subtotal = useCartStore((s) => s.subtotal);
  const clear = useCartStore((s) => s.clear);

  if (!mounted) {
    return (
      <Container className="py-16 md:py-24">
        <div className="h-8 w-48 animate-pulse bg-muted" />
      </Container>
    );
  }

  return (
    <Container className="py-12 md:py-20">
      <Link
        href="/shop"
        className="text-eyebrow inline-flex items-center gap-2 text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft size={14} strokeWidth={1.5} />
        Continue shopping
      </Link>

      <div className="mt-8 flex items-end justify-between">
        <div>
          <p className="text-eyebrow text-muted-foreground">Shopping bag</p>
          <h1 className="text-display mt-3 text-4xl md:text-6xl">
            Your Bag
          </h1>
        </div>
        {items.length > 0 && (
          <button
            onClick={() => {
              clear();
              notify.cartRemoved("All items");
            }}
            className="text-eyebrow flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
          >
            <Trash2 size={14} strokeWidth={1.5} />
            Clear
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="mt-16">
          <CartEmpty />
        </div>
      ) : (
        <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_380px]">
          <div className="divide-y divide-border border-y border-border">
            {items.map((item) => (
              <CartLineItem key={item.variantId} item={item} />
            ))}
          </div>

          <aside className="lg:sticky lg:top-24 lg:h-fit">
            <div className="border border-border p-6">
              <h2 className="text-display text-xl">Summary</h2>

              <div className="mt-6 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatPrice(subtotal())}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="text-muted-foreground">
                    Calculated at checkout
                  </span>
                </div>
              </div>

              <div className="hairline my-6" />

              <div className="flex items-end justify-between">
                <span className="text-eyebrow">Total</span>
                <span className="text-display text-2xl">
                  {formatPrice(subtotal())}
                </span>
              </div>

              <Link href="/checkout" className="mt-8 block">
                <Button size="lg" className="w-full">
                  Checkout
                </Button>
              </Link>

              <p className="mt-4 text-center text-xs text-muted-foreground">
                Taxes calculated at checkout
              </p>
            </div>
          </aside>
        </div>
      )}
    </Container>
  );
}