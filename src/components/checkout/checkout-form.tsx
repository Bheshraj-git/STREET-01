"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { ContactStep } from "./contact-step";
import { ShippingStep } from "./shipping-step";
import { PaymentStep } from "./payment-step";
import { OrderSummary } from "./order-summary";
import { CouponInput, type AppliedCoupon } from "./coupon-input";
import { useCartStore } from "@/lib/stores/cart-store";
import { useMounted } from "@/lib/hooks/use-mounted";
import { notify } from "@/lib/toast";
import { checkoutSchema, type CheckoutFormValues } from "@/lib/schemas/checkout";

export function CheckoutForm() {
    const router = useRouter();
    const mounted = useMounted();
    const items = useCartStore((s) => s.items);
    const subtotal = useCartStore((s) => s.subtotal());
    const clear = useCartStore((s) => s.clear);

    const [applied, setApplied] = useState<AppliedCoupon | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [serverError, setServerError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<CheckoutFormValues>({
        resolver: zodResolver(checkoutSchema),
        defaultValues: {
            country: "Nepal",
        },
        mode: "onBlur",
    });

    async function onSubmit(values: CheckoutFormValues) {
        setSubmitting(true);
        setServerError(null);

        try {
            const payload = {
                items: items.map((i) => ({
                    variantId: i.variantId,
                    quantity: i.quantity,
                })),
                contact: {
                    fullName: values.fullName,
                    email: values.email,
                    phone: values.phone,
                },
                shipping: {
                    line1: values.line1,
                    line2: values.line2 ?? "",
                    city: values.city,
                    state: values.state,
                    postalCode: values.postalCode,
                    country: values.country,
                },
                couponCode: applied?.code ?? null,
            };

            const res = await fetch("/api/orders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (!res.ok) {
                setServerError(data.error ?? "Could not place order.");
                notify.error(data.error ?? "Could not place order.");
                setSubmitting(false);
                return;
            }

            // Success — clear cart, toast, redirect
            clear();
            notify.success("Order placed");
            router.push(`/orders/${data.orderNumber}`);
        } catch {
            setServerError("Network error. Please try again.");
            notify.error("Network error. Please try again.");
            setSubmitting(false);
        }
    }

    if (!mounted) {
        return (
            <div className="h-96 animate-pulse bg-muted" aria-hidden="true" />
        );
    }

    if (items.length === 0) {
        return (
            <div className="border border-border p-12 text-center">
                <p className="text-eyebrow text-muted-foreground">Empty bag</p>
                <h2 className="text-display mt-3 text-2xl">
                    There's nothing to check out.
                </h2>
                <Button className="mt-6" onClick={() => router.push("/shop")}>
                    Continue shopping
                </Button>
            </div>
        );
    }

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid gap-12 lg:grid-cols-[1fr_400px]"
            noValidate
        >
            <div className="flex flex-col gap-12">
                <ContactStep register={register} errors={errors} />
                <ShippingStep register={register} errors={errors} />
                <PaymentStep register={register} errors={errors} />
            </div>

            <aside className="lg:sticky lg:top-24 lg:h-fit">
                <OrderSummary applied={applied} />

                <div className="mt-6">
                    <p className="text-eyebrow mb-3">Have a code?</p>
                    <CouponInput
                        subtotal={subtotal}
                        applied={applied}
                        onApplied={(c) => {
                            setApplied(c);
                            notify.success(`${c.code} applied`);
                        }}
                        onCleared={() => setApplied(null)}
                    />
                </div>

                {serverError && (
                    <div className="mt-6 border border-sale/40 bg-sale/5 px-4 py-3 text-xs text-sale">
                        {serverError}
                    </div>
                )}

                <Button
                    type="submit"
                    size="lg"
                    disabled={submitting}
                    className="mt-6 w-full"
                >
                    {submitting ? "Processing…" : "Place order"}
                </Button>

                <p className="mt-3 text-center text-xs text-muted-foreground">
                    By placing this order you agree to our terms and privacy policy.
                </p>
            </aside>
        </form>
    );
}