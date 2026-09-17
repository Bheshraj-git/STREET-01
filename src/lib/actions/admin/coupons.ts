"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/session";

export type ActionResult =
    | { ok: true }
    | { ok: false; error: string; field?: string };

const couponInputSchema = z.object({
    code: z
        .string()
        .trim()
        .min(3, "Code required")
        .max(32)
        .regex(/^[A-Z0-9]+$/, "Uppercase letters and numbers only"),
    description: z.string().trim().max(120).optional().or(z.literal("")),
    discountType: z.enum(["PERCENTAGE", "FIXED"]),
    discountValue: z.number().positive("Value must be positive"),
    minOrderAmount: z.number().nonnegative().nullable().optional(),
    maxUses: z.number().int().positive().nullable().optional(),
    startsAt: z.string().nullable().optional(),
    expiresAt: z.string().nullable().optional(),
    active: z.boolean().default(true),
});

export type CouponInput = z.infer<typeof couponInputSchema>;

export async function createCoupon(input: CouponInput): Promise<ActionResult> {
    await requireAdmin();

    const parsed = couponInputSchema.safeParse(input);
    if (!parsed.success) {
        const i = parsed.error.issues[0];
        return { ok: false, error: i.message, field: String(i.path[0]) };
    }
    const d = parsed.data;

    const clash = await prisma.coupon.findUnique({ where: { code: d.code } });
    if (clash) return { ok: false, error: "Code already in use.", field: "code" };

    await prisma.coupon.create({
        data: {
            code: d.code,
            description: d.description || null,
            discountType: d.discountType,
            discountValue: d.discountValue,
            minOrderAmount: d.minOrderAmount ?? null,
            maxUses: d.maxUses ?? null,
            startsAt: d.startsAt ? new Date(d.startsAt) : null,
            expiresAt: d.expiresAt ? new Date(d.expiresAt) : null,
            active: d.active,
        },
    });

    revalidatePath("/admin/coupons");
    return { ok: true };
}

export async function updateCoupon(
    id: string,
    input: CouponInput
): Promise<ActionResult> {
    await requireAdmin();

    const parsed = couponInputSchema.safeParse(input);
    if (!parsed.success) {
        const i = parsed.error.issues[0];
        return { ok: false, error: i.message, field: String(i.path[0]) };
    }
    const d = parsed.data;

    const clash = await prisma.coupon.findFirst({
        where: { code: d.code, NOT: { id } },
    });
    if (clash) return { ok: false, error: "Code already in use.", field: "code" };

    await prisma.coupon.update({
        where: { id },
        data: {
            code: d.code,
            description: d.description || null,
            discountType: d.discountType,
            discountValue: d.discountValue,
            minOrderAmount: d.minOrderAmount ?? null,
            maxUses: d.maxUses ?? null,
            startsAt: d.startsAt ? new Date(d.startsAt) : null,
            expiresAt: d.expiresAt ? new Date(d.expiresAt) : null,
            active: d.active,
        },
    });

    revalidatePath("/admin/coupons");
    return { ok: true };
}

export async function deleteCoupon(id: string): Promise<ActionResult> {
    await requireAdmin();
    await prisma.coupon.delete({ where: { id } });
    revalidatePath("/admin/coupons");
    return { ok: true };
}

export async function toggleCouponActive(id: string): Promise<ActionResult> {
    await requireAdmin();

    const c = await prisma.coupon.findUnique({
        where: { id },
        select: { active: true },
    });
    if (!c) return { ok: false, error: "Coupon not found." };

    await prisma.coupon.update({
        where: { id },
        data: { active: !c.active },
    });

    revalidatePath("/admin/coupons");
    return { ok: true };
}