"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard } from "lucide-react";

const LINKS = [
    { href: "/account", label: "Overview" },
    { href: "/account/orders", label: "Orders" },
    { href: "/account/addresses", label: "Addresses" },
    { href: "/account/wishlist", label: "Wishlist" },
    { href: "/account/profile", label: "Profile" },
];

export function AccountSidebar({ isAdmin = false }: { isAdmin?: boolean }) {
    const pathname = usePathname();

    return (
        <nav className="flex flex-row gap-1 overflow-x-auto border-b border-border pb-3 md:flex-col md:border-b-0 md:border-r md:pb-0 md:pr-8 lg:pr-12">
            {LINKS.map((link) => {
                const active =
                    link.href === "/account"
                        ? pathname === "/account"
                        : pathname.startsWith(link.href);

                return (
                    <Link
                        key={link.href}
                        href={link.href}
                        className={cn(
                            "whitespace-nowrap px-3 py-2 text-sm transition-colors md:px-0",
                            active
                                ? "text-foreground font-medium"
                                : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        {link.label}
                    </Link>
                );
            })}

            {isAdmin && (
                <div className="mt-4 hidden border-t border-border pt-4 md:block">
                    <Link
                        href="/admin"
                        className="flex items-center gap-2 whitespace-nowrap px-0 py-2 text-sm font-medium text-accent transition-colors hover:text-foreground"
                    >
                        <LayoutDashboard size={14} strokeWidth={1.5} />
                        Admin Dashboard
                    </Link>
                </div>
            )}
        </nav>
    );
}