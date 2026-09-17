import Link from "next/link";
import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/auth-shell";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata: Metadata = { title: "Create account" };

export default function RegisterPage() {
    return (
        <AuthShell
            eyebrow="Join the label"
            heading="Create account"
            subheading="Save your details, track orders, and get early access to drops."
            footer={
                <>
                    Already have an account?{" "}
                    <Link href="/login" className="text-foreground underline underline-offset-4">
                        Sign in
                    </Link>
                </>
            }
        >
            <RegisterForm />
        </AuthShell>
    );
}