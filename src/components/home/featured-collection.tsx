import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";

export function FeaturedCollection() {
    return (
        <section className="border-t border-border bg-muted/40">
            <Container className="py-16 md:py-24">
                <div className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
                    <div className="relative aspect-[4/5] w-full overflow-hidden">
                        <Image
                            src="https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1200&q=80"
                            alt="The Essentials collection"
                            fill
                            sizes="(max-width: 768px) 100vw, 50vw"
                            className="object-cover"
                        />
                    </div>

                    <div>
                        <p className="text-eyebrow text-muted-foreground">Collection 01</p>
                        <h2 className="text-display mt-4 text-5xl md:text-7xl">
                            The
                            <br />
                            Essentials
                        </h2>
                        <p className="mt-6 max-w-md text-base text-muted-foreground">
                            Built for everyday. Designed for everywhere. A tight edit of
                            foundational pieces — heavyweight tees, structured hoodies, and
                            utility staples that do the work for you.
                        </p>
                        <div className="mt-8">
                            <Link href="/collections/essentials">
                                <Button size="lg">Explore Collection</Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </Container>
        </section>
    );
}