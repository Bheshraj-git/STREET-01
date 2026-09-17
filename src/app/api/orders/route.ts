import { NextResponse } from "next/server";
import { createOrderSchema } from "@/lib/schemas/checkout";
import { createOrder, OrderError } from "@/lib/orders/create-order";

export async function POST(req: Request) {
    let json: unknown;
    try {
        json = await req.json();
    } catch {
        return NextResponse.json(
            { error: "Invalid request body." },
            { status: 400 }
        );
    }

    const parsed = createOrderSchema.safeParse(json);
    if (!parsed.success) {
        return NextResponse.json(
            { error: parsed.error.issues[0]?.message ?? "Invalid order data." },
            { status: 400 }
        );
    }

    try {
        const result = await createOrder(parsed.data);
        return NextResponse.json(result, { status: 201 });
    } catch (err) {
        if (err instanceof OrderError) {
            return NextResponse.json(
                { error: err.message, code: err.code },
                { status: 400 }
            );
        }
        console.error("[create-order]", err);
        return NextResponse.json(
            { error: "Something went wrong placing your order." },
            { status: 500 }
        );
    }
}