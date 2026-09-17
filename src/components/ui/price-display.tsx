import { cn, formatPrice } from "@/lib/utils";

export function PriceDisplay({
    price,
    compareAt,
    className,
}: {
    price: number;
    compareAt?: number | null;
    className?: string;
}) {
    const onSale = compareAt && compareAt > price;
    const discount = onSale
        ? Math.round(((compareAt - price) / compareAt) * 100)
        : 0;

    return (
        <div className={cn("flex items-center gap-2", className)}>
            <span className={cn("text-sm", onSale && "text-accent")}>
                {formatPrice(price)}
            </span>
            {onSale && (
                <>
                    <span className="text-sm text-muted-foreground line-through">
                        {formatPrice(compareAt!)}
                    </span>
                    <span className="text-[10px] font-medium uppercase tracking-wider text-accent">
                        -{discount}%
                    </span>
                </>
            )}
        </div>
    );
}