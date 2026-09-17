"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { notify } from "@/lib/toast";
import {
    createCategory,
    updateCategory,
    type CategoryInput,
} from "@/lib/actions/admin/categories";

export function CategoryForm({
    mode,
    id,
    initialValues,
    onCancel,
}: {
    mode: "create" | "edit";
    id?: string;
    initialValues?: Partial<CategoryInput>;
    onCancel: () => void;
}) {
    const router = useRouter();
    const [submitting, setSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
    } = useForm<CategoryInput>({
        defaultValues: {
            name: "",
            slug: "",
            description: "",
            image: "",
            visible: true,
            sortOrder: 0,
            ...initialValues,
        },
    });

    async function submit(values: CategoryInput) {
        setSubmitting(true);
        const action =
            mode === "create"
                ? (v: CategoryInput) => createCategory(v)
                : (v: CategoryInput) => updateCategory(id!, v);

        const r = await action(values);

        if (!r.ok) {
            if (r.field) {
                setError(r.field as keyof CategoryInput, { message: r.error });
            }
            notify.error(r.error ?? "Could not save category.");
            setSubmitting(false);
            return;
        }
        notify.success(mode === "create" ? "Category created" : "Category updated");
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
                    <label className="text-eyebrow mb-2 block">Name</label>
                    <Input {...register("name")} placeholder="Hoodies" />
                    {errors.name && (
                        <p className="mt-1 text-xs text-sale">{errors.name.message}</p>
                    )}
                </div>
                <div>
                    <label className="text-eyebrow mb-2 block">Slug</label>
                    <Input {...register("slug")} placeholder="hoodies" />
                    {errors.slug && (
                        <p className="mt-1 text-xs text-sale">{errors.slug.message}</p>
                    )}
                </div>
            </div>

            <div>
                <label className="text-eyebrow mb-2 block">Description</label>
                <Input {...register("description")} />
            </div>

            <div>
                <label className="text-eyebrow mb-2 block">Image URL</label>
                <Input {...register("image")} placeholder="https://..." />
                {errors.image && (
                    <p className="mt-1 text-xs text-sale">{errors.image.message}</p>
                )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                <div>
                    <label className="text-eyebrow mb-2 block">Sort order</label>
                    <Input
                        type="number"
                        {...register("sortOrder", { valueAsNumber: true })}
                    />
                </div>
                <label className="flex items-center gap-2 self-end pb-3 text-sm">
                    <input type="checkbox" {...register("visible")} className="accent-accent" />
                    Visible on shop
                </label>
            </div>

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