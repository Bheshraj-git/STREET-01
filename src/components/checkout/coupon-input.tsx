"use client";

import { useState } from "react";
import { Check, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export interface AppliedCoupon {
    code: string;
    discount: number;
}

export function CouponInput({
    subtotal,
    applied,
    onApplied,
    onCleared,
}: {
    subtotal: number;
    applied: AppliedCoupon | null;
    onApplied: (c: AppliedCoupon) => void;
    onCleared: () => void;
}) {
    const [code, setCode] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function apply() {
        if (!code.trim()) return;
        setError(null);
        setLoading(true);

        try {
            const res = await fetch("/api/coupons/validate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ code, subtotal }),
            });
            const data = await res.json();

            if (!data.valid) {
                setError(data.message ?? "Coupon is not valid.");
                return;
            }

            onApplied({ code: data.code, discount: data.discount });
            setCode("");
        } catch {
            setError("Network error. Try again.");
        } finally {
            setLoading(false);
        }
    }

    function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === "Enter") {
            e.preventDefault();
            e.stopPropagation();
            apply();
        }
    }

    if (applied) {
        return (
            <div className="flex items-center justify-between border border-success/40 bg-success/5 px-4 py-3">
                <div className="flex items-center gap-2 text-sm">
                    <Check size={14} strokeWidth={2} className="text-success" />
                    <span className="font-mono text-xs font-medium">{applied.code}</span>
                    <span className="text-xs text-muted-foreground">
                        − Rs. {applied.discount.toLocaleString()}
                    </span>
                </div>
                <button
                    type="button"
                    aria-label="Remove coupon"
                    onClick={onCleared}
                    className="text-muted-foreground transition-colors hover:text-foreground"
                >
                    <X size={14} strokeWidth={1.5} />
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-2">
            <div className="flex gap-2">
                <Input
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    onKeyDown={onKeyDown}
                    placeholder="Coupon code"
                    aria-label="Coupon code"
                    className="h-11 flex-1 font-mono text-xs uppercase tracking-wider"
                />
                <Button
                    type="button"
                    variant="outline"
                    size="md"
                    disabled={loading || !code.trim()}
                    onClick={apply}
                >
                    {loading ? "…" : "Apply"}
                </Button>
            </div>
            {error && <p className="text-xs text-sale">{error}</p>}
        </div>
    );
}