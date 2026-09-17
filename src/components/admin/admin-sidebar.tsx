"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Package,
    ShoppingBag,
    Users,
    FolderTree,
    Ticket,
    MessageSquare,
    ArrowLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";

const LINKS = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
    { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
    { href: "/admin/products", label: "Products", icon: Package },
    { href: "/admin/customers", label: "Customers", icon: Users },
    { href: "/admin/categories", label: "Categories", icon: FolderTree },
    { href: "/admin/coupons", label: "Coupons", icon: Ticket },
    { href: "/admin/reviews", label: "Reviews", icon: MessageSquare },
];

export function AdminSidebar({ adminName }: { adminName: string }) {
    const pathname = usePathname();

    return (
        <aside className="flex h-full flex-col border-r border-border bg-muted/40">
            <div className="border-b border-border px-5 py-5">
                <p className="text-display text-lg">
                    STREET<span className="text-accent">/</span>01
                </p>
                <p className="text-eyebrow mt-1 text-muted-foreground">Admin</p>
            </div>

            <nav className="flex-1 overflow-y-auto p-3">
                {LINKS.map((link) => {
                    const Icon = link.icon;
                    const active = link.exact
                        ? pathname === link.href
                        : pathname.startsWith(link.href);

                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2 text-sm transition-colors",
                                active
                                    ? "bg-foreground text-background"
                                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                            )}
                        >
                            <Icon size={15} strokeWidth={1.5} />
                            {link.label}
                        </Link>
                    );
                })}
            </nav>

            <div className="border-t border-border p-3">
                <p className="text-eyebrow mb-2 px-3 text-muted-foreground">
                    {adminName}
                </p>
                <Link
                    href="/"
                    className="flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                    <ArrowLeft size={15} strokeWidth={1.5} />
                    Back to store
                </Link>
            </div>
        </aside>
    );
}