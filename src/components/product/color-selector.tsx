"use client";

import { cn } from "@/lib/utils";

export function ColorSelector({
    colors,
    selected,
    onChange,
}: {
    colors: { name: string; hex: string }[];
    selected: string;
    onChange: (name: string) => void;
}) {
    return (
        <div>
            <div className="mb-3 flex items-center justify-between">
                <span className="text-eyebrow">Color</span>
                <span className="text-xs text-muted-foreground">{selected}</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
                {colors.map((c) => (
                    <button
                        key={c.name}
                        type="button"
                        aria-label={c.name}
                        aria-pressed={selected === c.name}
                        onClick={() => onChange(c.name)}
                        className={cn(
                            "relative h-9 w-9 rounded-full border transition-all",
                            selected === c.name
                                ? "border-foreground ring-1 ring-foreground ring-offset-2 ring-offset-background"
                                : "border-border hover:border-foreground/50"
                        )}
                        style={{ backgroundColor: c.hex }}
                    />
                ))}
            </div>
        </div>
    );
}