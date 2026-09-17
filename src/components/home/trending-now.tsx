import Link from "next/link";
import { Container } from "@/components/ui/container";
import { ProductGrid } from "@/components/product/product-grid";
import { getTrending } from "@/lib/queries/products";

export async function TrendingNow() {
    const products = await getTrending(4);

    if (products.length === 0) return null;

    return (
        <section className="border-t border-border bg-muted/40">
            <Container className="py-16 md:py-24">
                <div className="mb-10 flex items-end justify-between md:mb-14">
                    <div>
                        <p className="text-eyebrow text-muted-foreground">What people wear</p>
                        <h2 className="text-display mt-3 text-4xl md:text-6xl">
                            Trending Now
                        </h2>
                    </div>
                    <Link
                        href="/shop?sort=popular"
                        className="text-eyebrow hidden text-muted-foreground transition-colors hover:text-foreground md:block"
                    >
                        View all →
                    </Link>
                </div>

                <ProductGrid products={products} columns={4} />
            </Container>
        </section>
    );
}