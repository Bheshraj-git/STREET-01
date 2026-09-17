import { Container } from "@/components/ui/container";
import { ProductGrid } from "@/components/product/product-grid";
import { getRelatedProducts } from "@/lib/queries/product-by-slug";

export async function RelatedProducts({
    categoryId,
    excludeProductId,
}: {
    categoryId: string;
    excludeProductId: string;
}) {
    const products = await getRelatedProducts(categoryId, excludeProductId, 4);
    if (products.length === 0) return null;

    return (
        <section className="border-t border-border">
            <Container className="py-16 md:py-24">
                <div className="mb-10 md:mb-14">
                    <p className="text-eyebrow text-muted-foreground">More like this</p>
                    <h2 className="text-display mt-3 text-3xl md:text-5xl">
                        Related Products
                    </h2>
                </div>
                <ProductGrid products={products} columns={4} />
            </Container>
        </section>
    );
}