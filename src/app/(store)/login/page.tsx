import { Suspense } from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/auth-shell";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
    title: "Sign in",
    robots: { index: false, follow: false },
};

export default function LoginPage() {
    return (
        <AuthShell
            eyebrow="Welcome back"
            heading="Sign in"
            subheading="Access your orders, saved addresses and wishlist."
            footer={
                <>
                    New here?{" "}
                    <Link href="/register" className="text-foreground underline underline-offset-4">
                        Create an account
                    </Link>
                </>
            }
        >
            <Suspense fallback={<div className="h-64" />}>
                <LoginForm />
            </Suspense>
        </AuthShell>
    );
}