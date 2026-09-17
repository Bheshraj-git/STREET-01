"use client";

import { Button } from "@/components/ui/button";

export default function AdminError({
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
            <p className="text-eyebrow text-muted-foreground">Admin error</p>
            <h1 className="text-display mt-4 text-3xl">
                Couldn't load the admin.
            </h1>
            <p className="mt-4 max-w-[42ch] text-sm text-muted-foreground">
                Try again — if this keeps happening, check the server logs.
            </p>
            <Button onClick={reset} className="mt-8">
                Reload
            </Button>
        </div>
    );
}