import { z } from "zod";

export const couponValidateSchema = z.object({
    code: z
        .string()
        .trim()
        .min(1, "Enter a coupon code")
        .max(32, "Coupon code too long")
        .transform((v) => v.toUpperCase()),
    subtotal: z.number().nonnegative(),
});

export type CouponValidateInput = z.infer<typeof couponValidateSchema>;

export interface CouponValidateResult {
    valid: boolean;
    code: string | null;
    discount: number;
    message: string;
}