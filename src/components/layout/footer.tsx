import Link from "next/link";
import { Container } from "@/components/ui/container";

function InstagramIcon({ size = 18, className }: { size?: number; className?: string }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
            <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
        </svg>
    );
}

function FacebookIcon({ size = 18, className }: { size?: number; className?: string }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
        </svg>
    );
}

const COLUMNS = [
    {
        title: "Shop",
        links: [
            { href: "/shop?sort=newest", label: "New Arrivals" },
            { href: "/shop?category=t-shirts", label: "T-Shirts" },
            { href: "/shop?category=hoodies", label: "Hoodies" },
            { href: "/shop?category=jackets", label: "Jackets" },
            { href: "/shop?category=pants", label: "Pants" },
            { href: "/shop?category=accessories", label: "Accessories" },
        ],
    },
    {
        title: "Help",
        links: [
            { href: "/contact", label: "Contact" },
            { href: "/shipping", label: "Shipping" },
            { href: "/returns", label: "Returns" },
            { href: "/faq", label: "FAQ" },
            { href: "/size-guide", label: "Size Guide" },
        ],
    },
    {
        title: "Company",
        links: [
            { href: "/about", label: "About" },
            { href: "/about#story", label: "Our Story" },
            { href: "/careers", label: "Careers" },
        ],
    },
];

export function Footer() {
    return (
        <footer className="mt-24 border-t border-border">
            <Container className="py-16 md:py-20">
                <div className="grid grid-cols-2 gap-10 md:grid-cols-4 md:gap-8">
                    <div className="col-span-2 md:col-span-1">
                        <div className="text-display text-2xl">
                            STREET<span className="text-accent">/</span>01
                        </div>
                        <p className="mt-4 max-w-[24ch] text-sm text-muted-foreground">
                            Wear your attitude. Independent streetwear, built for everyday.
                        </p>
                    </div>

                    {COLUMNS.map((col) => (
                        <div key={col.title}>
                            <h3 className="text-eyebrow mb-5">{col.title}</h3>
                            <ul className="flex flex-col gap-3">
                                {col.links.map((link) => (
                                    <li key={link.href}>
                                        <Link
                                            href={link.href}
                                            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="mt-16 flex flex-col items-start justify-between gap-6 border-t border-border pt-8 md:flex-row md:items-center">
                    <p className="text-xs text-muted-foreground">
                        © {new Date().getFullYear()} STREET/01. All rights reserved.
                    </p>

                    <div className="flex items-center gap-4">
                        <a
                            href="https://instagram.com"
                            aria-label="Instagram"
                            className="text-muted-foreground transition-colors hover:text-foreground"
                        >
                            <InstagramIcon size={18} />
                        </a>
                        <a
                            href="https://facebook.com"
                            aria-label="Facebook"
                            className="text-muted-foreground transition-colors hover:text-foreground"
                        >
                            <FacebookIcon size={18} />
                        </a>
                    </div>
                </div>
            </Container>
        </footer>
    );
}