import Link from "next/link";
import { Button } from "@/components/ui/button";

export function CartEmpty({ onClose }: { onClose?: () => void }) {
    return (
        <div className="flex h-full flex-col items-center justify-center py-16 text-center">
            <p className="text-eyebrow text-muted-foreground">Empty</p>
            <h3 className="text-display mt-3 text-2xl">Your bag is empty.</h3>
            <p className="mt-2 max-w-[28ch] text-sm text-muted-foreground">
                Discover something worth wearing.
            </p>
            <Link href="/shop" onClick={onClose} className="mt-8">
                <Button>Shop now</Button>
            </Link>
        </div>
    );
}