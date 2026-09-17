import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

export function Hero() {
    return (
        <section className="relative min-h-[85vh] w-full overflow-hidden bg-foreground text-background">
            <Image
                src="https://images.unsplash.com/photo-1523398002811-999ca8dec234?auto=format&fit=crop&w=2000&q=80"
                alt=""
                fill
                priority
                sizes="100vw"
                className="object-cover opacity-60"
            />

            <div className="relative z-10 flex min-h-[85vh] items-end">
                <Container className="w-full pb-16 pt-32 md:pb-24 md:pt-40">
                    <p className="text-eyebrow text-background/70">New Season / 2026</p>

                    <h1 className="text-display mt-6 text-6xl leading-[0.9] md:text-8xl lg:text-[9rem]">
                        WEAR
                        <br />
                        YOUR
                        <br />
                        <span className="text-accent">ATTITUDE.</span>
                    </h1>

                    <div className="mt-10 flex flex-wrap items-center gap-3">
                        <Link href="/shop">
                            <Button size="lg" variant="accent">
                                Shop Collection
                            </Button>
                        </Link>
                        <Link href="/about">
                            <Button
                                size="lg"
                                variant="outline"
                                className="border-background text-background hover:bg-background hover:text-foreground"
                            >
                                Our Story
                            </Button>
                        </Link>
                    </div>
                </Container>
            </div>
        </section>
    );
}