"use client";

import { cn } from "@/lib/utils";

export function SizeSelector({
    sizes,
    availableSizes,
    selected,
    onChange,
    onOpenSizeGuide,
}: {
    sizes: string[];
    availableSizes: Set<string>;
    selected: string | null;
    onChange: (size: string) => void;
    onOpenSizeGuide: () => void;
}) {
    return (
        <div>
            <div className="mb-3 flex items-center justify-between">
                <span className="text-eyebrow">Size</span>
                <button
                    type="button"
                    onClick={onOpenSizeGuide}
                    className="text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                >
                    Size guide
                </button>
            </div>

            <div className="grid grid-cols-6 gap-2">
                {sizes.map((size) => {
                    const available = availableSizes.has(size);
                    const isSelected = selected === size;
                    return (
                        <button
                            key={size}
                            type="button"
                            disabled={!available}
                            aria-pressed={isSelected}
                            onClick={() => onChange(size)}
                            className={cn(
                                "flex h-11 items-center justify-center border text-xs font-medium transition-colors",
                                isSelected
                                    ? "border-foreground bg-foreground text-background"
                                    : "border-border bg-background text-foreground hover:border-foreground",
                                !available &&
                                "cursor-not-allowed border-border/50 text-muted-foreground/40 line-through hover:border-border/50"
                            )}
                        >
                            {size}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}