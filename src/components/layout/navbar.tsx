"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
    Menu,
    Search,
    ShoppingBag,
    Heart,
    User,
    Sun,
    Moon,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { useTheme } from "@/components/providers/theme-provider";
import { useCartStore } from "@/lib/stores/cart-store";
import { useWishlistStore } from "@/lib/stores/wishlist-store";
import { useUIStore } from "@/lib/stores/ui-store";
import { useMounted } from "@/lib/hooks/use-mounted";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
    { href: "/shop", label: "Shop" },
    { href: "/collections", label: "Collections" },
    { href: "/shop?sort=newest", label: "New Arrivals" },
    { href: "/about", label: "About" },
];

export function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const { theme, toggle } = useTheme();
    const mounted = useMounted();

    const openCart = useUIStore((s) => s.openCartDrawer);
    const cartCount = useCartStore((s) => s.totalItems());
    const wishlistCount = useWishlistStore((s) => s.items.length);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    useEffect(() => {
        document.body.style.overflow = mobileOpen ? "hidden" : "";
        return () => {
            document.body.style.overflow = "";
        };
    }, [mobileOpen]);

    const displayCartCount = mounted ? cartCount : 0;
    const displayWishlistCount = mounted ? wishlistCount : 0;

    return (
        <>
            <header
                className={cn(
                    "sticky top-0 z-50 w-full border-b transition-colors duration-300",
                    scrolled
                        ? "border-border bg-background/85 backdrop-blur-md"
                        : "border-transparent bg-background/0"
                )}
            >
                <Container className="flex h-16 items-center justify-between md:h-20">
                    <div className="flex items-center gap-8">
                        <button
                            aria-label="Open menu"
                            className="lg:hidden"
                            onClick={() => setMobileOpen(true)}
                        >
                            <Menu size={20} strokeWidth={1.5} />
                        </button>

                        <nav className="hidden items-center gap-8 lg:flex">
                            {NAV_LINKS.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="text-eyebrow text-foreground/80 transition-colors hover:text-foreground"
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </nav>
                    </div>

                    <Link
                        href="/"
                        className="text-display text-xl tracking-tight md:text-2xl"
                        aria-label="STREET/01 home"
                    >
                        STREET<span className="text-accent">/</span>01
                    </Link>

                    <div className="flex items-center gap-1 md:gap-2">
                        <button
                            aria-label="Search"
                            className="hidden h-10 w-10 items-center justify-center transition-colors hover:text-accent md:flex"
                        >
                            <Search size={18} strokeWidth={1.5} />
                        </button>

                        <button
                            aria-label="Toggle theme"
                            onClick={toggle}
                            className="hidden h-10 w-10 items-center justify-center transition-colors hover:text-accent md:flex"
                        >
                            {theme === "dark" ? (
                                <Sun size={18} strokeWidth={1.5} />
                            ) : (
                                <Moon size={18} strokeWidth={1.5} />
                            )}
                        </button>

                        <Link
                            href="/account"
                            aria-label="Account"
                            className="hidden h-10 w-10 items-center justify-center transition-colors hover:text-accent md:flex"
                        >
                            <User size={18} strokeWidth={1.5} />
                        </Link>

                        <Link
                            href="/wishlist"
                            aria-label="Wishlist"
                            className="relative flex h-10 w-10 items-center justify-center transition-colors hover:text-accent"
                        >
                            <Heart size={18} strokeWidth={1.5} />
                            {displayWishlistCount > 0 && (
                                <span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center bg-foreground px-1 text-[10px] font-medium text-background">
                                    {displayWishlistCount}
                                </span>
                            )}
                        </Link>

                        <button
                            aria-label="Open cart"
                            onClick={openCart}
                            className="relative flex h-10 w-10 items-center justify-center transition-colors hover:text-accent"
                        >
                            <ShoppingBag size={18} strokeWidth={1.5} />
                            {displayCartCount > 0 && (
                                <span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center bg-accent px-1 text-[10px] font-medium text-accent-foreground">
                                    {displayCartCount}
                                </span>
                            )}
                        </button>
                    </div>
                </Container>
            </header>

            {/* Mobile drawer — unchanged from Stage 1 */}
            <div
                className={cn(
                    "fixed inset-0 z-[60] lg:hidden",
                    mobileOpen ? "pointer-events-auto" : "pointer-events-none"
                )}
            >
                <div
                    className={cn(
                        "absolute inset-0 bg-black/40 transition-opacity duration-300",
                        mobileOpen ? "opacity-100" : "opacity-0"
                    )}
                    onClick={() => setMobileOpen(false)}
                />
                <div
                    className={cn(
                        "absolute left-0 top-0 h-full w-[85%] max-w-sm bg-background p-6 transition-transform duration-300 ease-[var(--ease-out-expo)]",
                        mobileOpen ? "translate-x-0" : "-translate-x-full"
                    )}
                >
                    <div className="mb-10 flex items-center justify-between">
                        <span className="text-display text-xl">
                            STREET<span className="text-accent">/</span>01
                        </span>
                        <button
                            aria-label="Close menu"
                            onClick={() => setMobileOpen(false)}
                            className="text-eyebrow"
                        >
                            Close
                        </button>
                    </div>

                    <nav className="flex flex-col gap-6">
                        {NAV_LINKS.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setMobileOpen(false)}
                                className="text-display text-3xl"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    <div className="mt-12 flex flex-col gap-4 border-t border-border pt-6">
                        <Link
                            href="/account"
                            onClick={() => setMobileOpen(false)}
                            className="text-eyebrow"
                        >
                            Account
                        </Link>
                        <Link
                            href="/wishlist"
                            onClick={() => setMobileOpen(false)}
                            className="text-eyebrow"
                        >
                            Wishlist
                        </Link>
                        <button onClick={toggle} className="text-eyebrow text-left">
                            {theme === "dark" ? "Light mode" : "Dark mode"}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}