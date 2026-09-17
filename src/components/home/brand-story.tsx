import Image from "next/image";
import { Container } from "@/components/ui/container";

export function BrandStory() {
    return (
        <section className="border-t border-border">
            <Container className="py-16 md:py-24">
                <div className="grid gap-10 md:grid-cols-2 md:gap-16">
                    <div className="flex flex-col justify-center">
                        <p className="text-eyebrow text-muted-foreground">Our Story</p>
                        <h2 className="text-display mt-4 text-4xl md:text-6xl">
                            Independent.
                            <br />
                            Everyday.
                            <br />
                            Yours.
                        </h2>
                        <p className="mt-6 max-w-md text-base text-muted-foreground">
                            STREET/01 was born in a small studio with one rule: make clothes
                            that actually get worn. No seasonal churn. No filler pieces. Just
                            heavyweight cotton, honest construction, and silhouettes that
                            hold up from morning commutes to late nights.
                        </p>
                        <p className="mt-4 max-w-md text-base text-muted-foreground">
                            We work with a handful of mills, cut in small batches, and drop
                            when something is actually ready — never on a calendar.
                        </p>
                    </div>

                    <div className="relative aspect-[4/5] w-full overflow-hidden md:order-last">
                        <Image
                            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80"
                            alt="STREET/01 studio"
                            fill
                            sizes="(max-width: 768px) 100vw, 50vw"
                            className="object-cover"
                        />
                    </div>
                </div>
            </Container>
        </section>
    );
}