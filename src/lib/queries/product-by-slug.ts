import { prisma } from "@/lib/prisma";

const detailInclude = {
    images: { orderBy: { sortOrder: "asc" as const } },
    variants: {
        select: {
            id: true,
            color: true,
            colorHex: true,
            size: true,
            stock: true,
            sku: true,
        },
    },
    reviews: {
        where: { approved: true },
        orderBy: { createdAt: "desc" as const },
        include: {
            user: { select: { name: true, image: true } },
        },
    },
    category: { select: { id: true, name: true, slug: true } },
};

export interface ProductDetail {
    id: string;
    name: string;
    slug: string;
    description: string;
    materials: string | null;
    fit: string | null;
    sku: string;
    price: number;
    compareAtPrice: number | null;
    featured: boolean;
    isNewArrival: boolean;
    category: { id: string; name: string; slug: string };
    images: { id: string; url: string; alt: string | null }[];
    variants: {
        id: string;
        color: string;
        colorHex: string;
        size: string;
        stock: number;
        sku: string;
    }[];
    reviews: {
        id: string;
        rating: number;
        title: string | null;
        body: string;
        createdAt: string;
        user: { name: string | null; image: string | null };
    }[];
    ratingAverage: number;
    ratingCount: number;
}

export async function getProductBySlug(
    slug: string
): Promise<ProductDetail | null> {
    const row = await prisma.product.findUnique({
        where: { slug },
        include: detailInclude,
    });

    if (!row || !row.published) return null;

    const ratingCount = row.reviews.length;
    const ratingAverage =
        ratingCount > 0
            ? row.reviews.reduce((s, r) => s + r.rating, 0) / ratingCount
            : 0;

    return {
        id: row.id,
        name: row.name,
        slug: row.slug,
        description: row.description,
        materials: row.materials,
        fit: row.fit,
        sku: row.sku,
        price: Number(row.price),
        compareAtPrice: row.compareAtPrice ? Number(row.compareAtPrice) : null,
        featured: row.featured,
        isNewArrival: row.isNewArrival,
        category: row.category,
        images: row.images.map((i) => ({
            id: i.id,
            url: i.url,
            alt: i.alt,
        })),
        variants: row.variants,
        reviews: row.reviews.map((r) => ({
            id: r.id,
            rating: r.rating,
            title: r.title,
            body: r.body,
            createdAt: r.createdAt.toISOString(),
            user: { name: r.user.name, image: r.user.image },
        })),
        ratingAverage,
        ratingCount,
    };
}

export async function getRelatedProducts(
    categoryId: string,
    excludeProductId: string,
    limit = 4
) {
    const rows = await prisma.product.findMany({
        where: {
            categoryId,
            published: true,
            id: { not: excludeProductId },
        },
        include: {
            images: { orderBy: { sortOrder: "asc" }, take: 2 },
            variants: { select: { color: true, colorHex: true, stock: true } },
            reviews: { select: { rating: true } },
            category: { select: { name: true, slug: true } },
        },
        orderBy: { createdAt: "desc" },
        take: limit,
    });

    return rows.map((p) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        description: p.description,
        categoryId: p.categoryId,
        price: Number(p.price),
        compareAtPrice: p.compareAtPrice ? Number(p.compareAtPrice) : null,
        featured: p.featured,
        isNewArrival: p.isNewArrival,
        images: p.images.map((i) => ({ url: i.url, alt: i.alt })),
        variants: p.variants.map((v) => ({
            color: v.color,
            colorHex: v.colorHex,
            stock: v.stock,
        })),
        reviews: p.reviews.map((r) => ({ rating: r.rating })),
        category: { name: p.category.name, slug: p.category.slug },
    }));
}