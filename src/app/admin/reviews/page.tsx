import Link from "next/link";
import { RatingStars } from "@/components/ui/rating-stars";
import { ReviewActions } from "@/components/admin/review-actions";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Reviews" };

interface PageProps {
    searchParams: Promise<{ filter?: string }>;
}

export default async function AdminReviewsPage({ searchParams }: PageProps) {
    const { filter = "all" } = await searchParams;

    const where: Record<string, unknown> = {};
    if (filter === "approved") where.approved = true;
    if (filter === "pending") where.approved = false;

    const reviews = await prisma.review.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take: 100,
        include: {
            user: { select: { name: true, email: true } },
            product: { select: { name: true, slug: true } },
        },
    });

    const counts = await prisma.review.groupBy({
        by: ["approved"],
        _count: { _all: true },
    });

    const approvedCount = counts.find((c) => c.approved)?._count._all ?? 0;
    const pendingCount = counts.find((c) => !c.approved)?._count._all ?? 0;

    return (
        <div className="flex flex-col gap-6">
            <div>
                <p className="text-eyebrow text-muted-foreground">Manage</p>
                <h1 className="text-display mt-2 text-3xl">Reviews</h1>
                <p className="mt-2 text-xs text-muted-foreground">
                    {approvedCount} approved · {pendingCount} pending
                </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 border-b border-border pb-4">
                <Link
                    href="/admin/reviews"
                    className={
                        filter === "all"
                            ? "text-eyebrow text-foreground"
                            : "text-eyebrow text-muted-foreground hover:text-foreground"
                    }
                >
                    All
                </Link>
                <span className="text-muted-foreground">·</span>
                <Link
                    href="/admin/reviews?filter=approved"
                    className={
                        filter === "approved"
                            ? "text-eyebrow text-foreground"
                            : "text-eyebrow text-muted-foreground hover:text-foreground"
                    }
                >
                    Approved
                </Link>
                <span className="text-muted-foreground">·</span>
                <Link
                    href="/admin/reviews?filter=pending"
                    className={
                        filter === "pending"
                            ? "text-eyebrow text-foreground"
                            : "text-eyebrow text-muted-foreground hover:text-foreground"
                    }
                >
                    Pending
                </Link>
            </div>

            {reviews.length === 0 ? (
                <div className="border border-border p-12 text-center text-sm text-muted-foreground">
                    No reviews.
                </div>
            ) : (
                <ul className="flex flex-col gap-4">
                    {reviews.map((r) => (
                        <li key={r.id} className="border border-border p-5">
                            <div className="flex flex-wrap items-start justify-between gap-4">
                                <div>
                                    <div className="flex items-center gap-3">
                                        <RatingStars rating={r.rating} size={12} />
                                        {!r.approved && (
                                            <span className="text-eyebrow text-accent">Pending</span>
                                        )}
                                    </div>
                                    {r.title && (
                                        <p className="mt-2 text-sm font-medium">{r.title}</p>
                                    )}
                                    <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
                                        {r.body}
                                    </p>
                                    <p className="mt-3 text-xs text-muted-foreground">
                                        By {r.user.name ?? r.user.email} ·{" "}
                                        <Link
                                            href={`/products/${r.product.slug}`}
                                            className="underline underline-offset-4 hover:text-foreground"
                                            target="_blank"
                                        >
                                            {r.product.name}
                                        </Link>{" "}
                                        ·{" "}
                                        {new Date(r.createdAt).toLocaleDateString("en-US", {
                                            month: "short",
                                            day: "numeric",
                                            year: "numeric",
                                        })}
                                    </p>
                                </div>
                                <ReviewActions reviewId={r.id} approved={r.approved} />
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}