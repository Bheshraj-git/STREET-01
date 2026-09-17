"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { addressSchema, type AddressInput } from "@/lib/schemas/account";
import { notify } from "@/lib/toast";

export function AddressForm({
    initial,
    onCancel,
    submitLabel = "Save address",
}: {
    initial?: Partial<AddressInput>;
    onCancel: () => void;
    submitLabel?: string;
}) {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setError,
    } = useForm<AddressInput>({
        resolver: zodResolver(addressSchema),
        defaultValues: {
            country: "Nepal",
            isDefault: false,
            ...initial,
        },
    });

    async function submit(values: AddressInput) {
        //const result = await onSubmitAction(values);
        if (!result.ok) {
            if (result.field) {
                setError(result.field as keyof AddressInput, { message: result.error });
            } else {
                notify.error(result.error ?? "Could not save address.");
            }
            return;
        }
        notify.success("Address saved");
    }

    return (
        <form
            className="flex flex-col gap-4 border border-border p-5"
            noValidate
        >
            <div className="grid gap-4 sm:grid-cols-2">
                <div>
                    <label className="text-eyebrow mb-2 block">Label (optional)</label>
                    <Input placeholder="Home, Work…" {...register("label")} />
                </div>
                <div>
                    <label className="text-eyebrow mb-2 block">Recipient</label>
                    <Input {...register("fullName")} />
                    {errors.fullName && (
                        <p className="mt-1 text-xs text-sale">{errors.fullName.message}</p>
                    )}
                </div>
            </div>

            <div>
                <label className="text-eyebrow mb-2 block">Phone (optional)</label>
                <Input {...register("phone")} />
            </div>

            <div>
                <label className="text-eyebrow mb-2 block">Street address</label>
                <Input {...register("line1")} />
                {errors.line1 && (
                    <p className="mt-1 text-xs text-sale">{errors.line1.message}</p>
                )}
            </div>

            <div>
                <label className="text-eyebrow mb-2 block">
                    Apartment, suite, etc. (optional)
                </label>
                <Input {...register("line2")} />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                <div>
                    <label className="text-eyebrow mb-2 block">City</label>
                    <Input {...register("city")} />
                    {errors.city && (
                        <p className="mt-1 text-xs text-sale">{errors.city.message}</p>
                    )}
                </div>
                <div>
                    <label className="text-eyebrow mb-2 block">State / Province</label>
                    <Input {...register("state")} />
                    {errors.state && (
                        <p className="mt-1 text-xs text-sale">{errors.state.message}</p>
                    )}
                </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                <div>
                    <label className="text-eyebrow mb-2 block">Postal code</label>
                    <Input {...register("postalCode")} />
                    {errors.postalCode && (
                        <p className="mt-1 text-xs text-sale">{errors.postalCode.message}</p>
                    )}
                </div>
                <div>
                    <label className="text-eyebrow mb-2 block">Country</label>
                    <Input {...register("country")} />
                    {errors.country && (
                        <p className="mt-1 text-xs text-sale">{errors.country.message}</p>
                    )}
                </div>
            </div>

            <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" {...register("isDefault")} className="accent-accent" />
                Set as default address
            </label>

            <div className="mt-2 flex gap-2">
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Saving…" : submitLabel}
                </Button>
                <Button type="button" variant="ghost" onClick={onCancel}>
                    Cancel
                </Button>
            </div>
        </form>
    );
}