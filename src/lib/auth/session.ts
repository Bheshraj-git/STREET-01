import "server-only";
import { auth } from "../../../auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export async function getCurrentUser() {
    const session = await auth();
    if (!session?.user) return null;

    // Defensive: if the JWT is stale and lacks an id, recover from the DB by email.
    if (!session.user.id && session.user.email) {
        const dbUser = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: { id: true, email: true, name: true, image: true, role: true },
        });
        if (!dbUser) return null;
        return {
            id: dbUser.id,
            email: dbUser.email,
            name: dbUser.name,
            image: dbUser.image,
            role: dbUser.role,
        };
    }

    return session.user;
}

export async function requireUser() {
    const user = await getCurrentUser();
    if (!user) redirect("/login");
    return user;
}

export async function requireAdmin() {
    const user = await getCurrentUser();
    if (!user) redirect("/login");
    if (user.role !== "ADMIN") redirect("/");
    return user;
}