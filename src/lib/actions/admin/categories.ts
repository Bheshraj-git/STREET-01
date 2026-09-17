"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/session";

export type ActionResult =
    | { ok: true }
    | { ok: false; error: string; field?: string };

const categoryInputSchema = z.object({
    name: z.string().trim().min(2, "Name required").max(60),
    slug: z
        .string()
        .trim()
        .min(2, "Slug required")
        .max(60)
        .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Lowercase letters, numbers, hyphens only"),
    description: z.string().trim().max(200).optional().or(z.literal("")),
    image: z.string().trim().url("Image must be a URL").optional().or(z.literal("")),
    visible: z.boolean().default(true),
    sortOrder: z.number().int().min(0).max(999).default(0),
});

export type CategoryInput = z.infer<typeof categoryInputSchema>;

export async function createCategory(input: CategoryInput): Promise<ActionResult> {
    await requireAdmin();

    const parsed = categoryInputSchema.safeParse(input);
    if (!parsed.success) {
        const i = parsed.error.issues[0];
        return { ok: false, error: i.message, field: String(i.path[0]) };
    }

    const clash = await prisma.category.findUnique({
        where: { slug: parsed.data.slug },
    });
    if (clash) return { ok: false, error: "Slug already in use.", field: "slug" };

    await prisma.category.create({
        data: {
            name: parsed.data.name,
            slug: parsed.data.slug,
            description: parsed.data.description || null,
            image: parsed.data.image || null,
            visible: parsed.data.visible,
            sortOrder: parsed.data.sortOrder,
        },
    });

    revalidatePath("/admin/categories");
    revalidatePath("/shop");
    return { ok: true };
}

export async function updateCategory(
    id: string,
    input: CategoryInput
): Promise<ActionResult> {
    await requireAdmin();

    const parsed = categoryInputSchema.safeParse(input);
    if (!parsed.success) {
        const i = parsed.error.issues[0];
        return { ok: false, error: i.message, field: String(i.path[0]) };
    }

    const clash = await prisma.category.findFirst({
        where: { slug: parsed.data.slug, NOT: { id } },
    });
    if (clash) return { ok: false, error: "Slug already in use.", field: "slug" };

    await prisma.category.update({
        where: { id },
        data: {
            name: parsed.data.name,
            slug: parsed.data.slug,
            description: parsed.data.description || null,
            image: parsed.data.image || null,
            visible: parsed.data.visible,
            sortOrder: parsed.data.sortOrder,
        },
    });

    revalidatePath("/admin/categories");
    revalidatePath("/shop");
    return { ok: true };
}

export async function deleteCategory(id: string): Promise<ActionResult> {
    await requireAdmin();

    const productCount = await prisma.product.count({
        where: { categoryId: id },
    });
    if (productCount > 0) {
        return {
            ok: false,
            error: `Cannot delete — ${productCount} product${productCount === 1 ? "" : "s"} use this category.`,
        };
    }

    await prisma.category.delete({ where: { id } });
    revalidatePath("/admin/categories");
    return { ok: true };
}

export async function toggleCategoryVisibility(id: string): Promise<ActionResult> {
    await requireAdmin();

    const cat = await prisma.category.findUnique({
        where: { id },
        select: { visible: true },
    });
    if (!cat) return { ok: false, error: "Category not found." };

    await prisma.category.update({
        where: { id },
        data: { visible: !cat.visible },
    });

    revalidatePath("/admin/categories");
    revalidatePath("/shop");
    return { ok: true };
}