import { Metadata } from "next";
import { Container } from "@/components/ui/container";

export const metadata: Metadata = {
    title: "Careers · STREET/01",
    description: "Join the STREET/01 design and operational team.",
};

export default function CareersPage() {
    return (
        <div className="py-12 md:py-20">
            <Container>
                <div className="mx-auto max-w-2xl text-center">
                    <div className="mb-10 border-b border-border pb-6">
                        <p className="text-eyebrow mb-2 text-muted-foreground">Team & Culture</p>
                        <h1 className="text-display text-4xl uppercase tracking-tight md:text-5xl">
                            Join STREET/01
                        </h1>
                    </div>

                    <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
                        We are continuously seeking passionate textile pattern-makers, creative visualists, and operations specialists to join our studio in Kathmandu.
                    </p>

                    <div className="mt-8 border border-border bg-muted/20 p-8 text-left">
                        <h3 className="text-display text-lg uppercase text-foreground">Open Submissions</h3>
                        <p className="mt-2 text-xs text-muted-foreground">
                            Even when specific roles are not actively posted, our studio reviews design portfolios and creative resumes regularly.
                        </p>
                        <a
                            href="mailto:careers@street01.com"
                            className="mt-4 inline-block text-xs font-semibold uppercase tracking-wider text-foreground underline hover:text-accent"
                        >
                            Email portfolio to careers@street01.com →
                        </a>
                    </div>
                </div>
            </Container>
        </div>
    );
}
