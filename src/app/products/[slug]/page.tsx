import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/container";
import { ProductGallery } from "@/components/product/product-gallery";
import { AddToCartForm } from "@/components/product/add-to-cart-form";
import { ProductReviews } from "@/components/product/product-reviews";
import { RelatedProducts } from "@/components/product/related-products";
import { RecentlyViewedTracker } from "@/components/product/recently-viewed-tracker";
import { RecentlyViewedStrip } from "@/components/product/recently-viewed-strip";
import { getProductBySlug } from "@/lib/queries/product-by-slug";

interface PageProps {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({
    params,
}: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const product = await getProductBySlug(slug);
    if (!product) return { title: "Product not found" };

    return {
        title: product.name,
        description: product.description.slice(0, 160),
        openGraph: {
            title: product.name,
            description: product.description.slice(0, 160),
            images: product.images[0]?.url ? [product.images[0].url] : [],
        },
    };
}

export default async function ProductPage({ params }: PageProps) {
    const { slug } = await params;
    const product = await getProductBySlug(slug);

    if (!product) notFound();

    return (
        <>
            <Container className="py-8 md:py-12">
                <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
                    <ProductGallery images={product.images} />

                    <div className="lg:pt-4">
                        <AddToCartForm product={product} />
                    </div>
                </div>
            </Container>

            <ProductReviews
                reviews={product.reviews}
                ratingAverage={product.ratingAverage}
                ratingCount={product.ratingCount}
            />

            <RelatedProducts
                categoryId={product.category.id}
                excludeProductId={product.id}
            />

            <RecentlyViewedStrip excludeProductId={product.id} />

            <RecentlyViewedTracker
                item={{
                    productId: product.id,
                    slug: product.slug,
                    name: product.name,
                    image: product.images[0]?.url ?? "",
                    price: product.price,
                }}
            />
        </>
    );
}