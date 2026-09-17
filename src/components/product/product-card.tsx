"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Heart } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { PriceDisplay } from "@/components/ui/price-display";
import { RatingStars } from "@/components/ui/rating-stars";
import { QuickAddButton } from "@/components/product/quick-add-button";
import { cn } from "@/lib/utils";
import { useWishlistStore } from "@/lib/stores/wishlist-store";
import { useMounted } from "@/lib/hooks/use-mounted";
import { notify } from "@/lib/toast";
import type { ProductCardData } from "@/lib/queries/products";

export function ProductCard({ product }: { product: ProductCardData }) {
    const mounted = useMounted();
    const [hovered, setHovered] = useState(false);

    const wishlist = useWishlistStore();
    const saved = mounted ? wishlist.has(product.id) : false;

    const primaryImage = product.images[0]?.url;
    const secondaryImage = product.images[1]?.url ?? primaryImage;

    const avgRating =
        product.reviews.length > 0
            ? product.reviews.reduce((s, r) => s + r.rating, 0) /
            product.reviews.length
            : 0;

    const uniqueColors = Array.from(
        new Map(product.variants.map((v) => [v.color, v.colorHex])).entries()
    ).slice(0, 4);

    const anyInStock = product.variants.some((v) => v.stock > 0);
    const onSale =
        product.compareAtPrice !== null && product.compareAtPrice > product.price;

    function onWishlistToggle(e: React.MouseEvent) {
        e.preventDefault();
        e.stopPropagation();
        wishlist.toggle({
            productId: product.id,
            slug: product.slug,
            name: product.name,
            image: primaryImage ?? "",
            price: product.price,
            compareAtPrice: product.compareAtPrice,
            categoryName: product.category.name,
        });
        notify[saved ? "wishlistRemoved" : "wishlistAdded"](product.name);
    }

    return (
        <motion.article
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="group"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <Link href={`/products/${product.slug}`} className="block">
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-muted">
                    {primaryImage && (
                        <Image
                            src={hovered && secondaryImage ? secondaryImage : primaryImage}
                            alt={product.name}
                            fill
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                            className={cn(
                                "object-cover transition-transform duration-700 ease-[var(--ease-out-expo)]",
                                hovered && "scale-[1.03]"
                            )}
                        />
                    )}

                    <div className="absolute left-3 top-3 flex flex-col gap-1.5">
                        {onSale && <Badge variant="sale">Sale</Badge>}
                        {product.isNewArrival && !onSale && <Badge variant="new">New</Badge>}
                        {!anyInStock && <Badge variant="soldout">Sold out</Badge>}
                    </div>

                    <button
                        aria-label={saved ? "Remove from wishlist" : "Add to wishlist"}
                        onClick={onWishlistToggle}
                        className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center bg-background/80 backdrop-blur-sm transition-colors hover:bg-background"
                    >
                        <Heart
                            size={16}
                            strokeWidth={1.5}
                            className={cn(saved && "fill-accent text-accent")}
                        />
                    </button>

                    {anyInStock && <QuickAddButton slug={product.slug} />}
                </div>

                <div className="mt-4 flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                        <h3 className="truncate text-sm font-medium text-foreground">
                            {product.name}
                        </h3>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                            {product.category.name}
                        </p>
                    </div>
                </div>

                <div className="mt-2 flex items-center justify-between gap-2">
                    <PriceDisplay
                        price={product.price}
                        compareAt={product.compareAtPrice}
                    />
                    {avgRating > 0 && (
                        <div className="flex items-center gap-1">
                            <RatingStars rating={avgRating} size={11} />
                            <span className="text-[10px] text-muted-foreground">
                                ({product.reviews.length})
                            </span>
                        </div>
                    )}
                </div>

                {uniqueColors.length > 0 && (
                    <div className="mt-3 flex items-center gap-1.5">
                        {uniqueColors.map(([name, hex]) => (
                            <span
                                key={name}
                                title={name}
                                className="h-3 w-3 rounded-full border border-border"
                                style={{ backgroundColor: hex }}
                            />
                        ))}
                    </div>
                )}
            </Link>
        </motion.article>
    );
}