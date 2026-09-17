import Link from "next/link";
import { Container } from "@/components/ui/container";
import { ProductGrid } from "@/components/product/product-grid";
import { getNewArrivals } from "@/lib/queries/products";

export async function NewArrivals() {
    const products = await getNewArrivals(8);

    if (products.length === 0) return null;

    return (
        <section className="border-t border-border">
            <Container className="py-16 md:py-24">
                <div className="mb-10 flex items-end justify-between md:mb-14">
                    <div>
                        <p className="text-eyebrow text-muted-foreground">Just dropped</p>
                        <h2 className="text-display mt-3 text-4xl md:text-6xl">
                            New Arrivals
                        </h2>
                    </div>
                    <Link
                        href="/shop?sort=newest"
                        className="text-eyebrow hidden text-muted-foreground transition-colors hover:text-foreground md:block"
                    >
                        View all →
                    </Link>
                </div>

                <ProductGrid products={products} columns={4} />

                <div className="mt-10 text-center md:hidden">
                    <Link
                        href="/shop?sort=newest"
                        className="text-eyebrow text-muted-foreground"
                    >
                        View all →
                    </Link>
                </div>
            </Container>
        </section>
    );
}