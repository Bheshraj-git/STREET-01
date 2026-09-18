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

export interface ShopFilterParams {
    category?: string;
    sort?: "newest" | "price-asc" | "price-desc" | "rating" | "featured";
    search?: string;
    minPrice?: number;
    maxPrice?: number;
}

export async function getShopProducts(params: ShopFilterParams = {}): Promise<ProductCardData[]> {
    const { category, sort = "newest", search, minPrice, maxPrice } = params;

    const where: Record<string, unknown> = {
        published: true,
    };

    if (category) {
        where.category = {
            slug: category,
        };
    }

    if (search) {
        where.OR = [
            { name: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
        ];
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
        const priceFilter: { gte?: number; lte?: number } = {};
        if (minPrice !== undefined) priceFilter.gte = minPrice;
        if (maxPrice !== undefined) priceFilter.lte = maxPrice;
        where.price = priceFilter;
    }

    let orderBy: Record<string, unknown> = { createdAt: "desc" };
    if (sort === "newest") {
        orderBy = { createdAt: "desc" };
    } else if (sort === "price-asc") {
        orderBy = { price: "asc" };
    } else if (sort === "price-desc") {
        orderBy = { price: "desc" };
    } else if (sort === "featured") {
        orderBy = { featured: "desc" };
    } else if (sort === "rating") {
        orderBy = { reviews: { _count: "desc" } };
    }

    const rows = await prisma.product.findMany({
        where,
        include: productCardInclude,
        orderBy,
    });

    return rows.map(normalize);
}

export async function getCollectionsWithStats() {
    const categories = await prisma.category.findMany({
        where: { visible: true },
        orderBy: { sortOrder: "asc" },
        include: {
            products: {
                where: { published: true },
                include: {
                    images: { orderBy: { sortOrder: "asc" }, take: 1 },
                },
                take: 1,
            },
            _count: {
                select: {
                    products: {
                        where: { published: true },
                    },
                },
            },
        },
    });

    return categories.map((cat) => ({
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        productCount: cat._count.products,
        coverImage: cat.image || cat.products[0]?.images[0]?.url || null,
    }));
}