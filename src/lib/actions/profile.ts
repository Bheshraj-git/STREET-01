"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "../../../auth";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import {
    passwordChangeSchema,
    profileSchema,
    type PasswordChangeInput,
    type ProfileInput,
} from "@/lib/schemas/account";

export type ActionResult =
    | { ok: true }
    | { ok: false; error: string; field?: string };

export async function updateProfile(input: ProfileInput): Promise<ActionResult> {
    const parsed = profileSchema.safeParse(input);
    if (!parsed.success) {
        const i = parsed.error.issues[0];
        return { ok: false, error: i.message, field: i.path[0] as string };
    }

    const session = await auth();
    if (!session?.user?.id) return { ok: false, error: "Not authenticated." };

    await prisma.user.update({
        where: { id: session.user.id },
        data: {
            name: parsed.data.name,
            phone: parsed.data.phone || null,
        },
    });

    revalidatePath("/account");
    revalidatePath("/account/profile");
    return { ok: true };
}

export async function changePassword(
    input: PasswordChangeInput
): Promise<ActionResult> {
    const parsed = passwordChangeSchema.safeParse(input);
    if (!parsed.success) {
        const i = parsed.error.issues[0];
        return { ok: false, error: i.message, field: i.path[0] as string };
    }

    const session = await auth();
    if (!session?.user?.id) return { ok: false, error: "Not authenticated." };

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { passwordHash: true },
    });

    if (!user?.passwordHash) {
        return { ok: false, error: "Password change unavailable for this account." };
    }

    const ok = await verifyPassword(parsed.data.currentPassword, user.passwordHash);
    if (!ok) {
        return {
            ok: false,
            error: "Current password is incorrect.",
            field: "currentPassword",
        };
    }

    const newHash = await hashPassword(parsed.data.newPassword);

    await prisma.user.update({
        where: { id: session.user.id },
        data: { passwordHash: newHash },
    });

    return { ok: true };
}