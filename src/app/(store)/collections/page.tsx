import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/container";
import { getCollectionsWithStats } from "@/lib/queries/products";
import { ArrowUpRight } from "lucide-react";

export const metadata: Metadata = {
    title: "Collections · STREET/01",
    description: "Explore the seasonal collections and curated streetwear capsules by STREET/01.",
};

export default async function CollectionsPage() {
    const collections = await getCollectionsWithStats();

    return (
        <div className="py-12 md:py-20">
            <Container>
                {/* Header */}
                <div className="mb-12 border-b border-border pb-8 md:mb-16">
                    <p className="text-eyebrow mb-2 text-muted-foreground">Series & Silhouettes</p>
                    <h1 className="text-display text-4xl uppercase tracking-tight md:text-6xl">
                        Collections
                    </h1>
                    <p className="mt-3 max-w-2xl text-base text-muted-foreground md:text-lg">
                        Curated wardrobes built around minimalist volume, heavyweight bespoke fabrics, and everyday durability.
                    </p>
                </div>

                {/* Collections Grid */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 md:gap-8">
                    {collections.map((col, index) => (
                        <Link
                            key={col.id}
                            href={`/shop?category=${col.slug}`}
                            className="group relative flex h-[420px] flex-col justify-end overflow-hidden border border-border bg-muted p-6 transition-transform duration-500 hover:scale-[1.01]"
                        >
                            {/* Background Image */}
                            {col.coverImage ? (
                                <Image
                                    src={col.coverImage}
                                    alt={col.name}
                                    fill
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    className="object-cover object-center brightness-[0.75] transition-transform duration-700 ease-out group-hover:scale-105 group-hover:brightness-[0.65]"
                                    priority={index < 2}
                                />
                            ) : (
                                <div className="absolute inset-0 bg-muted" />
                            )}

                            {/* Dark gradient overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent" />

                            {/* Content */}
                            <div className="relative z-10">
                                <span className="text-eyebrow mb-2 inline-block text-xs uppercase tracking-widest text-accent">
                                    {col.productCount} {col.productCount === 1 ? "Piece" : "Pieces"}
                                </span>
                                <h2 className="text-display text-2xl uppercase tracking-tight text-foreground md:text-3xl">
                                    {col.name}
                                </h2>
                                {col.description && (
                                    <p className="mt-2 line-clamp-2 text-xs text-foreground/80 md:text-sm">
                                        {col.description}
                                    </p>
                                )}
                                <div className="mt-4 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-foreground transition-transform duration-300 group-hover:translate-x-1">
                                    <span>Explore Collection</span>
                                    <ArrowUpRight size={15} />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Manifesto Banner */}
                <div className="mt-16 border border-border bg-muted/30 p-8 text-center md:mt-24 md:p-14">
                    <span className="text-eyebrow mb-3 block text-accent">Design Philosophy</span>
                    <h3 className="text-display mx-auto max-w-2xl text-2xl uppercase tracking-tight md:text-3xl">
                        Uncompromising weight. Timeless geometry.
                    </h3>
                    <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base">
                        Every collection is developed with an obsessive focus on drape, tension, and texture. No disposable seasonal trends — only essential uniforms crafted to age gracefully.
                    </p>
                    <div className="mt-8">
                        <Link
                            href="/shop"
                            className="inline-flex items-center gap-2 bg-foreground px-6 py-3 text-xs font-semibold uppercase tracking-widest text-background transition-opacity hover:opacity-90"
                        >
                            Shop All Items
                        </Link>
                    </div>
                </div>
            </Container>
        </div>
    );
}
