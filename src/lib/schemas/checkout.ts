import { z } from "zod";

export const contactSchema = z.object({
    fullName: z.string().trim().min(2, "Enter your full name").max(80),
    email: z.string().trim().email("Enter a valid email"),
    phone: z
        .string()
        .trim()
        .min(7, "Enter a valid phone number")
        .max(20, "Phone number too long"),
});

export const shippingSchema = z.object({
    line1: z.string().trim().min(4, "Enter your street address").max(120),
    line2: z.string().trim().max(120).optional().or(z.literal("")),
    city: z.string().trim().min(2, "Enter your city").max(60),
    state: z.string().trim().min(2, "Enter your state/province").max(60),
    postalCode: z.string().trim().min(3, "Enter your postal code").max(12),
    country: z.string().trim().min(2).max(60),
});

export const paymentSchema = z.object({
    cardNumber: z
        .string()
        .trim()
        .transform((v) => v.replace(/\s+/g, ""))
        .refine((v) => /^\d{15,16}$/.test(v), "Enter a valid card number"),
    cardName: z.string().trim().min(2, "Enter the name on card").max(80),
    expiry: z
        .string()
        .trim()
        .refine((v) => /^(0[1-9]|1[0-2])\/\d{2}$/.test(v), "Use MM/YY format"),
    cvc: z
        .string()
        .trim()
        .refine((v) => /^\d{3,4}$/.test(v), "Enter a valid CVC"),
});

export const checkoutSchema = contactSchema
    .merge(shippingSchema)
    .merge(paymentSchema);

export type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export const orderItemSchema = z.object({
    variantId: z.string().min(1),
    quantity: z.number().int().positive().max(20),
});

export const createOrderSchema = z.object({
    items: z.array(orderItemSchema).min(1, "Cart is empty"),
    contact: contactSchema,
    shipping: shippingSchema,
    couponCode: z.string().trim().max(32).nullable().optional(),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;