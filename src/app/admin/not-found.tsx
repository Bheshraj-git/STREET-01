import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
    return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
            <p className="text-eyebrow text-muted-foreground">404</p>
            <h1 className="text-display mt-3 text-3xl">Not found</h1>
            <p className="mt-3 text-sm text-muted-foreground">
                That record doesn't exist or was removed.
            </p>
            <Link href="/admin" className="mt-6">
                <Button>Back to dashboard</Button>
            </Link>
        </div>
    );
}