"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, Plus, Power } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CouponForm } from "./coupon-form";
import { notify } from "@/lib/toast";
import { deleteCoupon, toggleCouponActive } from "@/lib/actions/admin/coupons";
import { formatPrice } from "@/lib/utils";

export interface CouponRow {
    id: string;
    code: string;
    description: string | null;
    discountType: string;
    discountValue: number;
    minOrderAmount: number | null;
    maxUses: number | null;
    usedCount: number;
    startsAt: string | null;
    expiresAt: string | null;
    active: boolean;
}

export function CouponManager({ coupons }: { coupons: CouponRow[] }) {
    const router = useRouter();
    const [adding, setAdding] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    async function onDelete(id: string, code: string) {
        if (!confirm(`Delete coupon "${code}"?`)) return;
        const r = await deleteCoupon(id);
        if (!r.ok) notify.error(r.error);
        else {
            notify.success("Coupon deleted");
            router.refresh();
        }
    }

    async function onToggle(id: string, active: boolean) {
        const r = await toggleCouponActive(id);
        if (!r.ok) notify.error(r.error);
        else {
            notify.success(active ? "Deactivated" : "Activated");
            router.refresh();
        }
    }

    return (
        <div className="flex flex-col gap-4">
            {coupons.map((c) =>
                editingId === c.id ? (
                    <CouponForm
                        key={c.id}
                        mode="edit"
                        id={c.id}
                        initialValues={{
                            code: c.code,
                            description: c.description ?? "",
                            discountType: c.discountType as "PERCENTAGE" | "FIXED",
                            discountValue: c.discountValue,
                            minOrderAmount: c.minOrderAmount,
                            maxUses: c.maxUses,
                            startsAt: c.startsAt ? c.startsAt.slice(0, 10) : null,
                            expiresAt: c.expiresAt ? c.expiresAt.slice(0, 10) : null,
                            active: c.active,
                        }}
                        onCancel={() => setEditingId(null)}
                    />
                ) : (
                    <div
                        key={c.id}
                        className="flex flex-col gap-4 border border-border p-5 sm:flex-row sm:items-center sm:justify-between"
                    >
                        <div>
                            <div className="flex items-center gap-3">
                                <p className="font-mono text-sm font-medium tracking-wider">
                                    {c.code}
                                </p>
                                {!c.active && (
                                    <span className="text-eyebrow text-muted-foreground">
                                        Inactive
                                    </span>
                                )}
                            </div>
                            <p className="mt-1 text-xs text-muted-foreground">
                                {c.discountType === "PERCENTAGE"
                                    ? `${c.discountValue}% off`
                                    : `${formatPrice(c.discountValue)} off`}
                                {c.minOrderAmount
                                    ? ` · min ${formatPrice(c.minOrderAmount)}`
                                    : ""}
                                {c.maxUses
                                    ? ` · ${c.usedCount}/${c.maxUses} used`
                                    : ` · ${c.usedCount} used`}
                            </p>
                            {c.description && (
                                <p className="mt-1 text-xs text-muted-foreground">
                                    {c.description}
                                </p>
                            )}
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={() => onToggle(c.id, c.active)}
                                className="text-xs text-muted-foreground hover:text-foreground"
                                aria-label={c.active ? "Deactivate" : "Activate"}
                            >
                                <Power size={14} strokeWidth={1.5} />
                            </button>
                            <button
                                type="button"
                                onClick={() => setEditingId(c.id)}
                                className="text-xs text-muted-foreground hover:text-foreground"
                            >
                                <Pencil size={12} strokeWidth={1.5} />
                            </button>
                            <button
                                type="button"
                                onClick={() => onDelete(c.id, c.code)}
                                className="text-xs text-muted-foreground hover:text-sale"
                            >
                                <Trash2 size={12} strokeWidth={1.5} />
                            </button>
                        </div>
                    </div>
                )
            )}

            {adding ? (
                <CouponForm mode="create" onCancel={() => setAdding(false)} />
            ) : (
                <Button
                    variant="outline"
                    onClick={() => setAdding(true)}
                    className="self-start"
                >
                    <Plus size={14} strokeWidth={2} />
                    New coupon
                </Button>
            )}
        </div>
    );
}