import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const STAGES = [
    { key: "PENDING", label: "Order placed" },
    { key: "CONFIRMED", label: "Confirmed" },
    { key: "PROCESSING", label: "Processing" },
    { key: "SHIPPED", label: "Shipped" },
    { key: "DELIVERED", label: "Delivered" },
] as const;

type OrderStatus =
    | "PENDING"
    | "CONFIRMED"
    | "PROCESSING"
    | "SHIPPED"
    | "DELIVERED"
    | "CANCELLED";

export function OrderTimeline({ status }: { status: OrderStatus }) {
    if (status === "CANCELLED") {
        return (
            <div className="border border-sale/40 bg-sale/5 px-6 py-4">
                <p className="text-eyebrow text-sale">Cancelled</p>
                <p className="mt-1 text-sm text-muted-foreground">
                    This order was cancelled. Contact us if you have questions.
                </p>
            </div>
        );
    }

    const currentIndex = STAGES.findIndex((s) => s.key === status);

    return (
        <ol className="flex flex-col gap-4 md:flex-row md:items-start md:gap-2">
            {STAGES.map((stage, i) => {
                const reached = i <= currentIndex;
                const isCurrent = i === currentIndex;

                return (
                    <li
                        key={stage.key}
                        className="flex flex-1 items-center gap-3 md:flex-col md:items-start"
                    >
                        <div className="flex items-center gap-3 md:w-full">
                            <span
                                className={cn(
                                    "flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border text-xs",
                                    reached
                                        ? "border-foreground bg-foreground text-background"
                                        : "border-border text-muted-foreground",
                                    isCurrent && "ring-2 ring-accent ring-offset-2 ring-offset-background"
                                )}
                            >
                                {reached ? (
                                    <Check size={12} strokeWidth={2.5} />
                                ) : (
                                    <span className="h-1.5 w-1.5 rounded-full bg-current" />
                                )}
                            </span>
                            {i < STAGES.length - 1 && (
                                <span
                                    className={cn(
                                        "hidden h-px flex-1 md:block",
                                        reached ? "bg-foreground" : "bg-border"
                                    )}
                                />
                            )}
                        </div>
                        <span
                            className={cn(
                                "text-xs md:mt-3",
                                reached ? "text-foreground" : "text-muted-foreground"
                            )}
                        >
                            {stage.label}
                        </span>
                    </li>
                );
            })}
        </ol>
    );
}