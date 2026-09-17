import { z } from "zod";

export const addressSchema = z.object({
    label: z.string().trim().max(40).optional().or(z.literal("")),
    fullName: z.string().trim().min(2, "Enter recipient name").max(80),
    phone: z.string().trim().max(20).optional().or(z.literal("")),
    line1: z.string().trim().min(4, "Enter street address").max(120),
    line2: z.string().trim().max(120).optional().or(z.literal("")),
    city: z.string().trim().min(2, "Enter city").max(60),
    state: z.string().trim().min(2, "Enter state/province").max(60),
    postalCode: z.string().trim().min(3, "Enter postal code").max(12),
    country: z.string().trim().min(2).max(60),
    isDefault: z.boolean(),
});

export type AddressInput = z.infer<typeof addressSchema>;

export const profileSchema = z.object({
    name: z.string().trim().min(2, "Enter your name").max(60),
    phone: z
        .string()
        .trim()
        .max(20, "Phone number too long")
        .optional()
        .or(z.literal("")),
});

export type ProfileInput = z.infer<typeof profileSchema>;

export const passwordChangeSchema = z
    .object({
        currentPassword: z.string().min(1, "Enter your current password"),
        newPassword: z
            .string()
            .min(8, "At least 8 characters")
            .max(72)
            .regex(/[A-Z]/, "Add at least one uppercase letter")
            .regex(/[a-z]/, "Add at least one lowercase letter")
            .regex(/[0-9]/, "Add at least one number"),
        confirmPassword: z.string(),
    })
    .refine((d) => d.newPassword === d.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

export type PasswordChangeInput = z.infer<typeof passwordChangeSchema>;