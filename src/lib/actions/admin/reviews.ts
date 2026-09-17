"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/session";

export type ActionResult =
    | { ok: true }
    | { ok: false; error: string };

export async function toggleReviewApproved(id: string): Promise<ActionResult> {
    await requireAdmin();

    const review = await prisma.review.findUnique({
        where: { id },
        select: { approved: true, product: { select: { slug: true } } },
    });
    if (!review) return { ok: false, error: "Review not found." };

    await prisma.review.update({
        where: { id },
        data: { approved: !review.approved },
    });

    revalidatePath("/admin/reviews");
    revalidatePath(`/products/${review.product.slug}`);
    return { ok: true };
}

export async function deleteReview(id: string): Promise<ActionResult> {
    await requireAdmin();

    const review = await prisma.review.findUnique({
        where: { id },
        select: { product: { select: { slug: true } } },
    });
    if (!review) return { ok: false, error: "Review not found." };

    await prisma.review.delete({ where: { id } });

    revalidatePath("/admin/reviews");
    revalidatePath(`/products/${review.product.slug}`);
    return { ok: true };
}