import { prisma } from "@/lib/prisma";

const productCardInclude = {
    images: { orderBy: { sortOrder: "asc" as const }, take: 2 },
    variants: { select: { color: true, colorHex: true, stock: true } },
    reviews: { select: { rating: true } },
    category: { select: { name: true, slug: true } },
};

// Raw shape returned by Prisma
type RawProduct = Awaited<
    ReturnType<
        typeof prisma.product.findMany<{
            include: typeof productCardInclude;
        }>
    >
>[number];

// Shape we actually pass to Client Components — all plain values
export interface ProductCardData {
    id: string;
    name: string;
    slug: string;
    description: string;
    categoryId: string;
    price: number;
    compareAtPrice: number | null;
    featured: boolean;
    isNewArrival: boolean;
    images: { url: string; alt: string | null }[];
    variants: { color: string; colorHex: string; stock: number }[];
    reviews: { rating: number }[];
    category: { name: string; slug: string };
}

function normalize(p: RawProduct): ProductCardData {
    return {
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
    };
}

export async function getNewArrivals(limit = 8): Promise<ProductCardData[]> {
    const rows = await prisma.product.findMany({
        where: { published: true, isNewArrival: true },
        include: productCardInclude,
        orderBy: { createdAt: "desc" },
        take: limit,
    });
    return rows.map(normalize);
}

export async function getTrending(limit = 4): Promise<ProductCardData[]> {
    const rows = await prisma.product.findMany({
        where: { published: true },
        include: productCardInclude,
        orderBy: { reviews: { _count: "desc" } },
        take: limit,
    });
    return rows.map(normalize);
}

export async function getCategories() {
    return prisma.category.findMany({
        where: { visible: true },
        orderBy: { sortOrder: "asc" },
    });
}