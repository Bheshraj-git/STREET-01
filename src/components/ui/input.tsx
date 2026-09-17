import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<
    HTMLInputElement,
    React.InputHTMLAttributes<HTMLInputElement>
>(({ className, type, ...props }, ref) => (
    <input
        ref={ref}
        type={type}
        className={cn(
            "h-12 w-full border border-border bg-transparent px-4 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus:border-foreground focus:outline-none disabled:opacity-50",
            className
        )}
        {...props}
    />
));
Input.displayName = "Input";