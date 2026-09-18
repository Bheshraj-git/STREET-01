import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { getCurrentUser } from "@/lib/auth/session";

export default async function StoreLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await getCurrentUser();
    const isAdmin = (user as { role?: string } | null)?.role === "ADMIN";

    return (
        <div className="flex min-h-screen flex-col">
            <Navbar isAdmin={isAdmin} />
            <main className="flex-1">{children}</main>
            <Footer />
            <CartDrawer />
        </div>
    );
}