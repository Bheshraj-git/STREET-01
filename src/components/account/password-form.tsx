"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    passwordChangeSchema,
    type PasswordChangeInput,
} from "@/lib/schemas/account";
import { changePassword } from "@/lib/actions/profile";
import { notify } from "@/lib/toast";

export function PasswordForm() {
    const {
        register,
        handleSubmit,
        reset,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<PasswordChangeInput>({
        resolver: zodResolver(passwordChangeSchema),
    });

    async function submit(values: PasswordChangeInput) {
        const r = await changePassword(values);
        if (!r.ok) {
            if (r.field) {
                setError(r.field as keyof PasswordChangeInput, { message: r.error });
            } else {
                notify.error(r.error);
            }
            return;
        }
        notify.success("Password changed");
        reset();
    }

    return (
        <form
            onSubmit={handleSubmit(submit)}
            className="flex flex-col gap-4 border border-border p-6"
            noValidate
        >
            <div>
                <label className="text-eyebrow mb-2 block">Current password</label>
                <Input type="password" autoComplete="current-password" {...register("currentPassword")} />
                {errors.currentPassword && (
                    <p className="mt-1 text-xs text-sale">
                        {errors.currentPassword.message}
                    </p>
                )}
            </div>

            <div>
                <label className="text-eyebrow mb-2 block">New password</label>
                <Input type="password" autoComplete="new-password" {...register("newPassword")} />
                {errors.newPassword && (
                    <p className="mt-1 text-xs text-sale">{errors.newPassword.message}</p>
                )}
            </div>

            <div>
                <label className="text-eyebrow mb-2 block">Confirm new password</label>
                <Input type="password" autoComplete="new-password" {...register("confirmPassword")} />
                {errors.confirmPassword && (
                    <p className="mt-1 text-xs text-sale">
                        {errors.confirmPassword.message}
                    </p>
                )}
            </div>

            <div className="mt-2">
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Updating…" : "Change password"}
                </Button>
            </div>
        </form>
    );
}