"use client";

import { Minus, Plus } from "lucide-react";

export function QuantitySelector({
    value,
    onChange,
    max,
}: {
    value: number;
    onChange: (n: number) => void;
    max: number;
}) {
    const dec = () => onChange(Math.max(1, value - 1));
    const inc = () => onChange(Math.min(max, value + 1));

    return (
        <div className="flex items-center border border-border">
            <button
                type="button"
                aria-label="Decrease quantity"
                onClick={dec}
                disabled={value <= 1}
                className="flex h-11 w-11 items-center justify-center transition-colors hover:bg-muted disabled:opacity-30"
            >
                <Minus size={14} strokeWidth={2} />
            </button>
            <span className="flex h-11 w-14 items-center justify-center text-sm">
                {value}
            </span>
            <button
                type="button"
                aria-label="Increase quantity"
                onClick={inc}
                disabled={value >= max}
                className="flex h-11 w-11 items-center justify-center transition-colors hover:bg-muted disabled:opacity-30"
            >
                <Plus size={14} strokeWidth={2} />
            </button>
        </div>
    );
}