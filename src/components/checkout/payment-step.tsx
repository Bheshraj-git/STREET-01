"use client";

import type { UseFormRegister, FieldErrors } from "react-hook-form";
import { Lock } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { CheckoutFormValues } from "@/lib/schemas/checkout";

export function PaymentStep({
    register,
    errors,
}: {
    register: UseFormRegister<CheckoutFormValues>;
    errors: FieldErrors<CheckoutFormValues>;
}) {
    return (
        <section>
            <div className="mb-6">
                <p className="text-eyebrow text-muted-foreground">03 · Payment</p>
                <h2 className="text-display mt-2 text-2xl">Secure payment</h2>
                <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Lock size={11} strokeWidth={2} />
                    Sandbox mode — no real charge will be made
                </p>
            </div>

            <div className="flex flex-col gap-4">
                <div>
                    <label htmlFor="cardNumber" className="text-eyebrow mb-2 block">
                        Card number
                    </label>
                    <Input
                        id="cardNumber"
                        inputMode="numeric"
                        autoComplete="cc-number"
                        placeholder="4242 4242 4242 4242"
                        {...register("cardNumber")}
                        aria-invalid={!!errors.cardNumber}
                    />
                    {errors.cardNumber && (
                        <p className="mt-1 text-xs text-sale">
                            {errors.cardNumber.message}
                        </p>
                    )}
                </div>

                <div>
                    <label htmlFor="cardName" className="text-eyebrow mb-2 block">
                        Name on card
                    </label>
                    <Input
                        id="cardName"
                        autoComplete="cc-name"
                        {...register("cardName")}
                        aria-invalid={!!errors.cardName}
                    />
                    {errors.cardName && (
                        <p className="mt-1 text-xs text-sale">
                            {errors.cardName.message}
                        </p>
                    )}
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <div>
                        <label htmlFor="expiry" className="text-eyebrow mb-2 block">
                            Expiry (MM/YY)
                        </label>
                        <Input
                            id="expiry"
                            placeholder="12/28"
                            inputMode="numeric"
                            autoComplete="cc-exp"
                            {...register("expiry")}
                            aria-invalid={!!errors.expiry}
                        />
                        {errors.expiry && (
                            <p className="mt-1 text-xs text-sale">{errors.expiry.message}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="cvc" className="text-eyebrow mb-2 block">
                            CVC
                        </label>
                        <Input
                            id="cvc"
                            inputMode="numeric"
                            autoComplete="cc-csc"
                            maxLength={4}
                            {...register("cvc")}
                            aria-invalid={!!errors.cvc}
                        />
                        {errors.cvc && (
                            <p className="mt-1 text-xs text-sale">{errors.cvc.message}</p>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}