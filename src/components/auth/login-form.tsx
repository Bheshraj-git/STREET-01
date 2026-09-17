"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { loginSchema, type LoginInput } from "@/lib/schemas/auth";
import { useCartStore } from "@/lib/stores/cart-store";
import { useWishlistStore } from "@/lib/stores/wishlist-store";
import { mergeGuestCart, mergeGuestWishlist } from "@/lib/actions/cart-sync";
import { notify } from "@/lib/toast";

export function LoginForm() {
    const router = useRouter();
    const params = useSearchParams();
    const callbackUrl = params.get("callbackUrl") ?? "/account";

    const cartItems = useCartStore((s) => s.items);
    const clearCart = useCartStore((s) => s.clear);
    const wishlistItems = useWishlistStore((s) => s.items);
    const clearWishlist = useWishlistStore((s) => s.clear);

    const [serverError, setServerError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginInput>({
        resolver: zodResolver(loginSchema),
    });

    async function onSubmit(values: LoginInput) {
        setSubmitting(true);
        setServerError(null);

        const result = await signIn("credentials", {
            email: values.email,
            password: values.password,
            redirect: false,
        });

        if (!result || result.error) {
            setServerError("Invalid email or password.");
            setSubmitting(false);
            return;
        }

        // Merge guest state into DB (best-effort)
        try {
            if (cartItems.length > 0) {
                await mergeGuestCart(
                    cartItems.map((i) => ({
                        variantId: i.variantId,
                        quantity: i.quantity,
                    }))
                );
                clearCart();
            }
            if (wishlistItems.length > 0) {
                await mergeGuestWishlist(
                    wishlistItems.map((i) => ({ productId: i.productId }))
                );
                clearWishlist();
            }
        } catch {
            // Non-fatal — continue login
        }

        notify.success("Welcome back");
        router.push(callbackUrl);
        router.refresh();
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>
            <div>
                <label htmlFor="email" className="text-eyebrow mb-2 block">
                    Email
                </label>
                <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    {...register("email")}
                    aria-invalid={!!errors.email}
                />
                {errors.email && (
                    <p className="mt-1 text-xs text-sale">{errors.email.message}</p>
                )}
            </div>

            <div>
                <div className="mb-2 flex items-center justify-between">
                    <label htmlFor="password" className="text-eyebrow">
                        Password
                    </label>
                </div>
                <Input
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    {...register("password")}
                    aria-invalid={!!errors.password}
                />
                {errors.password && (
                    <p className="mt-1 text-xs text-sale">{errors.password.message}</p>
                )}
            </div>

            {serverError && (
                <div className="border border-sale/40 bg-sale/5 px-4 py-3 text-xs text-sale">
                    {serverError}
                </div>
            )}

            <Button type="submit" size="lg" disabled={submitting} className="mt-2 w-full">
                {submitting ? "Signing in…" : "Sign in"}
            </Button>
        </form>
    );
}