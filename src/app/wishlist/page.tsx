"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, X } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { PriceDisplay } from "@/components/ui/price-display";
import { useWishlistStore } from "@/lib/stores/wishlist-store";
import { useMounted } from "@/lib/hooks/use-mounted";
import { notify } from "@/lib/toast";

export default function WishlistPage() {
    const mounted = useMounted();
    const items = useWishlistStore((s) => s.items);
    const remove = useWishlistStore((s) => s.remove);

    if (!mounted) {
        return (
            <Container className="py-16 md:py-24">
                <div className="h-8 w-48 animate-pulse bg-muted" />
            </Container>
        );
    }

    return (
        <Container className="py-12 md:py-20">
            <div>
                <p className="text-eyebrow text-muted-foreground">Saved</p>
                <h1 className="text-display mt-3 text-4xl md:text-6xl">
                    Wishlist
                </h1>
            </div>

            {items.length === 0 ? (
                <div className="mt-20 flex flex-col items-center justify-center py-16 text-center">
                    <p className="text-eyebrow text-muted-foreground">Empty</p>
                    <h2 className="text-display mt-3 text-2xl">
                        Nothing saved yet.
                    </h2>
                    <p className="mt-2 max-w-[28ch] text-sm text-muted-foreground">
                        Find something you love.
                    </p>
                    <Link href="/shop" className="mt-8">
                        <Button>Shop now</Button>
                    </Link>
                </div>
            ) : (
                <div className="mt-12 grid gap-x-4 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
                    {items.map((item) => (
                        <div key={item.productId} className="group relative">
                            <Link href={`/products/${item.slug}`} className="block">
                                <div className="relative aspect-[3/4] overflow-hidden bg-muted">
                                    {item.image && (
                                        <Image
                                            src={item.image}
                                            alt={item.name}
                                            fill
                                            sizes="(max-width: 768px) 100vw, 33vw"
                                            className="object-cover transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-105"
                                        />
                                    )}
                                </div>

                                <div className="mt-4">
                                    <h3 className="text-sm font-medium">{item.name}</h3>
                                    <p className="mt-0.5 text-xs text-muted-foreground">
                                        {item.categoryName}
                                    </p>
                                    <div className="mt-2">
                                        <PriceDisplay
                                            price={item.price}
                                            compareAt={item.compareAtPrice}
                                        />
                                    </div>
                                </div>
                            </Link>

                            <div className="mt-4 flex gap-2">
                                <Link href={`/products/${item.slug}`} className="flex-1">
                                    <Button variant="outline" size="sm" className="w-full">
                                        Select Options
                                    </Button>
                                </Link>
                                <button
                                    aria-label="Remove from wishlist"
                                    onClick={() => {
                                        remove(item.productId);
                                        notify.wishlistRemoved(item.name);
                                    }}
                                    className="flex h-9 w-9 items-center justify-center border border-border transition-colors hover:bg-muted"
                                >
                                    <X size={14} strokeWidth={1.5} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </Container>
    );
}