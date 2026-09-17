import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-6 text-center">
      <p className="text-eyebrow text-muted-foreground">404</p>
      <h1 className="text-display mt-4 text-5xl md:text-7xl">
        Not found.
      </h1>
      <p className="mt-4 max-w-[42ch] text-sm text-muted-foreground">
        The page you're looking for doesn't exist or has moved.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link href="/">
          <Button>Back to home</Button>
        </Link>
        <Link href="/shop">
          <Button variant="outline">Shop</Button>
        </Link>
      </div>
    </div>
  );
}