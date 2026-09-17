"use client";

import type { UseFormRegister, FieldErrors } from "react-hook-form";
import { Input } from "@/components/ui/input";
import type { CheckoutFormValues } from "@/lib/schemas/checkout";

export function ContactStep({
    register,
    errors,
}: {
    register: UseFormRegister<CheckoutFormValues>;
    errors: FieldErrors<CheckoutFormValues>;
}) {
    return (
        <section>
            <div className="mb-6">
                <p className="text-eyebrow text-muted-foreground">01 · Contact</p>
                <h2 className="text-display mt-2 text-2xl">Who's this for?</h2>
            </div>

            <div className="flex flex-col gap-4">
                <div>
                    <label htmlFor="fullName" className="text-eyebrow mb-2 block">
                        Full name
                    </label>
                    <Input
                        id="fullName"
                        autoComplete="name"
                        {...register("fullName")}
                        aria-invalid={!!errors.fullName}
                    />
                    {errors.fullName && (
                        <p className="mt-1 text-xs text-sale">{errors.fullName.message}</p>
                    )}
                </div>

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
                    <label htmlFor="phone" className="text-eyebrow mb-2 block">
                        Phone
                    </label>
                    <Input
                        id="phone"
                        type="tel"
                        autoComplete="tel"
                        {...register("phone")}
                        aria-invalid={!!errors.phone}
                    />
                    {errors.phone && (
                        <p className="mt-1 text-xs text-sale">{errors.phone.message}</p>
                    )}
                </div>
            </div>
        </section>
    );
}