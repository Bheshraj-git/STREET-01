"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "../../../auth";
import { addressSchema, type AddressInput } from "@/lib/schemas/account";

export type ActionResult =
    | { ok: true }
    | { ok: false; error: string; field?: string };

async function requireUserId() {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Not authenticated");
    return session.user.id;
}

export async function createAddress(input: AddressInput): Promise<ActionResult> {
    const parsed = addressSchema.safeParse(input);
    if (!parsed.success) {
        const i = parsed.error.issues[0];
        return { ok: false, error: i.message, field: i.path[0] as string };
    }

    const userId = await requireUserId();
    const data = parsed.data;

    // If setting as default, unset all others
    if (data.isDefault) {
        await prisma.address.updateMany({
            where: { userId },
            data: { isDefault: false },
        });
    }

    await prisma.address.create({
        data: {
            userId,
            label: data.label || null,
            fullName: data.fullName,
            phone: data.phone || null,
            line1: data.line1,
            line2: data.line2 || null,
            city: data.city,
            state: data.state,
            postalCode: data.postalCode,
            country: data.country,
            isDefault: data.isDefault ?? false,
        },
    });

    revalidatePath("/account/addresses");
    return { ok: true };
}

export async function updateAddress(
    id: string,
    input: AddressInput
): Promise<ActionResult> {
    const parsed = addressSchema.safeParse(input);
    if (!parsed.success) {
        const i = parsed.error.issues[0];
        return { ok: false, error: i.message, field: i.path[0] as string };
    }

    const userId = await requireUserId();

    const existing = await prisma.address.findFirst({
        where: { id, userId },
    });
    if (!existing) return { ok: false, error: "Address not found." };

    const data = parsed.data;

    if (data.isDefault) {
        await prisma.address.updateMany({
            where: { userId, NOT: { id } },
            data: { isDefault: false },
        });
    }

    await prisma.address.update({
        where: { id },
        data: {
            label: data.label || null,
            fullName: data.fullName,
            phone: data.phone || null,
            line1: data.line1,
            line2: data.line2 || null,
            city: data.city,
            state: data.state,
            postalCode: data.postalCode,
            country: data.country,
            isDefault: data.isDefault ?? false,
        },
    });

    revalidatePath("/account/addresses");
    return { ok: true };
}

export async function deleteAddress(id: string): Promise<ActionResult> {
    const userId = await requireUserId();

    const existing = await prisma.address.findFirst({
        where: { id, userId },
    });
    if (!existing) return { ok: false, error: "Address not found." };

    await prisma.address.delete({ where: { id } });

    revalidatePath("/account/addresses");
    return { ok: true };
}

export async function setDefaultAddress(id: string): Promise<ActionResult> {
    const userId = await requireUserId();

    const existing = await prisma.address.findFirst({
        where: { id, userId },
    });
    if (!existing) return { ok: false, error: "Address not found." };

    await prisma.address.updateMany({
        where: { userId },
        data: { isDefault: false },
    });
    await prisma.address.update({
        where: { id },
        data: { isDefault: true },
    });

    revalidatePath("/account/addresses");
    return { ok: true };
}