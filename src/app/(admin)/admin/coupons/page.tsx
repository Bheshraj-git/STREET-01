import { CouponManager } from "@/components/admin/coupon-manager";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Coupons" };

export default async function AdminCouponsPage() {
    const coupons = await prisma.coupon.findMany({
        orderBy: { createdAt: "desc" },
    });

    const rows = coupons.map((c) => ({
        id: c.id,
        code: c.code,
        description: c.description,
        discountType: c.discountType,
        discountValue: Number(c.discountValue),
        minOrderAmount: c.minOrderAmount ? Number(c.minOrderAmount) : null,
        maxUses: c.maxUses,
        usedCount: c.usedCount,
        startsAt: c.startsAt ? c.startsAt.toISOString() : null,
        expiresAt: c.expiresAt ? c.expiresAt.toISOString() : null,
        active: c.active,
    }));

    return (
        <div className="flex flex-col gap-6">
            <div>
                <p className="text-eyebrow text-muted-foreground">Manage</p>
                <h1 className="text-display mt-2 text-3xl">Coupons</h1>
            </div>
            <CouponManager coupons={rows} />
        </div>
    );
}