import type { NextAuthConfig } from "next-auth";

export const authConfig = {
    pages: {
        signIn: "/login",
        error: "/login",
    },
    session: {
        strategy: "jwt",
        maxAge: 60 * 60 * 24 * 30, // 30 days
    },
    callbacks: {
        authorized({ auth, request }) {
            const isLoggedIn = !!auth?.user;
            const role = (auth?.user as { role?: string } | undefined)?.role;
            const path = request.nextUrl.pathname;

            if (path.startsWith("/admin")) {
                return isLoggedIn && role === "ADMIN";
            }
            if (path.startsWith("/account")) {
                return isLoggedIn;
            }
            return true;
        },
        jwt({ token, user }) {
            if (user) {
                token.id = user.id as string;
                token.role = (user as { role?: string }).role ?? "CUSTOMER";
            }
            return token;
        },
        session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                (session.user as { role?: string }).role = token.role as string;
            }
            return session;
        },
    },
    providers: [],
} satisfies NextAuthConfig;