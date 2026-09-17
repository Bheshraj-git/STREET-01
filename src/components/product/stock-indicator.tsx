import { cn } from "@/lib/utils";

export function StockIndicator({ stock }: { stock: number }) {
    if (stock === 0) {
        return (
            <div className="flex items-center gap-2 text-xs">
                <span className="h-1.5 w-1.5 rounded-full bg-sale" />
                <span className="text-sale">Sold out</span>
            </div>
        );
    }

    if (stock <= 3) {
        return (
            <div className="flex items-center gap-2 text-xs">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                <span className="text-accent">Only {stock} left</span>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-2 text-xs">
            <span className="h-1.5 w-1.5 rounded-full bg-success" />
            <span className="text-muted-foreground">In stock</span>
        </div>
    );
}