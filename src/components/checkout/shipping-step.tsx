"use client";

import type { UseFormRegister, FieldErrors } from "react-hook-form";
import { Input } from "@/components/ui/input";
import type { CheckoutFormValues } from "@/lib/schemas/checkout";

export function ShippingStep({
    register,
    errors,
}: {
    register: UseFormRegister<CheckoutFormValues>;
    errors: FieldErrors<CheckoutFormValues>;
}) {
    return (
        <section>
            <div className="mb-6">
                <p className="text-eyebrow text-muted-foreground">02 · Shipping</p>
                <h2 className="text-display mt-2 text-2xl">Where's it going?</h2>
            </div>

            <div className="flex flex-col gap-4">
                <div>
                    <label htmlFor="line1" className="text-eyebrow mb-2 block">
                        Street address
                    </label>
                    <Input
                        id="line1"
                        autoComplete="address-line1"
                        {...register("line1")}
                        aria-invalid={!!errors.line1}
                    />
                    {errors.line1 && (
                        <p className="mt-1 text-xs text-sale">{errors.line1.message}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="line2" className="text-eyebrow mb-2 block">
                        Apartment, suite, etc. (optional)
                    </label>
                    <Input
                        id="line2"
                        autoComplete="address-line2"
                        {...register("line2")}
                    />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <div>
                        <label htmlFor="city" className="text-eyebrow mb-2 block">
                            City
                        </label>
                        <Input
                            id="city"
                            autoComplete="address-level2"
                            {...register("city")}
                            aria-invalid={!!errors.city}
                        />
                        {errors.city && (
                            <p className="mt-1 text-xs text-sale">{errors.city.message}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="state" className="text-eyebrow mb-2 block">
                            State / Province
                        </label>
                        <Input
                            id="state"
                            autoComplete="address-level1"
                            {...register("state")}
                            aria-invalid={!!errors.state}
                        />
                        {errors.state && (
                            <p className="mt-1 text-xs text-sale">{errors.state.message}</p>
                        )}
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <div>
                        <label htmlFor="postalCode" className="text-eyebrow mb-2 block">
                            Postal code
                        </label>
                        <Input
                            id="postalCode"
                            autoComplete="postal-code"
                            {...register("postalCode")}
                            aria-invalid={!!errors.postalCode}
                        />
                        {errors.postalCode && (
                            <p className="mt-1 text-xs text-sale">
                                {errors.postalCode.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="country" className="text-eyebrow mb-2 block">
                            Country
                        </label>
                        <Input
                            id="country"
                            autoComplete="country-name"
                            {...register("country")}
                            aria-invalid={!!errors.country}
                        />
                        {errors.country && (
                            <p className="mt-1 text-xs text-sale">{errors.country.message}</p>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}