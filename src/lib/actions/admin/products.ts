"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/session";

export type ActionResult =
    | { ok: true; id?: string }
    | { ok: false; error: string; field?: string };

const variantInputSchema = z.object({
    id: z.string().optional(),
    color: z.string().trim().min(1, "Color required").max(40),
    colorHex: z
        .string()
        .trim()
        .regex(/^#[0-9a-fA-F]{6}$/, "Hex must look like #RRGGBB"),
    size: z.string().trim().min(1, "Size required").max(10),
    stock: z.number().int().min(0).max(100000),
    sku: z.string().trim().min(1).max(80),
});

const productInputSchema = z.object({
    name: z.string().trim().min(2, "Name required").max(120),
    slug: z
        .string()
        .trim()
        .min(2, "Slug required")
        .max(120)
        .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase with hyphens"),
    description: z.string().trim().min(10, "Description required"),
    materials: z.string().trim().max(200).optional().or(z.literal("")),
    fit: z.string().trim().max(200).optional().or(z.literal("")),
    categoryId: z.string().min(1, "Select a category"),
    price: z.number().positive("Price must be positive"),
    compareAtPrice: z.number().positive().nullable().optional(),
    sku: z.string().trim().min(1, "SKU required").max(80),
    featured: z.boolean().default(false),
    isNewArrival: z.boolean().default(false),
    published: z.boolean().default(true),
    imageUrls: z.array(z.string().url("Each image must be a valid URL")).min(1, "At least one image"),
    variants: z.array(variantInputSchema).min(1, "At least one variant"),
});

export type ProductInput = z.infer<typeof productInputSchema>;
export type VariantInput = z.infer<typeof variantInputSchema>;

export async function createProduct(input: ProductInput): Promise<ActionResult> {
    await requireAdmin();

    const parsed = productInputSchema.safeParse(input);
    if (!parsed.success) {
        const i = parsed.error.issues[0];
        return { ok: false, error: i.message, field: String(i.path[0]) };
    }
    const data = parsed.data;

    const existingSlug = await prisma.product.findUnique({
        where: { slug: data.slug },
    });
    if (existingSlug) {
        return { ok: false, error: "Slug already in use.", field: "slug" };
    }

    const existingSku = await prisma.product.findUnique({
        where: { sku: data.sku },
    });
    if (existingSku) {
        return { ok: false, error: "SKU already in use.", field: "sku" };
    }

    try {
        const product = await prisma.product.create({
            data: {
                name: data.name,
                slug: data.slug,
                description: data.description,
                materials: data.materials || null,
                fit: data.fit || null,
                categoryId: data.categoryId,
                price: data.price,
                compareAtPrice: data.compareAtPrice ?? null,
                sku: data.sku,
                featured: data.featured,
                isNewArrival: data.isNewArrival,
                published: data.published,
                images: {
                    create: data.imageUrls.map((url, i) => ({
                        url,
                        alt: `${data.name} — view ${i + 1}`,
                        sortOrder: i,
                    })),
                },
                variants: {
                    create: data.variants.map((v) => ({
                        color: v.color,
                        colorHex: v.colorHex,
                        size: v.size,
                        stock: v.stock,
                        sku: v.sku,
                    })),
                },
            },
        });

        revalidatePath("/admin/products");
        revalidatePath("/shop");
        return { ok: true, id: product.id };
    } catch (e) {
        const msg = e instanceof Error ? e.message : "Could not create product.";
        return { ok: false, error: msg };
    }
}

export async function updateProduct(
    id: string,
    input: ProductInput
): Promise<ActionResult> {
    await requireAdmin();

    const parsed = productInputSchema.safeParse(input);
    if (!parsed.success) {
        const i = parsed.error.issues[0];
        return { ok: false, error: i.message, field: String(i.path[0]) };
    }
    const data = parsed.data;

    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) return { ok: false, error: "Product not found." };

    const slugClash = await prisma.product.findFirst({
        where: { slug: data.slug, NOT: { id } },
    });
    if (slugClash) return { ok: false, error: "Slug already in use.", field: "slug" };

    const skuClash = await prisma.product.findFirst({
        where: { sku: data.sku, NOT: { id } },
    });
    if (skuClash) return { ok: false, error: "SKU already in use.", field: "sku" };

    try {
        await prisma.$transaction(async (tx) => {
            // Update the base product
            await tx.product.update({
                where: { id },
                data: {
                    name: data.name,
                    slug: data.slug,
                    description: data.description,
                    materials: data.materials || null,
                    fit: data.fit || null,
                    categoryId: data.categoryId,
                    price: data.price,
                    compareAtPrice: data.compareAtPrice ?? null,
                    sku: data.sku,
                    featured: data.featured,
                    isNewArrival: data.isNewArrival,
                    published: data.published,
                },
            });

            // Replace images (simpler than diffing)
            await tx.productImage.deleteMany({ where: { productId: id } });
            await tx.productImage.createMany({
                data: data.imageUrls.map((url, i) => ({
                    productId: id,
                    url,
                    alt: `${data.name} — view ${i + 1}`,
                    sortOrder: i,
                })),
            });

            // Handle variants: update existing, create new, delete removed
            const existingVariants = await tx.productVariant.findMany({
                where: { productId: id },
                select: { id: true },
            });
            const incomingIds = new Set(
                data.variants.filter((v) => v.id).map((v) => v.id as string)
            );
            const toDelete = existingVariants
                .filter((v) => !incomingIds.has(v.id))
                .map((v) => v.id);

            // Only delete variants that have no orders (safety)
            for (const delId of toDelete) {
                const inUse = await tx.orderItem.findFirst({
                    where: { variantId: delId },
                });
                if (inUse) {
                    // Soft-handle: set stock to 0 instead of deleting
                    await tx.productVariant.update({
                        where: { id: delId },
                        data: { stock: 0 },
                    });
                } else {
                    await tx.productVariant.delete({ where: { id: delId } });
                }
            }

            for (const v of data.variants) {
                if (v.id) {
                    await tx.productVariant.update({
                        where: { id: v.id },
                        data: {
                            color: v.color,
                            colorHex: v.colorHex,
                            size: v.size,
                            stock: v.stock,
                            sku: v.sku,
                        },
                    });
                } else {
                    await tx.productVariant.create({
                        data: {
                            productId: id,
                            color: v.color,
                            colorHex: v.colorHex,
                            size: v.size,
                            stock: v.stock,
                            sku: v.sku,
                        },
                    });
                }
            }
        });

        revalidatePath("/admin/products");
        revalidatePath(`/admin/products/${id}/edit`);
        revalidatePath("/shop");
        revalidatePath(`/products/${data.slug}`);
        return { ok: true, id };
    } catch (e) {
        const msg = e instanceof Error ? e.message : "Could not update product.";
        return { ok: false, error: msg };
    }
}

export async function deleteProduct(id: string): Promise<ActionResult> {
    await requireAdmin();

    const inOrders = await prisma.orderItem.findFirst({ where: { productId: id } });
    if (inOrders) {
        // Safer: unpublish instead of deleting
        await prisma.product.update({
            where: { id },
            data: { published: false },
        });
        revalidatePath("/admin/products");
        return { ok: true, id };
    }

    await prisma.product.delete({ where: { id } });
    revalidatePath("/admin/products");
    return { ok: true, id };
}

export async function togglePublish(id: string): Promise<ActionResult> {
    await requireAdmin();

    const product = await prisma.product.findUnique({
        where: { id },
        select: { published: true },
    });
    if (!product) return { ok: false, error: "Product not found." };

    await prisma.product.update({
        where: { id },
        data: { published: !product.published },
    });

    revalidatePath("/admin/products");
    revalidatePath("/shop");
    return { ok: true, id };
}