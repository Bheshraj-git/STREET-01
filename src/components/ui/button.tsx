import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap text-eyebrow font-medium transition-all duration-200 ease-[var(--ease-out-expo)] disabled:pointer-events-none disabled:opacity-40 active:scale-[0.98]",
    {
        variants: {
            variant: {
                primary:
                    "bg-foreground text-background hover:bg-accent hover:text-accent-foreground",
                accent:
                    "bg-accent text-accent-foreground hover:opacity-90",
                outline:
                    "border border-foreground bg-transparent text-foreground hover:bg-foreground hover:text-background",
                ghost:
                    "bg-transparent text-foreground hover:bg-muted",
                link:
                    "bg-transparent text-foreground underline-offset-4 hover:underline p-0 h-auto",
            },
            size: {
                sm: "h-9 px-4",
                md: "h-11 px-6",
                lg: "h-14 px-8 text-xs",
                icon: "h-10 w-10",
            },
            shape: {
                square: "rounded-none",
                pill: "rounded-full",
            },
        },
        defaultVariants: {
            variant: "primary",
            size: "md",
            shape: "square",
        },
    }
);

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> { }

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, shape, ...props }, ref) => (
        <button
            ref={ref}
            className={cn(buttonVariants({ variant, size, shape }), className)}
            {...props}
        />
    )
);
Button.displayName = "Button";

export { buttonVariants };