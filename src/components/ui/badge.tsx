import * as React from "react";
import { cn } from "@/lib/utils";

type BadgeVariant = "new" | "sale" | "soldout" | "low" | "neutral";

const styles: Record<BadgeVariant, string> = {
    new: "bg-foreground text-background",
    sale: "bg-accent text-accent-foreground",
    soldout: "bg-muted text-muted-foreground",
    low: "bg-sale/10 text-sale border border-sale/30",
    neutral: "bg-muted text-foreground",
};

export function Badge({
    variant = "neutral",
    className,
    children,
}: {
    variant?: BadgeVariant;
    className?: string;
    children: React.ReactNode;
}) {
    return (
        <span
            className={cn(
                "inline-flex items-center px-2 py-1 text-[10px] font-medium uppercase tracking-[0.15em]",
                styles[variant],
                className
            )}
        >
            {children}
        </span>
    );
}