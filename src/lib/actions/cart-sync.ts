"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "../../../auth";

interface GuestCartItem {
    variantId: string;
    quantity: number;
}

interface GuestWishlistItem {
    productId: string;
}

export async function mergeGuestCart(items: GuestCartItem[]) {
    const session = await auth();
    if (!session?.user?.id) return { ok: false as const };

    if (items.length === 0) return { ok: true as const };

    const userId = session.user.id;

    // Find or create the user's cart
    const cart = await prisma.cart.upsert({
        where: { userId },
        update: {},
        create: { userId },
    });

    // Upsert each item (variant, quantity)
    for (const item of items) {
        const existing = await prisma.cartItem.findUnique({
            where: {
                cartId_variantId: { cartId: cart.id, variantId: item.variantId },
            },
        });

        if (existing) {
            await prisma.cartItem.update({
                where: { id: existing.id },
                data: { quantity: existing.quantity + item.quantity },
            });
        } else {
            await prisma.cartItem.create({
                data: {
                    cartId: cart.id,
                    variantId: item.variantId,
                    productId: (
                        await prisma.productVariant.findUniqueOrThrow({
                            where: { id: item.variantId },
                            select: { productId: true },
                        })
                    ).productId,
                    quantity: item.quantity,
                },
            });
        }
    }

    return { ok: true as const };
}

export async function mergeGuestWishlist(items: GuestWishlistItem[]) {
    const session = await auth();
    if (!session?.user?.id) return { ok: false as const };

    const userId = session.user.id;

    const wishlist = await prisma.wishlist.upsert({
        where: { userId },
        update: {},
        create: { userId },
    });

    for (const item of items) {
        try {
            await prisma.wishlistItem.create({
                data: {
                    wishlistId: wishlist.id,
                    productId: item.productId,
                },
            });
        } catch {
            // Already exists — ignore
        }
    }

    return { ok: true as const };
}