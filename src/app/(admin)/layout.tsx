import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { requireAdmin } from "@/lib/auth/session";
export const metadata = {
    title: {
        default: "Admin",
        template: "%s · Admin · STREET/01",
    },
    robots: { index: false, follow: false },
};

export default async function AdminGroupLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const admin = await requireAdmin();

    return (
        <div className="grid min-h-screen grid-cols-1 bg-background lg:grid-cols-[240px_1fr]">
            <div className="hidden lg:sticky lg:top-0 lg:block lg:h-screen">
                <AdminSidebar adminName={admin.name ?? admin.email ?? "Admin"} />
            </div>

            <main className="min-w-0 px-5 py-8 md:px-10 md:py-12">
                {children}
            </main>
        </div>
    );
}