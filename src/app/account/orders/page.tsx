import Link from "next/link";
import { Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OrderCard } from "@/components/account/order-card";
import { requireUser } from "@/lib/auth/session";
import { getUserOrders } from "@/lib/queries/account";

export const metadata = { title: "Orders" };

export default async function OrdersPage() {
    const user = await requireUser();
    const orders = await getUserOrders(user.id);

    return (
        <div>
            <div className="mb-8">
                <p className="text-eyebrow text-muted-foreground">History</p>
                <h2 className="text-display mt-2 text-3xl">Your orders</h2>
            </div>

            {orders.length === 0 ? (
                <div className="border border-border p-12 text-center">
                    <Package
                        size={28}
                        strokeWidth={1.2}
                        className="mx-auto text-muted-foreground"
                    />
                    <p className="mt-4 text-sm text-muted-foreground">
                        You haven't placed any orders yet.
                    </p>
                    <Link href="/shop" className="mt-6 inline-block">
                        <Button>Start shopping</Button>
                    </Link>
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    {orders.map((o) => (
                        <OrderCard key={o.id} order={o} />
                    ))}
                </div>
            )}
        </div>
    );
}