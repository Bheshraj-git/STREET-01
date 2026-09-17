import { cn } from "@/lib/utils";

export function StatCard({
    label,
    value,
    hint,
    accent,
}: {
    label: string;
    value: string;
    hint?: string;
    accent?: boolean;
}) {
    return (
        <div className="border border-border bg-background p-5">
            <p className="text-eyebrow text-muted-foreground">{label}</p>
            <p
                className={cn(
                    "text-display mt-3 text-3xl",
                    accent && "text-accent"
                )}
            >
                {value}
            </p>
            {hint && (
                <p className="mt-2 text-xs text-muted-foreground">{hint}</p>
            )}
        </div>
    );
}