import { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { ShieldCheck, Sparkles, Scissors, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
    title: "About Us · STREET/01",
    description: "Learn about the ethos, craftsmanship, and heavyweight design philosophy behind STREET/01.",
};

const PILLARS = [
    {
        icon: Scissors,
        title: "Architectural Drape",
        description:
            "We reject generic off-the-shelf blanks. Every pattern is drawn with dropped shoulders, widened chests, and cropped lengths for a distinct, intentional silhouette.",
    },
    {
        icon: ShieldCheck,
        title: "Bespoke Heavyweights",
        description:
            "From 460 GSM organic loopback French terry to 280 GSM combed jersey cotton, our fabrics are selected for substantial hand-feel and decade-long durability.",
    },
    {
        icon: Sparkles,
        title: "Subtle Discipline",
        description:
            "Zero loud branding or disposable graphics. We let premium textures, reinforced bar-tacking, and monochromatic color palettes speak for themselves.",
    },
];

export default function AboutPage() {
    return (
        <div className="py-12 md:py-20">
            <Container>
                {/* Hero section */}
                <div className="mx-auto max-w-3xl text-center">
                    <p className="text-eyebrow mb-3 text-accent">The Manifesto</p>
                    <h1 className="text-display text-4xl uppercase tracking-tight md:text-6xl lg:text-7xl">
                        Wear Your Attitude
                    </h1>
                    <p className="mt-6 text-lg leading-relaxed text-muted-foreground md:text-xl">
                        STREET/01 was conceived as a rebellion against disposable fast-fashion. We build garments as wearable architecture — heavy, disciplined, and uncompromising.
                    </p>
                </div>

                {/* Big Editorial Quote / Story */}
                <div id="story" className="mt-16 border-y border-border py-12 md:mt-24 md:py-20">
                    <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-16">
                        <div className="lg:col-span-5">
                            <span className="text-eyebrow mb-2 block text-muted-foreground">Origin & Purpose</span>
                            <h2 className="text-display text-3xl uppercase tracking-tight md:text-4xl">
                                Built for everyday. Designed for everywhere.
                            </h2>
                        </div>
                        <div className="space-y-4 text-sm leading-relaxed text-muted-foreground md:text-base lg:col-span-7">
                            <p>
                                Modern streetwear has too often drifted into two extremes: overpriced collector hype that sits in a closet, or flimsy synthetic blends that disintegrate after five washes.
                            </p>
                            <p>
                                STREET/01 occupies the space in between. We produce elevated street uniforms designed to be worn without hesitation. Garments that look better beaten up, broken in, and lived in.
                            </p>
                            <p>
                                Every piece undergoes extensive wash testing, tensile stress evaluations, and fit trials to ensure that when you put on a STREET/01 piece, you immediately register the difference.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Core Pillars */}
                <div className="mt-16 md:mt-24">
                    <div className="mb-10 text-center">
                        <p className="text-eyebrow mb-2 text-muted-foreground">Craftsmanship</p>
                        <h2 className="text-display text-3xl uppercase tracking-tight md:text-4xl">
                            Our Design Pillars
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
                        {PILLARS.map((pillar) => {
                            const Icon = pillar.icon;
                            return (
                                <div
                                    key={pillar.title}
                                    className="border border-border bg-muted/20 p-8 transition-colors hover:border-foreground/40"
                                >
                                    <div className="mb-6 flex h-12 w-12 items-center justify-center bg-foreground text-background">
                                        <Icon size={20} strokeWidth={1.5} />
                                    </div>
                                    <h3 className="text-display text-xl uppercase tracking-tight">
                                        {pillar.title}
                                    </h3>
                                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                                        {pillar.description}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Call to action */}
                <div className="mt-20 border border-border bg-foreground p-10 text-center text-background md:mt-28 md:p-16">
                    <h2 className="text-display text-3xl uppercase tracking-tight md:text-4xl">
                        Experience the collection
                    </h2>
                    <p className="mx-auto mt-3 max-w-md text-sm text-background/80 md:text-base">
                        Discover the latest drops, heavyweight hoodies, and essential tees.
                    </p>
                    <div className="mt-8 flex justify-center">
                        <Link
                            href="/shop"
                            className="inline-flex items-center gap-2 bg-background px-6 py-3 text-xs font-semibold uppercase tracking-widest text-foreground transition-opacity hover:opacity-90"
                        >
                            <span>Explore Store</span>
                            <ArrowRight size={14} />
                        </Link>
                    </div>
                </div>
            </Container>
        </div>
    );
}
