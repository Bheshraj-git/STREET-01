import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";

export default function NotFound() {
    return (
        <Container className="flex min-h-[70vh] flex-col items-center justify-center py-16 text-center">
            <p className="text-eyebrow text-muted-foreground">404</p>
            <h1 className="text-display mt-4 text-4xl md:text-6xl">
                Order not found.
            </h1>
            <p className="mt-4 max-w-[36ch] text-sm text-muted-foreground">
                We couldn't find an order with that number. Check your confirmation
                email or contact us.
            </p>
            <Link href="/" className="mt-8">
                <Button size="lg">Back home</Button>
            </Link>
        </Container>
    );
}