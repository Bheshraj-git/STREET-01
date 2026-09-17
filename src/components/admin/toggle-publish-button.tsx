"use client";

import { useTransition } from "react";
import { Eye, EyeOff } from "lucide-react";
import { togglePublish } from "@/lib/actions/admin/products";
import { notify } from "@/lib/toast";

export function TogglePublishButton({
    id,
    published,
}: {
    id: string;
    published: boolean;
}) {
    const [pending, start] = useTransition();

    function onClick() {
        start(async () => {
            const r = await togglePublish(id);
            if (!r.ok) notify.error(r.error);
            else notify.success(published ? "Moved to draft" : "Published");
        });
    }

    return (
        <button
            type="button"
            onClick={onClick}
            disabled={pending}
            className="text-xs text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"
            aria-label={published ? "Unpublish" : "Publish"}
        >
            {published ? (
                <EyeOff size={12} strokeWidth={1.5} />
            ) : (
                <Eye size={12} strokeWidth={1.5} />
            )}
        </button>
    );
}