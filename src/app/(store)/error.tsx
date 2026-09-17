"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

export default function StoreError({
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <Container className="flex min-h-[70vh] flex-col items-center justify-center py-16 text-center">
            <p className="text-eyebrow text-muted-foreground">Something broke</p>
            <h1 className="text-display mt-4 text-4xl md:text-6xl">
                Couldn't load that.
            </h1>
            <p className="mt-4 max-w-[42ch] text-sm text-muted-foreground">
                Try again, or browse something else.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <Button onClick={reset}>Try again</Button>
                <Link href="/shop">
                    <Button variant="outline">Go to shop</Button>
                </Link>
            </div>
        </Container>
    );
}