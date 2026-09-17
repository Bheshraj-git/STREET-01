import { cn } from "@/lib/utils";

const ORDER_STYLES: Record<string, string> = {
    PENDING: "bg-muted text-muted-foreground",
    CONFIRMED: "bg-foreground text-background",
    PROCESSING: "bg-accent/10 text-accent border border-accent/30",
    SHIPPED: "bg-blue-500/10 text-blue-600 border border-blue-500/30",
    DELIVERED: "bg-success/10 text-success border border-success/30",
    CANCELLED: "bg-sale/10 text-sale border border-sale/30",
};

const PAYMENT_STYLES: Record<string, string> = {
    PENDING: "bg-muted text-muted-foreground",
    PAID: "bg-success/10 text-success border border-success/30",
    FAILED: "bg-sale/10 text-sale border border-sale/30",
    REFUNDED: "bg-accent/10 text-accent border border-accent/30",
};

export function OrderStatusBadge({ status }: { status: string }) {
    return (
        <span
            className={cn(
                "inline-flex items-center px-2 py-1 text-[10px] font-medium uppercase tracking-wider",
                ORDER_STYLES[status] ?? "bg-muted"
            )}
        >
            {status}
        </span>
    );
}

export function PaymentStatusBadge({ status }: { status: string }) {
    return (
        <span
            className={cn(
                "inline-flex items-center px-2 py-1 text-[10px] font-medium uppercase tracking-wider",
                PAYMENT_STYLES[status] ?? "bg-muted"
            )}
        >
            {status}
        </span>
    );
}