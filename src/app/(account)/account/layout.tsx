import { Container } from "@/components/ui/container";
import { AccountSidebar } from "@/components/account/account-sidebar";
import { SignOutButton } from "@/components/account/sign-out-button";
import { requireUser } from "@/lib/auth/session";
import Link from "next/link";
import { LayoutDashboard } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
    robots: { index: false, follow: false },
};

export default async function AccountLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await requireUser();
    const isAdmin = (user as { role?: string }).role === "ADMIN";

    return (
        <Container className="py-12 md:py-16">
            {/* Admin banner */}
            {isAdmin && (
                <Link
                    href="/admin"
                    className="mb-6 flex items-center gap-2 border border-accent/30 bg-accent/10 px-4 py-3 text-xs font-medium uppercase tracking-wider text-accent transition-colors hover:bg-accent/20"
                >
                    <LayoutDashboard size={14} />
                    You are logged in as an Admin — Go to Admin Dashboard →
                </Link>
            )}

            <div className="mb-10 flex items-end justify-between gap-4">
                <div>
                    <p className="text-eyebrow text-muted-foreground">Account</p>
                    <h1 className="text-display mt-3 text-3xl md:text-5xl">
                        Hi, {user.name ?? "friend"}.
                    </h1>
                </div>
                <SignOutButton />
            </div>

            <div className="grid gap-8 md:grid-cols-[200px_1fr] md:gap-12">
                <AccountSidebar isAdmin={isAdmin} />
                <div>{children}</div>
            </div>
        </Container>
    );
}