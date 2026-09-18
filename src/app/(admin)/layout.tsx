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
        <div className="min-h-screen bg-background">
            {/* Sidebar — sticky on desktop, fixed drawer on mobile */}
            <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:flex lg:w-[240px] lg:flex-col">
                <AdminSidebar adminName={admin.name ?? admin.email ?? "Admin"} />
            </div>

            {/* Mobile sidebar (renders mobile top bar + drawer inside) */}
            <div className="lg:hidden">
                <AdminSidebar adminName={admin.name ?? admin.email ?? "Admin"} />
            </div>

            {/* Main content — offset for fixed sidebar on desktop, top bar on mobile */}
            <main className="min-h-screen lg:pl-[240px]">
                <div className="px-5 py-8 pt-20 md:px-10 md:py-12 lg:pt-12">
                    {children}
                </div>
            </main>
        </div>
    );
}