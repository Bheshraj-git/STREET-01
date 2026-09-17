import { ProductForm } from "@/components/admin/product-form";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "New product" };

export default async function NewProductPage() {
    const categories = await prisma.category.findMany({
        orderBy: { sortOrder: "asc" },
        select: { id: true, name: true },
    });

    return (
        <div className="flex flex-col gap-6">
            <div>
                <p className="text-eyebrow text-muted-foreground">Catalog</p>
                <h1 className="text-display mt-2 text-3xl">New product</h1>
            </div>

            <ProductForm
                mode="create"
                categories={categories}
            />
        </div>
    );
}