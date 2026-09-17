import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { requireAdmin } from "@/lib/auth/session";

export const metadata = {
    title: {
        default: "Admin",
        template: "%s · Admin · STREET/01",
    },
};

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const admin = await requireAdmin();

    return (
        <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[220px_1fr]">
            <div className="hidden lg:block lg:sticky lg:top-0 lg:h-screen">
                <AdminSidebar adminName={admin.name ?? admin.email ?? "Admin"} />
            </div>

            <main className="min-w-0 px-5 py-8 md:px-8 md:py-10">
                {children}
            </main>
        </div>
    );
}