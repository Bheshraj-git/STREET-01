import { ProductCard } from "@/components/product/product-card";
import type { ProductCardData } from "@/lib/queries/products";

export function ProductGrid({
    products,
    columns = 4,
}: {
    products: ProductCardData[];
    columns?: 2 | 3 | 4;
}) {
    const colClasses = {
        2: "grid-cols-1 sm:grid-cols-2",
        3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
        4: "grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
    }[columns];

    return (
        <div className={`grid gap-x-4 gap-y-10 md:gap-x-6 ${colClasses}`}>
            {products.map((p) => (
                <ProductCard key={p.id} product={p} />
            ))}
        </div>
    );
}