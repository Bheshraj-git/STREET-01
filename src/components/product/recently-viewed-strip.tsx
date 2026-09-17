"use client";

import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { useRecentlyViewedStore } from "@/lib/stores/recently-viewed-store";
import { useMounted } from "@/lib/hooks/use-mounted";
import { formatPrice } from "@/lib/utils";

export function RecentlyViewedStrip({
    excludeProductId,
}: {
    excludeProductId: string;
}) {
    const mounted = useMounted();
    const items = useRecentlyViewedStore((s) => s.items);

    if (!mounted) return null;

    const filtered = items.filter((i) => i.productId !== excludeProductId);
    if (filtered.length === 0) return null;

    return (
        <section className="border-t border-border">
            <Container className="py-16 md:py-20">
                <div className="mb-8">
                    <p className="text-eyebrow text-muted-foreground">Your history</p>
                    <h2 className="text-display mt-3 text-2xl md:text-3xl">
                        Recently Viewed
                    </h2>
                </div>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
                    {filtered.slice(0, 4).map((item) => (
                        <Link
                            key={item.productId}
                            href={`/products/${item.slug}`}
                            className="group"
                        >
                            <div className="relative aspect-[3/4] overflow-hidden bg-muted">
                                {item.image && (
                                    <Image
                                        src={item.image}
                                        alt={item.name}
                                        fill
                                        sizes="(max-width: 768px) 50vw, 25vw"
                                        className="object-cover transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-105"
                                    />
                                )}
                            </div>
                            <h3 className="mt-3 truncate text-sm font-medium">
                                {item.name}
                            </h3>
                            <p className="mt-1 text-xs text-muted-foreground">
                                {formatPrice(item.price)}
                            </p>
                        </Link>
                    ))}
                </div>
            </Container>
        </section>
    );
}