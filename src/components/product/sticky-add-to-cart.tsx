"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";

export function StickyAddToCart({
    productName,
    price,
    disabled,
    label,
    onAdd,
}: {
    productName: string;
    price: number;
    disabled: boolean;
    label: string;
    onAdd: () => void;
}) {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const onScroll = () => setVisible(window.scrollY > 600);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    if (!visible) return null;

    return (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 p-3 backdrop-blur-md md:hidden">
            <div className="flex items-center gap-3">
                <div className="min-w-0 flex-1">
                    <p className="truncate text-xs text-muted-foreground">
                        {productName}
                    </p>
                    <p className="text-sm font-medium">{formatPrice(price)}</p>
                </div>
                <Button
                    size="md"
                    disabled={disabled}
                    onClick={onAdd}
                    className="min-w-[140px]"
                >
                    {label}
                </Button>
            </div>
        </div>
    );
}