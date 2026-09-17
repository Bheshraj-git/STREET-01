import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import type { OrderSummary } from "@/lib/queries/account";

export function OrderCard({ order }: { order: OrderSummary }) {
    return (
        <Link
            href={`/account/orders/${order.orderNumber}`}
            className="block border border-border transition-colors hover:bg-muted/40"
        >
            <div className="flex items-center justify-between border-b border-border px-5 py-3">
                <div className="flex items-center gap-4">
                    <span className="font-mono text-xs">{order.orderNumber}</span>
                    <span className="text-eyebrow text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                        })}
                    </span>
                </div>
                <span className="text-eyebrow">{order.orderStatus}</span>
            </div>

            <div className="flex items-center gap-4 p-5">
                <div className="relative h-16 w-14 flex-shrink-0 overflow-hidden bg-muted">
                    {order.firstImage && (
                        <Image
                            src={order.firstImage}
                            alt={order.firstItemName}
                            fill
                            sizes="56px"
                            className="object-cover"
                        />
                    )}
                </div>

                <div className="min-w-0 flex-1">
                    <p className="truncate text-sm">{order.firstItemName}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                        {order.itemCount} item{order.itemCount === 1 ? "" : "s"}
                    </p>
                </div>

                <div className="text-right">
                    <p className="text-sm font-medium">{formatPrice(order.total)}</p>
                </div>
            </div>
        </Link>
    );
}