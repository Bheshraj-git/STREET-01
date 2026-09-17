"use server";

import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth/password";
import { registerSchema, type RegisterInput } from "@/lib/schemas/auth";

export type RegisterResult =
    | { ok: true }
    | { ok: false; error: string; field?: keyof RegisterInput };

export async function registerUser(
    input: RegisterInput
): Promise<RegisterResult> {
    const parsed = registerSchema.safeParse(input);
    if (!parsed.success) {
        const first = parsed.error.issues[0];
        return {
            ok: false,
            error: first.message,
            field: first.path[0] as keyof RegisterInput,
        };
    }

    const { name, email, password } = parsed.data;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
        return {
            ok: false,
            error: "An account with this email already exists.",
            field: "email",
        };
    }

    const passwordHash = await hashPassword(password);

    await prisma.user.create({
        data: {
            name,
            email,
            passwordHash,
            role: "CUSTOMER",
        },
    });

    return { ok: true };
}