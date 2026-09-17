import { RatingStars } from "@/components/ui/rating-stars";
import { cn } from "@/lib/utils";

export function ProductReviews({
    reviews,
    ratingAverage,
    ratingCount,
}: {
    reviews: {
        id: string;
        rating: number;
        title: string | null;
        body: string;
        createdAt: string;
        user: { name: string | null; image: string | null };
    }[];
    ratingAverage: number;
    ratingCount: number;
}) {
    const breakdown = [5, 4, 3, 2, 1].map((star) => ({
        star,
        count: reviews.filter((r) => r.rating === star).length,
    }));
    const maxCount = Math.max(1, ...breakdown.map((b) => b.count));

    return (
        <section className="border-t border-border">
            <div className="grid gap-12 py-16 md:grid-cols-[320px_1fr] md:py-24">
                <div>
                    <p className="text-eyebrow text-muted-foreground">Reviews</p>
                    <h2 className="text-display mt-3 text-3xl md:text-4xl">
                        What buyers say
                    </h2>

                    {ratingCount > 0 ? (
                        <>
                            <div className="mt-6 flex items-center gap-3">
                                <span className="text-display text-4xl">
                                    {ratingAverage.toFixed(1)}
                                </span>
                                <div>
                                    <RatingStars rating={ratingAverage} size={14} />
                                    <p className="mt-1 text-xs text-muted-foreground">
                                        Based on {ratingCount} review
                                        {ratingCount === 1 ? "" : "s"}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-6 flex flex-col gap-2">
                                {breakdown.map((b) => (
                                    <div key={b.star} className="flex items-center gap-3 text-xs">
                                        <span className="w-3 text-muted-foreground">
                                            {b.star}
                                        </span>
                                        <span className="text-muted-foreground">★</span>
                                        <div className="h-1.5 flex-1 bg-muted">
                                            <div
                                                className="h-full bg-foreground"
                                                style={{
                                                    width: `${(b.count / maxCount) * 100}%`,
                                                }}
                                            />
                                        </div>
                                        <span className="w-6 text-right text-muted-foreground">
                                            {b.count}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <p className="mt-4 text-sm text-muted-foreground">
                            No reviews yet. Be the first.
                        </p>
                    )}
                </div>

                <div>
                    {reviews.length > 0 ? (
                        <div className="flex flex-col gap-8">
                            {reviews.map((r) => (
                                <article
                                    key={r.id}
                                    className={cn(
                                        "border-b border-border pb-8 last:border-0 last:pb-0"
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        <RatingStars rating={r.rating} size={12} />
                                        <span className="text-xs text-muted-foreground">
                                            {new Date(r.createdAt).toLocaleDateString("en-US", {
                                                year: "numeric",
                                                month: "short",
                                                day: "numeric",
                                            })}
                                        </span>
                                    </div>

                                    {r.title && (
                                        <h3 className="mt-3 text-sm font-medium">{r.title}</h3>
                                    )}
                                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                                        {r.body}
                                    </p>
                                    <p className="mt-3 text-xs text-muted-foreground">
                                        — {r.user.name ?? "Anonymous"}
                                    </p>
                                </article>
                            ))}
                        </div>
                    ) : (
                        <div className="flex h-full items-center justify-center border border-border p-12 text-center">
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    No reviews have been written yet.
                                </p>
                                <a
                                    href="/login"
                                    className="text-eyebrow mt-4 inline-block text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                                >
                                    Sign in to review
                                </a>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}