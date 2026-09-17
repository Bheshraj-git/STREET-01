import type { MetadataRoute } from "next";

const BASE_URL =
    process.env.NEXT_PUBLIC_APP_URL ?? "https://street01.example.com";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: "*",
                allow: "/",
                disallow: [
                    "/admin",
                    "/admin/",
                    "/account",
                    "/account/",
                    "/api/",
                    "/checkout",
                    "/cart",
                ],
            },
        ],
        sitemap: `${BASE_URL}/sitemap.xml`,
        host: BASE_URL,
    };
}