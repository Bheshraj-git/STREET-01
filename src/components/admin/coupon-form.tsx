"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { notify } from "@/lib/toast";
import {
    createCoupon,
    updateCoupon,
    type CouponInput,
} from "@/lib/actions/admin/coupons";

export function CouponForm({
    mode,
    id,
    initialValues,
    onCancel,
}: {
    mode: "create" | "edit";
    id?: string;
    initialValues?: Partial<CouponInput>;
    onCancel: () => void;
}) {
    const router = useRouter();
    const [submitting, setSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
        setError,
    } = useForm<CouponInput>({
        defaultValues: {
            code: "",
            description: "",
            discountType: "PERCENTAGE",
            discountValue: 10,
            minOrderAmount: null,
            maxUses: null,
            startsAt: null,
            expiresAt: null,
            active: true,
            ...initialValues,
        },
    });

    const type = watch("discountType");

    async function submit(values: CouponInput) {
        setSubmitting(true);
        const action =
            mode === "create"
                ? (v: CouponInput) => createCoupon(v)
                : (v: CouponInput) => updateCoupon(id!, v);
        const r = await action(values);

        if (!r.ok) {
            if (r.field) {
                setError(r.field as keyof CouponInput, { message: r.error });
            }
            notify.error(r.error ?? "Could not save coupon.");
            setSubmitting(false);
            return;
        }
        notify.success(mode === "create" ? "Coupon created" : "Coupon updated");
        router.refresh();
    }

    return (
        <form
            onSubmit={handleSubmit(submit)}
            className="flex flex-col gap-4 border border-border p-5"
            noValidate
        >
            <div className="grid gap-4 sm:grid-cols-2">
                <div>
                    <label className="text-eyebrow mb-2 block">Code</label>
                    <Input
                        {...register("code")}
                        placeholder="STREET10"
                        className="font-mono uppercase tracking-wider"
                        style={{ textTransform: "uppercase" }}
                    />
                    {errors.code && (
                        <p className="mt-1 text-xs text-sale">{errors.code.message}</p>
                    )}
                </div>
                <div>
                    <label className="text-eyebrow mb-2 block">Description</label>
                    <Input {...register("description")} />
                </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
                <div>
                    <label className="text-eyebrow mb-2 block">Type</label>
                    <select
                        {...register("discountType")}
                        className="h-12 w-full border border-border bg-background px-3 text-sm outline-none focus:border-foreground"
                    >
                        <option value="PERCENTAGE">Percentage (%)</option>
                        <option value="FIXED">Fixed amount (Rs.)</option>
                    </select>
                </div>
                <div>
                    <label className="text-eyebrow mb-2 block">
                        Value {type === "PERCENTAGE" ? "(%)" : "(Rs.)"}
                    </label>
                    <Input
                        type="number"
                        step="1"
                        {...register("discountValue", { valueAsNumber: true })}
                    />
                    {errors.discountValue && (
                        <p className="mt-1 text-xs text-sale">
                            {errors.discountValue.message}
                        </p>
                    )}
                </div>
                <div>
                    <label className="text-eyebrow mb-2 block">
                        Min order (Rs.) — optional
                    </label>
                    <Input
                        type="number"
                        {...register("minOrderAmount", {
                            setValueAs: (v) => (v === "" ? null : Number(v)),
                        })}
                    />
                </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
                <div>
                    <label className="text-eyebrow mb-2 block">Max uses — optional</label>
                    <Input
                        type="number"
                        {...register("maxUses", {
                            setValueAs: (v) => (v === "" ? null : Number(v)),
                        })}
                    />
                </div>
                <div>
                    <label className="text-eyebrow mb-2 block">Starts at — optional</label>
                    <Input
                        type="date"
                        {...register("startsAt", {
                            setValueAs: (v) => (v === "" ? null : v),
                        })}
                    />
                </div>
                <div>
                    <label className="text-eyebrow mb-2 block">Expires at — optional</label>
                    <Input
                        type="date"
                        {...register("expiresAt", {
                            setValueAs: (v) => (v === "" ? null : v),
                        })}
                    />
                </div>
            </div>

            <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" {...register("active")} className="accent-accent" />
                Active
            </label>

            <div className="mt-2 flex gap-2">
                <Button type="submit" disabled={submitting}>
                    {submitting ? "Saving…" : mode === "create" ? "Create" : "Update"}
                </Button>
                <Button type="button" variant="ghost" onClick={onCancel}>
                    Cancel
                </Button>
            </div>
        </form>
    );
}