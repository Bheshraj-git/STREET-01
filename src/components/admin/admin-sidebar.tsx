"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import {
    LayoutDashboard,
    Package,
    ShoppingBag,
    Users,
    FolderTree,
    Ticket,
    MessageSquare,
    ArrowLeft,
    LogOut,
    Menu,
    X,
    ExternalLink,
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

function SidebarContent({
    adminName,
    pathname,
    onNavigate,
}: {
    adminName: string;
    pathname: string;
    onNavigate?: () => void;
}) {
    const router = useRouter();
    const [signingOut, setSigningOut] = useState(false);

    async function handleSignOut() {
        setSigningOut(true);
        await signOut({ redirect: false });
        router.push("/");
        router.refresh();
    }

    return (
        <aside className="flex h-full flex-col border-r border-border bg-muted/40">
            {/* Brand */}
            <div className="border-b border-border px-5 py-5">
                <p className="text-display text-lg">
                    STREET<span className="text-accent">/</span>01
                </p>
                <p className="text-eyebrow mt-1 text-muted-foreground">Admin Panel</p>
            </div>

            {/* Navigation */}
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
                            onClick={onNavigate}
                            className={cn(
                                "flex items-center gap-3 rounded px-3 py-2.5 text-sm transition-colors",
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

            {/* Footer */}
            <div className="border-t border-border p-3 space-y-1">
                <div className="px-3 py-2">
                    <p className="text-eyebrow text-xs text-muted-foreground truncate">{adminName}</p>
                </div>
                <Link
                    href="/"
                    onClick={onNavigate}
                    className="flex items-center gap-3 rounded px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                    <ExternalLink size={14} strokeWidth={1.5} />
                    View Store
                </Link>
                <button
                    onClick={handleSignOut}
                    disabled={signingOut}
                    className="flex w-full items-center gap-3 rounded px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-50"
                >
                    <LogOut size={14} strokeWidth={1.5} />
                    {signingOut ? "Signing out…" : "Sign out"}
                </button>
            </div>
        </aside>
    );
}

export function AdminSidebar({ adminName }: { adminName: string }) {
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <>
            {/* Desktop Sidebar */}
            <div className="hidden lg:block h-full">
                <SidebarContent adminName={adminName} pathname={pathname} />
            </div>

            {/* Mobile top bar */}
            <div className="fixed inset-x-0 top-0 z-40 flex h-14 items-center justify-between border-b border-border bg-background px-4 lg:hidden">
                <p className="text-display text-base">
                    STREET<span className="text-accent">/</span>01
                    <span className="ml-2 text-xs font-normal text-muted-foreground">Admin</span>
                </p>
                <button
                    aria-label="Open admin menu"
                    onClick={() => setMobileOpen(true)}
                    className="flex h-9 w-9 items-center justify-center rounded border border-border"
                >
                    <Menu size={18} strokeWidth={1.5} />
                </button>
            </div>

            {/* Mobile Drawer */}
            <div
                className={cn(
                    "fixed inset-0 z-50 lg:hidden",
                    mobileOpen ? "pointer-events-auto" : "pointer-events-none"
                )}
            >
                {/* Overlay */}
                <div
                    className={cn(
                        "absolute inset-0 bg-black/50 transition-opacity duration-300",
                        mobileOpen ? "opacity-100" : "opacity-0"
                    )}
                    onClick={() => setMobileOpen(false)}
                />
                {/* Drawer panel */}
                <div
                    className={cn(
                        "absolute left-0 top-0 h-full w-72 transition-transform duration-300 ease-out",
                        mobileOpen ? "translate-x-0" : "-translate-x-full"
                    )}
                >
                    {/* Close button */}
                    <button
                        aria-label="Close menu"
                        onClick={() => setMobileOpen(false)}
                        className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded border border-border bg-background"
                    >
                        <X size={16} strokeWidth={1.5} />
                    </button>
                    <SidebarContent
                        adminName={adminName}
                        pathname={pathname}
                        onNavigate={() => setMobileOpen(false)}
                    />
                </div>
            </div>
        </>
    );
}