"use client";

import { useRouter } from "next/navigation";
import { ShoppingBag } from "lucide-react";

export function QuickAddButton({ slug }: { slug: string }) {
    const router = useRouter();

    return (
        <button
            aria-label="Select options"
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                router.push(`/products/${slug}`);
            }}
            className="absolute bottom-3 left-3 right-3 flex h-10 translate-y-2 items-center justify-center gap-2 bg-background/95 text-eyebrow opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
        >
            <ShoppingBag size={14} strokeWidth={1.5} />
            Select Options
        </button>
    );
}