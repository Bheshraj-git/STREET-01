import { CategoryManager } from "@/components/admin/category-manager";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Categories" };

export default async function AdminCategoriesPage() {
    const categories = await prisma.category.findMany({
        orderBy: { sortOrder: "asc" },
        include: { _count: { select: { products: true } } },
    });

    const rows = categories.map((c) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        description: c.description,
        image: c.image,
        visible: c.visible,
        sortOrder: c.sortOrder,
        productCount: c._count.products,
    }));

    return (
        <div className="flex flex-col gap-6">
            <div>
                <p className="text-eyebrow text-muted-foreground">Manage</p>
                <h1 className="text-display mt-2 text-3xl">Categories</h1>
            </div>

            <CategoryManager categories={rows} />
        </div>
    );
}