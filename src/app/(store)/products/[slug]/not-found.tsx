import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";

export default function NotFound() {
    return (
        <Container className="flex min-h-[70vh] flex-col items-center justify-center py-16 text-center">
            <p className="text-eyebrow text-muted-foreground">404</p>
            <h1 className="text-display mt-4 text-4xl md:text-6xl">
                Piece not found.
            </h1>
            <p className="mt-4 max-w-[36ch] text-sm text-muted-foreground">
                This product may have sold out or moved. Browse the shop to find
                something similar.
            </p>
            <Link href="/shop" className="mt-8">
                <Button size="lg">Back to shop</Button>
            </Link>
        </Container>
    );
}