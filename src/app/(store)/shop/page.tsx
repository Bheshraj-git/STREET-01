import { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { ProductGrid } from "@/components/product/product-grid";
import {
    getShopProducts,
    getCategories,
    type ShopFilterParams,
} from "@/lib/queries/products";
import { ArrowUpDown, SlidersHorizontal, X } from "lucide-react";

export const metadata: Metadata = {
    title: "Shop All Products · STREET/01",
    description: "Browse the complete STREET/01 collection of heavyweight hoodies, tees, outerwear, pants, and accessories.",
};

interface ShopPageProps {
    searchParams: Promise<{
        category?: string;
        sort?: string;
        search?: string;
        minPrice?: string;
        maxPrice?: string;
    }>;
}

const SORT_OPTIONS = [
    { value: "newest", label: "Newest Drops" },
    { value: "featured", label: "Featured" },
    { value: "price-asc", label: "Price: Low to High" },
    { value: "price-desc", label: "Price: High to Low" },
    { value: "rating", label: "Top Rated" },
];

export default async function ShopPage({ searchParams }: ShopPageProps) {
    const params = await searchParams;
    const activeCategory = params.category;
    const activeSort = (params.sort as ShopFilterParams["sort"]) || "newest";
    const searchQuery = params.search;

    const [categories, products] = await Promise.all([
        getCategories(),
        getShopProducts({
            category: activeCategory,
            sort: activeSort,
            search: searchQuery,
            minPrice: params.minPrice ? Number(params.minPrice) : undefined,
            maxPrice: params.maxPrice ? Number(params.maxPrice) : undefined,
        }),
    ]);

    const activeCategoryObj = categories.find((c) => c.slug === activeCategory);

    // Dynamic Title
    let pageTitle = "Shop All";
    let pageSubtitle = "Engineered for the streets. Minimalist silhouette, heavyweight comfort.";

    if (activeSort === "newest" && !activeCategory && !searchQuery) {
        pageTitle = "New Arrivals";
        pageSubtitle = "The latest drops, experimental washes, and seasonal cuts.";
    } else if (activeCategoryObj) {
        pageTitle = activeCategoryObj.name;
        pageSubtitle = activeCategoryObj.description || `Explore our latest ${activeCategoryObj.name.toLowerCase()} releases.`;
    } else if (searchQuery) {
        pageTitle = `Search: "${searchQuery}"`;
        pageSubtitle = `Showing search results for "${searchQuery}".`;
    }

    const hasActiveFilters = !!(activeCategory || searchQuery || (activeSort && activeSort !== "newest"));

    return (
        <div className="py-10 md:py-16">
            <Container>
                {/* Header */}
                <div className="mb-10 border-b border-border pb-8 md:mb-12">
                    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
                        <div>
                            <p className="text-eyebrow mb-2 text-muted-foreground">Catalog</p>
                            <h1 className="text-display text-4xl uppercase tracking-tight md:text-5xl lg:text-6xl">
                                {pageTitle}
                            </h1>
                            <p className="mt-2 max-w-xl text-sm text-muted-foreground md:text-base">
                                {pageSubtitle}
                            </p>
                        </div>
                        <div className="text-xs uppercase tracking-wider text-muted-foreground">
                            {products.length} {products.length === 1 ? "Product" : "Products"} Available
                        </div>
                    </div>
                </div>

                {/* Filters & Sorting Bar */}
                <div className="mb-10 flex flex-col gap-5 border-b border-border pb-6 lg:flex-row lg:items-center lg:justify-between">
                    {/* Category Pills */}
                    <div className="flex flex-wrap items-center gap-2">
                        <Link
                            href={activeSort ? `/shop?sort=${activeSort}` : "/shop"}
                            className={`rounded-full px-4 py-1.5 text-xs font-medium uppercase tracking-wider transition-colors ${
                                !activeCategory
                                    ? "bg-foreground text-background"
                                    : "border border-border bg-background text-muted-foreground hover:border-foreground hover:text-foreground"
                            }`}
                        >
                            All
                        </Link>
                        {categories.map((cat) => {
                            const isSelected = activeCategory === cat.slug;
                            const href = isSelected
                                ? `/shop${activeSort ? `?sort=${activeSort}` : ""}`
                                : `/shop?category=${cat.slug}${activeSort ? `&sort=${activeSort}` : ""}`;

                            return (
                                <Link
                                    key={cat.id}
                                    href={href}
                                    className={`rounded-full px-4 py-1.5 text-xs font-medium uppercase tracking-wider transition-colors ${
                                        isSelected
                                            ? "bg-foreground text-background"
                                            : "border border-border bg-background text-muted-foreground hover:border-foreground hover:text-foreground"
                                    }`}
                                >
                                    {cat.name}
                                </Link>
                            );
                        })}
                    </div>

                    {/* Sorting Controls */}
                    <div className="flex flex-wrap items-center gap-4">
                        <div className="flex items-center gap-2">
                            <ArrowUpDown size={14} className="text-muted-foreground" />
                            <span className="text-xs uppercase tracking-wider text-muted-foreground">
                                Sort:
                            </span>
                            <div className="flex flex-wrap gap-1">
                                {SORT_OPTIONS.map((opt) => {
                                    const isSelected = activeSort === opt.value;
                                    const paramsObj = new URLSearchParams();
                                    if (activeCategory) paramsObj.set("category", activeCategory);
                                    if (searchQuery) paramsObj.set("search", searchQuery);
                                    paramsObj.set("sort", opt.value);

                                    return (
                                        <Link
                                            key={opt.value}
                                            href={`/shop?${paramsObj.toString()}`}
                                            className={`px-2.5 py-1 text-xs transition-colors ${
                                                isSelected
                                                    ? "font-medium text-foreground underline underline-offset-4"
                                                    : "text-muted-foreground hover:text-foreground"
                                            }`}
                                        >
                                            {opt.label}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>

                        {hasActiveFilters && (
                            <Link
                                href="/shop"
                                className="inline-flex items-center gap-1 rounded-md border border-border px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:border-sale hover:text-sale"
                            >
                                <X size={12} />
                                Reset
                            </Link>
                        )}
                    </div>
                </div>

                {/* Product Grid or Empty State */}
                {products.length > 0 ? (
                    <ProductGrid products={products} columns={4} />
                ) : (
                    <div className="flex min-h-[320px] flex-col items-center justify-center border border-dashed border-border p-12 text-center">
                        <SlidersHorizontal size={36} className="mb-4 text-muted-foreground" />
                        <h2 className="text-display text-xl uppercase">No products match your criteria</h2>
                        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                            Try adjusting your filters or search query to find what you are looking for.
                        </p>
                        <Link
                            href="/shop"
                            className="mt-6 inline-flex items-center gap-2 bg-foreground px-5 py-2.5 text-xs font-medium uppercase tracking-wider text-background transition-opacity hover:opacity-90"
                        >
                            Reset all filters
                        </Link>
                    </div>
                )}
            </Container>
        </div>
    );
}
