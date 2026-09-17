"use client";

import { useMemo, useState } from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RatingStars } from "@/components/ui/rating-stars";
import { PriceDisplay } from "@/components/ui/price-display";
import { ColorSelector } from "@/components/product/color-selector";
import { SizeSelector } from "@/components/product/size-selector";
import { QuantitySelector } from "@/components/product/quantity-selector";
import { StockIndicator } from "@/components/product/stock-indicator";
import { SizeGuideModal } from "@/components/product/size-guide-modal";
import { ProductInfoSections } from "@/components/product/product-info-sections";
import { useCartStore } from "@/lib/stores/cart-store";
import { useWishlistStore } from "@/lib/stores/wishlist-store";
import { useUIStore } from "@/lib/stores/ui-store";
import { useMounted } from "@/lib/hooks/use-mounted";
import { notify } from "@/lib/toast";
import { cn } from "@/lib/utils";
import type { ProductDetail } from "@/lib/queries/product-by-slug";

export function AddToCartForm({ product }: { product: ProductDetail }) {
    const mounted = useMounted();
    const addToCart = useCartStore((s) => s.add);
    const openCartDrawer = useUIStore((s) => s.openCartDrawer);
    const wishlist = useWishlistStore();

    const colors = useMemo(() => {
        const m = new Map<string, string>();
        for (const v of product.variants) m.set(v.color, v.colorHex);
        return Array.from(m.entries()).map(([name, hex]) => ({ name, hex }));
    }, [product.variants]);

    const sizes = useMemo(() => {
        const set = new Set(product.variants.map((v) => v.size));
        // Preserve standard order
        const order = ["XS", "S", "M", "L", "XL", "XXL", "ONE SIZE"];
        return order.filter((s) => set.has(s));
    }, [product.variants]);

    const [selectedColor, setSelectedColor] = useState(colors[0]?.name ?? "");
    const [selectedSize, setSelectedSize] = useState<string | null>(
        sizes.length === 1 ? sizes[0] : null
    );
    const [quantity, setQuantity] = useState(1);
    const [sizeGuideOpen, setSizeGuideOpen] = useState(false);

    const availableSizes = useMemo(() => {
        return new Set(
            product.variants
                .filter((v) => v.color === selectedColor)
                .map((v) => v.size)
        );
    }, [product.variants, selectedColor]);

    const activeVariant = useMemo(() => {
        if (!selectedSize) return null;
        return (
            product.variants.find(
                (v) => v.color === selectedColor && v.size === selectedSize
            ) ?? null
        );
    }, [product.variants, selectedColor, selectedSize]);

    const stock = activeVariant?.stock ?? 0;
    const canAdd = !!activeVariant && stock > 0;
    const saved = mounted ? wishlist.has(product.id) : false;

    function handleColorChange(name: string) {
        setSelectedColor(name);
        // If current size is unavailable in new color, reset
        if (selectedSize) {
            const stillAvailable = product.variants.some(
                (v) => v.color === name && v.size === selectedSize && v.stock > 0
            );
            if (!stillAvailable) setSelectedSize(null);
        }
    }

    function handleAddToCart() {
        if (!activeVariant || !canAdd) return;
        const primaryImage = product.images[0]?.url ?? "";

        addToCart(
            {
                variantId: activeVariant.id,
                productId: product.id,
                productSlug: product.slug,
                productName: product.name,
                image: primaryImage,
                color: activeVariant.color,
                size: activeVariant.size,
                unitPrice: product.price,
                compareAtPrice: product.compareAtPrice,
                maxStock: stock,
            },
            quantity
        );

        notify.cartAdded(
            `${product.name} · ${activeVariant.color} · ${activeVariant.size}`
        );
        openCartDrawer();
    }

    function handleWishlist() {
        wishlist.toggle({
            productId: product.id,
            slug: product.slug,
            name: product.name,
            image: product.images[0]?.url ?? "",
            price: product.price,
            compareAtPrice: product.compareAtPrice,
            categoryName: product.category.name,
        });
        notify[saved ? "wishlistRemoved" : "wishlistAdded"](product.name);
    }

    const onSale =
        product.compareAtPrice !== null && product.compareAtPrice > product.price;

    return (
        <>
            <div className="flex flex-col">
                {/* Category eyebrow */}
                <div className="flex items-center gap-3">
                    <a
                        href={`/shop?category=${product.category.slug}`}
                        className="text-eyebrow text-muted-foreground hover:text-foreground"
                    >
                        {product.category.name}
                    </a>
                    {product.isNewArrival && !onSale && <Badge variant="new">New</Badge>}
                    {onSale && <Badge variant="sale">Sale</Badge>}
                </div>

                <h1 className="text-display mt-4 text-3xl md:text-5xl">
                    {product.name}
                </h1>

                {product.ratingCount > 0 && (
                    <div className="mt-4 flex items-center gap-3">
                        <RatingStars rating={product.ratingAverage} size={14} />
                        <span className="text-xs text-muted-foreground">
                            {product.ratingAverage.toFixed(1)} · {product.ratingCount} review
                            {product.ratingCount === 1 ? "" : "s"}
                        </span>
                    </div>
                )}

                <div className="mt-6">
                    <PriceDisplay
                        price={product.price}
                        compareAt={product.compareAtPrice}
                        className="text-lg md:text-xl"
                    />
                </div>

                <div className="hairline my-8" />

                <div className="flex flex-col gap-6">
                    <ColorSelector
                        colors={colors}
                        selected={selectedColor}
                        onChange={handleColorChange}
                    />

                    <SizeSelector
                        sizes={sizes}
                        availableSizes={availableSizes}
                        selected={selectedSize}
                        onChange={setSelectedSize}
                        onOpenSizeGuide={() => setSizeGuideOpen(true)}
                    />

                    <div className="flex items-end justify-between gap-4">
                        <div>
                            <span className="text-eyebrow mb-3 block">Quantity</span>
                            <QuantitySelector
                                value={quantity}
                                onChange={setQuantity}
                                max={Math.max(1, stock)}
                            />
                        </div>
                        <StockIndicator stock={selectedSize ? stock : -1} />
                    </div>

                    <div className="mt-2 flex flex-col gap-2">
                        <Button
                            size="lg"
                            disabled={!canAdd}
                            onClick={handleAddToCart}
                            className="w-full"
                        >
                            {selectedSize
                                ? canAdd
                                    ? "Add to bag"
                                    : "Sold out"
                                : "Select a size"}
                        </Button>

                        <Button
                            variant="outline"
                            size="md"
                            onClick={handleWishlist}
                            className="w-full"
                        >
                            <Heart
                                size={16}
                                strokeWidth={1.5}
                                className={cn(saved && "fill-accent text-accent")}
                            />
                            {saved ? "Saved" : "Save to wishlist"}
                        </Button>
                    </div>

                    <div className="mt-4">
                        <ProductInfoSections
                            description={product.description}
                            materials={product.materials}
                            fit={product.fit}
                        />
                    </div>
                </div>
            </div>

            <SizeGuideModal
                open={sizeGuideOpen}
                onClose={() => setSizeGuideOpen(false)}
            />
        </>
    );
}