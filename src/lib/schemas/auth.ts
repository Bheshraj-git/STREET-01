import { z } from "zod";

export const registerSchema = z
    .object({
        name: z.string().trim().min(2, "Enter your name").max(60),
        email: z.string().trim().toLowerCase().email("Enter a valid email"),
        password: z
            .string()
            .min(8, "Password must be at least 8 characters")
            .max(72, "Password is too long")
            .regex(/[A-Z]/, "Add at least one uppercase letter")
            .regex(/[a-z]/, "Add at least one lowercase letter")
            .regex(/[0-9]/, "Add at least one number"),
        confirmPassword: z.string(),
    })
    .refine((d) => d.password === d.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
    email: z.string().trim().toLowerCase().email("Enter a valid email"),
    password: z.string().min(1, "Enter your password"),
});

export type LoginInput = z.infer<typeof loginSchema>;