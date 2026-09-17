import "server-only";
import { prisma } from "@/lib/prisma";
import type { CouponValidateResult } from "@/lib/schemas/coupon";

export async function validateCoupon(
    rawCode: string,
    subtotal: number
): Promise<CouponValidateResult> {
    const code = rawCode.trim().toUpperCase();

    if (!code) {
        return { valid: false, code: null, discount: 0, message: "Enter a code." };
    }

    const coupon = await prisma.coupon.findUnique({ where: { code } });

    if (!coupon) {
        return {
            valid: false,
            code: null,
            discount: 0,
            message: `"${code}" is not a valid coupon.`,
        };
    }

    if (!coupon.active) {
        return {
            valid: false,
            code: null,
            discount: 0,
            message: "This coupon is no longer active.",
        };
    }

    const now = new Date();
    if (coupon.startsAt && coupon.startsAt > now) {
        return {
            valid: false,
            code: null,
            discount: 0,
            message: "This coupon isn't active yet.",
        };
    }

    if (coupon.expiresAt && coupon.expiresAt < now) {
        return {
            valid: false,
            code: null,
            discount: 0,
            message: "This coupon has expired.",
        };
    }

    if (coupon.maxUses !== null && coupon.usedCount >= coupon.maxUses) {
        return {
            valid: false,
            code: null,
            discount: 0,
            message: "This coupon has reached its usage limit.",
        };
    }

    const minOrder = coupon.minOrderAmount ? Number(coupon.minOrderAmount) : 0;
    if (subtotal < minOrder) {
        return {
            valid: false,
            code: null,
            discount: 0,
            message: `Minimum order of Rs. ${minOrder.toLocaleString()} required.`,
        };
    }

    const value = Number(coupon.discountValue);
    let discount = 0;

    if (coupon.discountType === "PERCENTAGE") {
        discount = Math.round((subtotal * value) / 100);
    } else {
        discount = value;
    }

    // Never exceed the subtotal
    discount = Math.min(discount, subtotal);

    return {
        valid: true,
        code: coupon.code,
        discount,
        message: `${coupon.code} applied.`,
    };
}