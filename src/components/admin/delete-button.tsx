"use client";

import { useTransition, useState } from "react";
import { Trash2 } from "lucide-react";
import { notify } from "@/lib/toast";
import { cn } from "@/lib/utils";
import { deleteProduct } from "@/lib/actions/admin/products";

type Kind = "product" | "category" | "coupon";

export function DeleteButton({
    id,
    kind,
    confirmMessage,
    label,
    className,
}: {
    id: string;
    kind: Kind;
    confirmMessage?: string;
    label?: string;
    className?: string;
}) {
    const [pending, start] = useTransition();
    const [working, setWorking] = useState(false);

    function onClick() {
        if (!confirm(confirmMessage ?? "Delete this item?")) return;
        setWorking(true);
        start(async () => {
            let r: { ok: boolean; error?: string };
            if (kind === "product") r = await deleteProduct(id);
            else {
                // Placeholder until we add category/coupon delete actions in 8c
                r = { ok: false, error: "Not implemented yet." };
            }
            setWorking(false);
            if (!r.ok) notify.error(r.error ?? "Could not delete.");
            else notify.success("Deleted");
        });
    }

    const busy = pending || working;

    return (
        <button
            type="button"
            onClick={onClick}
            disabled={busy}
            className={cn(
                "inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-sale disabled:opacity-50",
                className
            )}
        >
            <Trash2 size={12} strokeWidth={1.5} />
            {label ?? "Delete"}
        </button>
    );
}