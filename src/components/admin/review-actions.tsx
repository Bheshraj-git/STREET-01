"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, XCircle, Trash2 } from "lucide-react";
import { toggleReviewApproved, deleteReview } from "@/lib/actions/admin/reviews";
import { notify } from "@/lib/toast";

export function ReviewActions({
    reviewId,
    approved,
}: {
    reviewId: string;
    approved: boolean;
}) {
    const router = useRouter();
    const [pending, start] = useTransition();

    function onToggle() {
        start(async () => {
            const r = await toggleReviewApproved(reviewId);
            if (!r.ok) notify.error(r.error);
            else {
                notify.success(approved ? "Unapproved" : "Approved");
                router.refresh();
            }
        });
    }

    function onDelete() {
        if (!confirm("Delete this review permanently?")) return;
        start(async () => {
            const r = await deleteReview(reviewId);
            if (!r.ok) notify.error(r.error);
            else {
                notify.success("Review deleted");
                router.refresh();
            }
        });
    }

    return (
        <div className="flex items-center gap-2">
            <button
                type="button"
                onClick={onToggle}
                disabled={pending}
                className="text-xs text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"
                aria-label={approved ? "Unapprove" : "Approve"}
            >
                {approved ? (
                    <XCircle size={14} strokeWidth={1.5} />
                ) : (
                    <CheckCircle size={14} strokeWidth={1.5} />
                )}
            </button>
            <button
                type="button"
                onClick={onDelete}
                disabled={pending}
                className="text-xs text-muted-foreground transition-colors hover:text-sale disabled:opacity-50"
                aria-label="Delete review"
            >
                <Trash2 size={12} strokeWidth={1.5} />
            </button>
        </div>
    );
}