"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";
import { useCartStore } from "@/lib/stores/cart-store";
import { useWishlistStore } from "@/lib/stores/wishlist-store";

export function SignOutButton() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    async function onClick() {
        setLoading(true);
        useCartStore.getState().clear();
        useWishlistStore.getState().clear();
        await signOut({ redirect: false });
        router.push("/");
        router.refresh();
    }

    return (
        <button
            type="button"
            onClick={onClick}
            disabled={loading}
            className="text-eyebrow flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"
        >
            <LogOut size={14} strokeWidth={1.5} />
            {loading ? "Signing out…" : "Sign out"}
        </button>
    );
}