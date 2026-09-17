import { notFound } from "next/navigation";
import { ProductForm } from "@/components/admin/product-form";
import { prisma } from "@/lib/prisma";

interface PageProps {
    params: Promise<{ id: string }>;
}

export const metadata = { title: "Edit product" };

export default async function EditProductPage({ params }: PageProps) {
    const { id } = await params;

    const [categories, product] = await Promise.all([
        prisma.category.findMany({
            orderBy: { sortOrder: "asc" },
            select: { id: true, name: true },
        }),
        prisma.product.findUnique({
            where: { id },
            include: {
                images: { orderBy: { sortOrder: "asc" } },
                variants: { orderBy: [{ color: "asc" }, { size: "asc" }] },
            },
        }),
    ]);

    if (!product) notFound();

    const initialValues = {
        name: product.name,
        slug: product.slug,
        description: product.description,
        materials: product.materials ?? "",
        fit: product.fit ?? "",
        categoryId: product.categoryId,
        price: Number(product.price),
        compareAtPrice: product.compareAtPrice
            ? Number(product.compareAtPrice)
            : null,
        sku: product.sku,
        featured: product.featured,
        isNewArrival: product.isNewArrival,
        published: product.published,
        imageUrls: product.images.map((i) => i.url),
        variants: product.variants.map((v) => ({
            id: v.id,
            color: v.color,
            colorHex: v.colorHex,
            size: v.size,
            stock: v.stock,
            sku: v.sku,
        })),
    };

    return (
        <div className="flex flex-col gap-6">
            <div>
                <p className="text-eyebrow text-muted-foreground">Catalog</p>
                <h1 className="text-display mt-2 text-3xl">{product.name}</h1>
            </div>

            <ProductForm
                mode="edit"
                productId={product.id}
                categories={categories}
                initialValues={initialValues}
            />
        </div>
    );
}