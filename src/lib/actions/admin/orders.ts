"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/session";
import type { OrderStatus, PaymentStatus } from "@prisma/client";

const orderStatusSchema = z.enum([
    "PENDING",
    "CONFIRMED",
    "PROCESSING",
    "SHIPPED",
    "DELIVERED",
    "CANCELLED",
]);

const paymentStatusSchema = z.enum([
    "PENDING",
    "PAID",
    "FAILED",
    "REFUNDED",
]);

export type ActionResult =
    | { ok: true }
    | { ok: false; error: string };

export async function updateOrderStatus(
    orderId: string,
    status: OrderStatus
): Promise<ActionResult> {
    await requireAdmin();

    const parsed = orderStatusSchema.safeParse(status);
    if (!parsed.success) return { ok: false, error: "Invalid status." };

    await prisma.order.update({
        where: { id: orderId },
        data: { orderStatus: parsed.data },
    });

    revalidatePath("/admin/orders");
    revalidatePath(`/admin/orders/${orderId}`);
    return { ok: true };
}

export async function updatePaymentStatus(
    orderId: string,
    status: PaymentStatus
): Promise<ActionResult> {
    await requireAdmin();

    const parsed = paymentStatusSchema.safeParse(status);
    if (!parsed.success) return { ok: false, error: "Invalid payment status." };

    await prisma.order.update({
        where: { id: orderId },
        data: { paymentStatus: parsed.data },
    });

    revalidatePath("/admin/orders");
    revalidatePath(`/admin/orders/${orderId}`);
    return { ok: true };
}

export async function updateOrderByNumber(
    orderNumber: string,
    status: OrderStatus
): Promise<ActionResult> {
    await requireAdmin();

    const parsed = orderStatusSchema.safeParse(status);
    if (!parsed.success) return { ok: false, error: "Invalid status." };

    await prisma.order.update({
        where: { orderNumber },
        data: { orderStatus: parsed.data },
    });

    revalidatePath("/admin/orders");
    revalidatePath(`/admin/orders/${orderNumber}`);
    return { ok: true };
}