import "server-only";
import { prisma } from "@/lib/prisma";
import { validateCoupon } from "@/lib/coupons/validate-coupon";
import type { CreateOrderInput } from "@/lib/schemas/checkout";
import { auth } from "../../../auth";

const FREE_SHIPPING_THRESHOLD = 5000;
const STANDARD_SHIPPING = 200;

export interface CreatedOrder {
    orderNumber: string;
}

export class OrderError extends Error {
    constructor(
        message: string,
        public readonly code:
            | "EMPTY_CART"
            | "VARIANT_NOT_FOUND"
            | "OUT_OF_STOCK"
            | "COUPON_INVALID"
    ) {
        super(message);
        this.name = "OrderError";
    }
}

function generateOrderNumber(): string {
    const year = new Date().getFullYear();
    const rand = Math.floor(Math.random() * 900000) + 100000;
    return `SW-${year}-${rand}`;
}

export async function createOrder(
    input: CreateOrderInput
): Promise<CreatedOrder> {
    if (input.items.length === 0) {
        throw new OrderError("Your cart is empty.", "EMPTY_CART");
    }

    return prisma.$transaction(async (tx) => {
        // 1. Re-fetch each variant with its product from the DB — never trust prices from the client.
        const variantIds = input.items.map((i) => i.variantId);
        const variants = await tx.productVariant.findMany({
            where: { id: { in: variantIds } },
            include: {
                product: {
                    include: {
                        images: { orderBy: { sortOrder: "asc" }, take: 1 },
                    },
                },
            },
        });

        const variantMap = new Map(variants.map((v) => [v.id, v]));

        // 2. Build line items, verifying stock.
        const orderItems: {
            productId: string;
            variantId: string;
            productName: string;
            color: string;
            size: string;
            image: string | null;
            quantity: number;
            unitPrice: number;
            total: number;
        }[] = [];

        for (const item of input.items) {
            const variant = variantMap.get(item.variantId);

            if (!variant) {
                throw new OrderError(
                    "One of the items in your bag is no longer available.",
                    "VARIANT_NOT_FOUND"
                );
            }

            if (variant.stock < item.quantity) {
                throw new OrderError(
                    `${variant.product.name} (${variant.color} · ${variant.size}) only has ${variant.stock} left.`,
                    "OUT_OF_STOCK"
                );
            }

            const unitPrice = Number(variant.product.price);

            orderItems.push({
                productId: variant.productId,
                variantId: variant.id,
                productName: variant.product.name,
                color: variant.color,
                size: variant.size,
                image: variant.product.images[0]?.url ?? null,
                quantity: item.quantity,
                unitPrice,
                total: unitPrice * item.quantity,
            });
        }

        // 3. Compute subtotal and coupon discount on the server.
        const subtotal = orderItems.reduce((s, i) => s + i.total, 0);

        let discount = 0;
        let appliedCoupon: string | null = null;

        if (input.couponCode) {
            const result = await validateCoupon(input.couponCode, subtotal);
            if (!result.valid) {
                throw new OrderError(
                    result.message ?? "Coupon is no longer valid.",
                    "COUPON_INVALID"
                );
            }
            discount = result.discount;
            appliedCoupon = result.code;
        }

        const shippingCost =
            subtotal - discount >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING;
        const tax = 0;
        const total = subtotal - discount + shippingCost + tax;

        // 4. Generate a unique order number.
        let orderNumber = generateOrderNumber();
        // Retry on the (very unlikely) collision.
        // eslint-disable-next-line no-constant-condition
        while (true) {
            const clash = await tx.order.findUnique({ where: { orderNumber } });
            if (!clash) break;
            orderNumber = generateOrderNumber();
        }

        // 5. Create the order.
        const session = await auth();
        const sessionUserId = session?.user?.id ?? null;

        const order = await tx.order.create({
            data: {
                orderNumber,
                userId: sessionUserId,
                email: input.contact.email,
                phone: input.contact.phone,
                customerName: input.contact.fullName,
                shippingAddress: {
                    fullName: input.contact.fullName,
                    line1: input.shipping.line1,
                    line2: input.shipping.line2 || null,
                    city: input.shipping.city,
                    state: input.shipping.state,
                    postalCode: input.shipping.postalCode,
                    country: input.shipping.country,
                },
                subtotal,
                discount,
                shippingCost,
                tax,
                total,
                couponCode: appliedCoupon,
                paymentStatus: "PAID",
                orderStatus: "CONFIRMED",
                items: {
                    create: orderItems,
                },
            },
        });

        // Save the shipping address for logged-in users (if not already present)
        if (sessionUserId) {
            const existing = await tx.address.findFirst({
                where: {
                    userId: sessionUserId,
                    line1: input.shipping.line1,
                    postalCode: input.shipping.postalCode,
                },
            });

            if (!existing) {
                await tx.address.create({
                    data: {
                        userId: sessionUserId,
                        label: null,
                        fullName: input.contact.fullName,
                        phone: input.contact.phone,
                        line1: input.shipping.line1,
                        line2: input.shipping.line2 || null,
                        city: input.shipping.city,
                        state: input.shipping.state,
                        postalCode: input.shipping.postalCode,
                        country: input.shipping.country,
                        isDefault: false,
                    },
                });
            }
        }

        // 6. Decrement variant stock.
        for (const item of input.items) {
            await tx.productVariant.update({
                where: { id: item.variantId },
                data: { stock: { decrement: item.quantity } },
            });
        }

        // 7. Increment coupon usage.
        if (appliedCoupon) {
            await tx.coupon.update({
                where: { code: appliedCoupon },
                data: { usedCount: { increment: 1 } },
            });
        }

        return { orderNumber: order.orderNumber };
    });
}