import Link from "next/link";
import Image from "next/image";
import { Plus } from "lucide-react";
import { DataTable, type Column } from "@/components/admin/data-table";
import { DeleteButton } from "@/components/admin/delete-button";
import { TogglePublishButton } from "@/components/admin/toggle-publish-button";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";

export const metadata = { title: "Products" };

interface PageProps {
    searchParams: Promise<{ q?: string; filter?: string }>;
}

interface Row {
    id: string;
    name: string;
    slug: string;
    price: number;
    categoryName: string;
    image: string | null;
    stock: number;
    published: boolean;
    featured: boolean;
}

export default async function AdminProductsPage({ searchParams }: PageProps) {
    const { q = "", filter = "all" } = await searchParams;

    const where: Record<string, unknown> = {};

    if (q.trim()) {
        where.OR = [
            { name: { contains: q, mode: "insensitive" } },
            { sku: { contains: q, mode: "insensitive" } },
            { slug: { contains: q, mode: "insensitive" } },
        ];
    }

    if (filter === "published") where.published = true;
    if (filter === "draft") where.published = false;
    if (filter === "featured") where.featured = true;

    const products = await prisma.product.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take: 100,
        include: {
            images: { orderBy: { sortOrder: "asc" }, take: 1 },
            variants: { select: { stock: true } },
            category: { select: { name: true } },
        },
    });

    const rows: Row[] = products.map((p) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        price: Number(p.price),
        categoryName: p.category.name,
        image: p.images[0]?.url ?? null,
        stock: p.variants.reduce((s, v) => s + v.stock, 0),
        published: p.published,
        featured: p.featured,
    }));

    const columns: Column<Row>[] = [
        {
            key: "product",
            header: "Product",
            render: (r) => (
                <div className="flex items-center gap-3">
                    <div className="relative h-12 w-10 flex-shrink-0 overflow-hidden bg-muted">
                        {r.image && (
                            <Image
                                src={r.image}
                                alt={r.name}
                                fill
                                sizes="40px"
                                className="object-cover"
                            />
                        )}
                    </div>
                    <div className="min-w-0">
                        <p className="truncate text-xs font-medium">{r.name}</p>
                        <p className="mt-0.5 truncate text-xs text-muted-foreground">
                            {r.categoryName}
                        </p>
                    </div>
                </div>
            ),
        },
        {
            key: "price",
            header: "Price",
            align: "right",
            render: (r) => <span className="text-xs">{formatPrice(r.price)}</span>,
        },
        {
            key: "stock",
            header: "Stock",
            align: "right",
            render: (r) => (
                <span
                    className={
                        r.stock === 0
                            ? "text-xs text-sale"
                            : r.stock <= 6
                                ? "text-xs text-accent"
                                : "text-xs"
                    }
                >
                    {r.stock}
                </span>
            ),
        },
        {
            key: "status",
            header: "Status",
            render: (r) => (
                <span
                    className={
                        r.published
                            ? "text-xs text-success"
                            : "text-xs text-muted-foreground"
                    }
                >
                    {r.published ? "Published" : "Draft"}
                </span>
            ),
        },
        {
            key: "actions",
            header: "",
            align: "right",
            render: (r) => (
                <div className="flex items-center justify-end gap-3">
                    <TogglePublishButton id={r.id} published={r.published} />
                    <Link
                        href={`/admin/products/${r.id}/edit`}
                        className="text-xs text-muted-foreground hover:text-foreground"
                    >
                        Edit
                    </Link>
                    <DeleteButton
                        id={r.id}
                        kind="product"
                        confirmMessage={`Delete "${r.name}"?`}
                    />
                </div>
            ),
        },
    ];

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-end justify-between gap-4">
                <div>
                    <p className="text-eyebrow text-muted-foreground">Manage</p>
                    <h1 className="text-display mt-2 text-3xl">Products</h1>
                </div>
                <Link
                    href="/admin/products/new"
                    className="inline-flex h-10 items-center gap-2 border border-foreground bg-foreground px-5 text-xs uppercase tracking-wider text-background transition-opacity hover:opacity-90"
                >
                    <Plus size={14} strokeWidth={2} />
                    New product
                </Link>
            </div>

            <form className="flex flex-wrap items-end gap-3">
                <div className="min-w-[200px] flex-1">
                    <label className="text-eyebrow mb-2 block text-muted-foreground">
                        Search
                    </label>
                    <input
                        name="q"
                        defaultValue={q}
                        placeholder="Name, SKU, slug"
                        className="h-10 w-full border border-border bg-background px-3 text-sm outline-none focus:border-foreground"
                    />
                </div>

                <div>
                    <label className="text-eyebrow mb-2 block text-muted-foreground">
                        Filter
                    </label>
                    <select
                        name="filter"
                        defaultValue={filter}
                        className="h-10 border border-border bg-background px-3 text-xs uppercase tracking-wider outline-none focus:border-foreground"
                    >
                        <option value="all">All</option>
                        <option value="published">Published</option>
                        <option value="draft">Draft</option>
                        <option value="featured">Featured</option>
                    </select>
                </div>

                <button
                    type="submit"
                    className="h-10 border border-foreground bg-foreground px-5 text-xs uppercase tracking-wider text-background transition-opacity hover:opacity-90"
                >
                    Apply
                </button>
            </form>

            <DataTable
                columns={columns}
                rows={rows}
                empty="No products match your filters."
            />
        </div>
    );
}