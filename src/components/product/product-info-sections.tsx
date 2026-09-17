"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

function Section({
    title,
    defaultOpen = false,
    children,
}: {
    title: string;
    defaultOpen?: boolean;
    children: React.ReactNode;
}) {
    const [open, setOpen] = useState(defaultOpen);
    return (
        <div className="border-b border-border">
            <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                aria-expanded={open}
                className="flex w-full items-center justify-between py-4 text-left"
            >
                <span className="text-eyebrow">{title}</span>
                <ChevronDown
                    size={16}
                    strokeWidth={1.5}
                    className={cn(
                        "transition-transform duration-300",
                        open && "rotate-180"
                    )}
                />
            </button>
            {open && (
                <div className="pb-5 text-sm leading-relaxed text-muted-foreground">
                    {children}
                </div>
            )}
        </div>
    );
}

export function ProductInfoSections({
    description,
    materials,
    fit,
}: {
    description: string;
    materials: string | null;
    fit: string | null;
}) {
    return (
        <div className="border-t border-border">
            <Section title="Description" defaultOpen>
                {description}
            </Section>

            {materials && <Section title="Materials">{materials}</Section>}

            {fit && <Section title="Fit">{fit}</Section>}

            <Section title="Shipping">
                Free shipping on orders over Rs. 5,000. Standard delivery 2–4 business
                days inside Nepal. Express available at checkout.
            </Section>

            <Section title="Returns">
                30-day returns on unworn items with original tags. Start a return from
                your account page.
            </Section>
        </div>
    );
}