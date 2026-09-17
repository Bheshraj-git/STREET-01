import Link from "next/link";
import { Container } from "@/components/ui/container";

export function AuthShell({
    eyebrow,
    heading,
    subheading,
    children,
    footer,
}: {
    eyebrow: string;
    heading: string;
    subheading: string;
    children: React.ReactNode;
    footer: React.ReactNode;
}) {
    return (
        <Container className="flex min-h-[80vh] items-center py-16">
            <div className="mx-auto w-full max-w-md">
                <Link href="/" className="text-display text-xl">
                    STREET<span className="text-accent">/</span>01
                </Link>

                <div className="mt-10">
                    <p className="text-eyebrow text-muted-foreground">{eyebrow}</p>
                    <h1 className="text-display mt-3 text-4xl">{heading}</h1>
                    <p className="mt-3 text-sm text-muted-foreground">{subheading}</p>
                </div>

                <div className="mt-10">{children}</div>

                <div className="mt-8 text-center text-sm text-muted-foreground">
                    {footer}
                </div>
            </div>
        </Container>
    );
}