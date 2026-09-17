import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { getCategories } from "@/lib/queries/products";

export async function ShopByCategory() {
    const categories = await getCategories();

    if (categories.length === 0) return null;

    return (
        <section className="border-t border-border">
            <Container className="py-16 md:py-24">
                <div className="mb-10 md:mb-14">
                    <p className="text-eyebrow text-muted-foreground">Find your fit</p>
                    <h2 className="text-display mt-3 text-4xl md:text-6xl">
                        Shop by Category
                    </h2>
                </div>

                <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-6">
                    {categories.map((cat) => (
                        <Link
                            key={cat.id}
                            href={`/shop?category=${cat.slug}`}
                            className="group relative aspect-[4/5] overflow-hidden bg-muted"
                        >
                            {cat.image && (
                                <Image
                                    src={cat.image}
                                    alt={cat.name}
                                    fill
                                    sizes="(max-width: 768px) 50vw, 33vw"
                                    className="object-cover transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-105"
                                />
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                            <div className="absolute inset-x-0 bottom-0 p-5 md:p-7">
                                <h3 className="text-display text-2xl text-white md:text-3xl">
                                    {cat.name}
                                </h3>
                                <p className="text-eyebrow mt-1 text-white/70">Shop now →</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </Container>
        </section>
    );
}