import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

const BASE_URL =
    process.env.NEXT_PUBLIC_APP_URL ?? "https://street01.example.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    // Static storefront routes
    const staticRoutes: MetadataRoute.Sitemap = [
        {
            url: BASE_URL,
            lastModified: new Date(),
            changeFrequency: "daily",
            priority: 1,
        },
        {
            url: `${BASE_URL}/shop`,
            lastModified: new Date(),
            changeFrequency: "daily",
            priority: 0.9,
        },
        {
            url: `${BASE_URL}/about`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.5,
        },
    ];

    // Dynamic product routes
    const products = await prisma.product.findMany({
        where: { published: true },
        select: { slug: true, updatedAt: true },
    });

    const productRoutes: MetadataRoute.Sitemap = products.map((p) => ({
        url: `${BASE_URL}/products/${p.slug}`,
        lastModified: p.updatedAt,
        changeFrequency: "weekly",
        priority: 0.8,
    }));

    // Dynamic category routes
    const categories = await prisma.category.findMany({
        where: { visible: true },
        select: { slug: true, updatedAt: true },
    });

    const categoryRoutes: MetadataRoute.Sitemap = categories.map((c) => ({
        url: `${BASE_URL}/shop?category=${c.slug}`,
        lastModified: c.updatedAt,
        changeFrequency: "weekly",
        priority: 0.7,
    }));

    return [...staticRoutes, ...productRoutes, ...categoryRoutes];
}