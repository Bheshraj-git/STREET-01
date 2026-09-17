import Link from "next/link";
import Image from "next/image";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PriceDisplay } from "@/components/ui/price-display";
import { requireUser } from "@/lib/auth/session";
import { getUserWishlist } from "@/lib/queries/account";

export const metadata = { title: "Wishlist" };

export default async function AccountWishlistPage() {
    const user = await requireUser();
    const items = await getUserWishlist(user.id);

    return (
        <div>
            <div className="mb-8">
                <p className="text-eyebrow text-muted-foreground">Saved</p>
                <h2 className="text-display mt-2 text-3xl">Your wishlist</h2>
            </div>

            {items.length === 0 ? (
                <div className="border border-border p-12 text-center">
                    <Heart
                        size={28}
                        strokeWidth={1.2}
                        className="mx-auto text-muted-foreground"
                    />
                    <p className="mt-4 text-sm text-muted-foreground">
                        Nothing saved yet.
                    </p>
                    <Link href="/shop" className="mt-6 inline-block">
                        <Button>Browse the shop</Button>
                    </Link>
                </div>
            ) : (
                <div className="grid gap-x-4 gap-y-8 sm:grid-cols-2">
                    {items.map((item) => (
                        <Link
                            key={item.id}
                            href={`/products/${item.slug}`}
                            className="group block"
                        >
                            <div className="relative aspect-[3/4] overflow-hidden bg-muted">
                                {item.image && (
                                    <Image
                                        src={item.image}
                                        alt={item.name}
                                        fill
                                        sizes="(max-width: 640px) 100vw, 33vw"
                                        className="object-cover transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-105"
                                    />
                                )}
                            </div>
                            <div className="mt-3">
                                <p className="text-sm font-medium">{item.name}</p>
                                <p className="mt-0.5 text-xs text-muted-foreground">
                                    {item.categoryName}
                                </p>
                                <div className="mt-2">
                                    <PriceDisplay
                                        price={item.price}
                                        compareAt={item.compareAtPrice}
                                    />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}