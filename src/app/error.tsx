"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("[app error]", error);
    }, [error]);

    return (
        <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 py-16 text-center">
            <p className="text-eyebrow text-muted-foreground">Something broke</p>
            <h1 className="text-display mt-4 text-4xl md:text-6xl">
                Well, that's awkward.
            </h1>
            <p className="mt-4 max-w-[42ch] text-sm text-muted-foreground">
                An unexpected error occurred. Try again — or head back to somewhere
                that works.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <Button onClick={reset}>Try again</Button>
                <Link href="/">
                    <Button variant="outline">Back to home</Button>
                </Link>
            </div>
        </div>
    );
}