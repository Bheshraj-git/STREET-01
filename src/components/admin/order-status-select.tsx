"use client";

import { useTransition, useState } from "react";
import { notify } from "@/lib/toast";
import { cn } from "@/lib/utils";
import {
    updateOrderStatus,
    updatePaymentStatus,
} from "@/lib/actions/admin/orders";

const ORDER_STAGES = [
    "PENDING",
    "CONFIRMED",
    "PROCESSING",
    "SHIPPED",
    "DELIVERED",
    "CANCELLED",
] as const;

const PAYMENT_STAGES = ["PENDING", "PAID", "FAILED", "REFUNDED"] as const;

export function OrderStatusSelect({
    orderId,
    current,
}: {
    orderId: string;
    current: string;
}) {
    const [value, setValue] = useState(current);
    const [pending, start] = useTransition();

    function onChange(next: string) {
        const prev = value;
        setValue(next);
        start(async () => {
            const r = await updateOrderStatus(
                orderId,
                next as (typeof ORDER_STAGES)[number]
            );
            if (!r.ok) {
                setValue(prev);
                notify.error(r.error);
            } else {
                notify.success(`Order marked ${next.toLowerCase()}`);
            }
        });
    }

    return (
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={pending}
            className={cn(
                "h-9 border border-border bg-background px-3 text-xs uppercase tracking-wider outline-none focus:border-foreground disabled:opacity-50"
            )}
        >
            {ORDER_STAGES.map((s) => (
                <option key={s} value={s}>
                    {s}
                </option>
            ))}
        </select>
    );
}

export function PaymentStatusSelect({
    orderId,
    current,
}: {
    orderId: string;
    current: string;
}) {
    const [value, setValue] = useState(current);
    const [pending, start] = useTransition();

    function onChange(next: string) {
        const prev = value;
        setValue(next);
        start(async () => {
            const r = await updatePaymentStatus(
                orderId,
                next as (typeof PAYMENT_STAGES)[number]
            );
            if (!r.ok) {
                setValue(prev);
                notify.error(r.error);
            } else {
                notify.success(`Payment marked ${next.toLowerCase()}`);
            }
        });
    }

    return (
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={pending}
            className={cn(
                "h-9 border border-border bg-background px-3 text-xs uppercase tracking-wider outline-none focus:border-foreground disabled:opacity-50"
            )}
        >
            {PAYMENT_STAGES.map((s) => (
                <option key={s} value={s}>
                    {s}
                </option>
            ))}
        </select>
    );
}