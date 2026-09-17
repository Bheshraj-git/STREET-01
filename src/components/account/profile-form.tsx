"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { profileSchema, type ProfileInput } from "@/lib/schemas/account";
import { updateProfile } from "@/lib/actions/profile";
import { notify } from "@/lib/toast";

export function ProfileForm({
    defaultValues,
}: {
    defaultValues: ProfileInput;
}) {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting, isDirty },
    } = useForm<ProfileInput>({
        resolver: zodResolver(profileSchema),
        defaultValues,
    });

    async function submit(values: ProfileInput) {
        const r = await updateProfile(values);
        if (!r.ok) {
            notify.error(r.error);
            return;
        }
        notify.success("Profile updated");
    }

    return (
        <form
            onSubmit={handleSubmit(submit)}
            className="flex flex-col gap-4 border border-border p-6"
            noValidate
        >
            <div>
                <label className="text-eyebrow mb-2 block">Full name</label>
                <Input {...register("name")} />
                {errors.name && (
                    <p className="mt-1 text-xs text-sale">{errors.name.message}</p>
                )}
            </div>

            <div>
                <label className="text-eyebrow mb-2 block">Phone</label>
                <Input {...register("phone")} />
                {errors.phone && (
                    <p className="mt-1 text-xs text-sale">{errors.phone.message}</p>
                )}
            </div>

            <div className="mt-2">
                <Button type="submit" disabled={isSubmitting || !isDirty}>
                    {isSubmitting ? "Saving…" : "Save changes"}
                </Button>
            </div>
        </form>
    );
}