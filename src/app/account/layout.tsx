import { Container } from "@/components/ui/container";
import { AccountSidebar } from "@/components/account/account-sidebar";
import { SignOutButton } from "@/components/account/sign-out-button";
import { requireUser } from "@/lib/auth/session";

export default async function AccountLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await requireUser();

    return (
        <Container className="py-12 md:py-16">
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
                <AccountSidebar />
                <div>{children}</div>
            </div>
        </Container>
    );
}