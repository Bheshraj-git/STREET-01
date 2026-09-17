import { NextResponse } from "next/server";
import { couponValidateSchema } from "@/lib/schemas/coupon";
import { validateCoupon } from "@/lib/coupons/validate-coupon";

export async function POST(req: Request) {
    let json: unknown;
    try {
        json = await req.json();
    } catch {
        return NextResponse.json(
            { valid: false, code: null, discount: 0, message: "Invalid request." },
            { status: 400 }
        );
    }

    const parsed = couponValidateSchema.safeParse(json);
    if (!parsed.success) {
        return NextResponse.json(
            {
                valid: false,
                code: null,
                discount: 0,
                message: parsed.error.issues[0]?.message ?? "Invalid coupon input.",
            },
            { status: 400 }
        );
    }

    const result = await validateCoupon(parsed.data.code, parsed.data.subtotal);
    return NextResponse.json(result, { status: 200 });
}