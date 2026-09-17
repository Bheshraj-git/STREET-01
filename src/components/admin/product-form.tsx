"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useFieldArray, useForm } from "react-hook-form";
import { Trash2, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { notify } from "@/lib/toast";
import { cn } from "@/lib/utils";
import {
    createProduct,
    updateProduct,
    type ProductInput,
} from "@/lib/actions/admin/products";

interface Category {
    id: string;
    name: string;
}

export function ProductForm({
    mode,
    productId,
    categories,
    initialValues,
    onSubmitAction,
}: {
    mode: "create" | "edit";
    productId?: string;
    categories: Category[];
    initialValues?: Partial<ProductInput>;
    onSubmitAction?: (values: ProductInput) => Promise<{
        ok: boolean;
        id?: string;
        error?: string;
        field?: string;
    }>;
}) {
    const router = useRouter();
    const [submitting, setSubmitting] = useState(false);
    const action =
        onSubmitAction ??
        (mode === "create"
            ? (values: ProductInput) => createProduct(values)
            : (values: ProductInput) => updateProduct(productId!, values));

    const {
        register,
        handleSubmit,
        control,
        watch,
        setError,
        formState: { errors },
    } = useForm<ProductInput>({
        defaultValues: {
            name: "",
            slug: "",
            description: "",
            materials: "",
            fit: "",
            categoryId: categories[0]?.id ?? "",
            price: 0,
            compareAtPrice: null,
            sku: "",
            featured: false,
            isNewArrival: false,
            published: true,
            imageUrls: [""],
            variants: [
                { color: "Black", colorHex: "#0A0A0A", size: "M", stock: 10, sku: "" },
            ],
            ...initialValues,
        },
    });

    const {
        fields: imageFields,
        append: appendImage,
        remove: removeImage,
    } = useFieldArray({ control, name: "imageUrls" as never });

    const {
        fields: variantFields,
        append: appendVariant,
        remove: removeVariant,
    } = useFieldArray({ control, name: "variants" });

    const imageUrls = watch("imageUrls");
    const variants = watch("variants");

    // Preview: the first non-empty image
    const previewImage = imageUrls?.find((u) => u && u.startsWith("http"));

    async function submit(values: ProductInput) {
        setSubmitting(true);

        // Normalize
        const cleaned: ProductInput = {
            ...values,
            price: Number(values.price),
            compareAtPrice: values.compareAtPrice
                ? Number(values.compareAtPrice)
                : null,
            imageUrls: values.imageUrls.filter((u) => u.trim().length > 0),
            variants: values.variants.map((v) => ({
                ...v,
                stock: Number(v.stock),
            })),
        };

        const r = await action(cleaned);

        if (!r.ok) {
            if (r.field) {
                setError(r.field as keyof ProductInput, { message: r.error });
            }
            notify.error(r.error ?? "Could not save product.");
            setSubmitting(false);
            return;
        }

        notify.success(mode === "create" ? "Product created" : "Product updated");
        router.push("/admin/products");
        router.refresh();
    }

    return (
        <form
            onSubmit={handleSubmit(submit)}
            className="flex flex-col gap-8"
            noValidate
        >
            {/* Identity */}
            <section className="border border-border p-6">
                <h2 className="text-eyebrow mb-5">Identity</h2>

                <div className="grid gap-4 md:grid-cols-2">
                    <div>
                        <label className="text-eyebrow mb-2 block">Product name</label>
                        <Input {...register("name")} />
                        {errors.name && (
                            <p className="mt-1 text-xs text-sale">{errors.name.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="text-eyebrow mb-2 block">Slug</label>
                        <Input {...register("slug")} placeholder="oversized-hoodie" />
                        {errors.slug && (
                            <p className="mt-1 text-xs text-sale">{errors.slug.message}</p>
                        )}
                    </div>
                </div>

                <div className="mt-4">
                    <label className="text-eyebrow mb-2 block">Description</label>
                    <textarea
                        rows={4}
                        {...register("description")}
                        className="w-full border border-border bg-background p-3 text-sm outline-none focus:border-foreground"
                    />
                    {errors.description && (
                        <p className="mt-1 text-xs text-sale">
                            {errors.description.message}
                        </p>
                    )}
                </div>

                <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <div>
                        <label className="text-eyebrow mb-2 block">Materials</label>
                        <Input {...register("materials")} />
                    </div>
                    <div>
                        <label className="text-eyebrow mb-2 block">Fit</label>
                        <Input {...register("fit")} />
                    </div>
                </div>
            </section>

            {/* Pricing & category */}
            <section className="border border-border p-6">
                <h2 className="text-eyebrow mb-5">Pricing & categorization</h2>

                <div className="grid gap-4 md:grid-cols-3">
                    <div>
                        <label className="text-eyebrow mb-2 block">Price (Rs.)</label>
                        <Input
                            type="number"
                            step="1"
                            {...register("price", { valueAsNumber: true })}
                        />
                        {errors.price && (
                            <p className="mt-1 text-xs text-sale">{errors.price.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="text-eyebrow mb-2 block">
                            Compare-at price (optional)
                        </label>
                        <Input
                            type="number"
                            step="1"
                            {...register("compareAtPrice", {
                                setValueAs: (v) => (v === "" ? null : Number(v)),
                            })}
                        />
                    </div>

                    <div>
                        <label className="text-eyebrow mb-2 block">Category</label>
                        <select
                            {...register("categoryId")}
                            className="h-12 w-full border border-border bg-background px-3 text-sm outline-none focus:border-foreground"
                        >
                            {categories.map((c) => (
                                <option key={c.id} value={c.id}>
                                    {c.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <div>
                        <label className="text-eyebrow mb-2 block">Product SKU</label>
                        <Input {...register("sku")} placeholder="SW-HOODIE-001" />
                        {errors.sku && (
                            <p className="mt-1 text-xs text-sale">{errors.sku.message}</p>
                        )}
                    </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-6">
                    <label className="flex items-center gap-2 text-sm">
                        <input type="checkbox" {...register("featured")} className="accent-accent" />
                        Featured
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                        <input type="checkbox" {...register("isNewArrival")} className="accent-accent" />
                        New arrival
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                        <input type="checkbox" {...register("published")} className="accent-accent" />
                        Published
                    </label>
                </div>
            </section>

            {/* Images */}
            <section className="border border-border p-6">
                <h2 className="text-eyebrow mb-5">Images</h2>
                <p className="mb-4 text-xs text-muted-foreground">
                    Paste image URLs. The first is the primary; the second is used as the
                    hover image on cards.
                </p>

                {previewImage && (
                    <div className="mb-5 flex items-start gap-4">
                        <div className="relative h-32 w-24 overflow-hidden border border-border bg-muted">
                            <img
                                src={previewImage}
                                alt=""
                                className="h-full w-full object-cover"
                            />
                        </div>
                        <p className="text-xs text-muted-foreground">Primary preview</p>
                    </div>
                )}

                <div className="flex flex-col gap-3">
                    {imageFields.map((f, i) => (
                        <div key={f.id} className="flex items-center gap-3">
                            <span className="w-6 text-xs text-muted-foreground">
                                {i + 1}.
                            </span>
                            <Input
                                {...register(`imageUrls.${i}` as const)}
                                placeholder="https://images.unsplash.com/..."
                                className="flex-1"
                            />
                            {imageFields.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => removeImage(i)}
                                    className="text-muted-foreground hover:text-sale"
                                >
                                    <Trash2 size={14} strokeWidth={1.5} />
                                </button>
                            )}
                        </div>
                    ))}
                </div>

                {errors.imageUrls && (
                    <p className="mt-2 text-xs text-sale">
                        {String(errors.imageUrls.message ?? "Check image URLs")}
                    </p>
                )}

                <button
                    type="button"
                    onClick={() => appendImage("")}
                    className="text-eyebrow mt-4 inline-flex items-center gap-2 text-muted-foreground hover:text-foreground"
                >
                    <Plus size={12} strokeWidth={2} />
                    Add image
                </button>
            </section>

            {/* Variants */}
            <section className="border border-border p-6">
                <h2 className="text-eyebrow mb-5">Variants</h2>
                <p className="mb-4 text-xs text-muted-foreground">
                    Each color × size combination is a separate variant with its own stock.
                </p>

                <div className="overflow-x-auto">
                    <table className="w-full min-w-[720px] text-sm">
                        <thead>
                            <tr className="border-b border-border text-eyebrow text-muted-foreground">
                                <th className="py-3 text-left">Color</th>
                                <th className="py-3 text-left">Hex</th>
                                <th className="py-3 text-left">Size</th>
                                <th className="py-3 text-left">SKU</th>
                                <th className="py-3 text-left">Stock</th>
                                <th className="py-3 text-left"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {variantFields.map((f, i) => (
                                <tr key={f.id} className="border-b border-border">
                                    <td className="py-2 pr-2">
                                        <Input
                                            {...register(`variants.${i}.color` as const)}
                                            placeholder="Black"
                                            className="h-9"
                                        />
                                    </td>
                                    <td className="py-2 pr-2">
                                        <input
                                            type="color"
                                            {...register(`variants.${i}.colorHex` as const)}
                                            className="h-9 w-14 cursor-pointer border border-border bg-background"
                                        />
                                    </td>
                                    <td className="py-2 pr-2">
                                        <Input
                                            {...register(`variants.${i}.size` as const)}
                                            placeholder="M"
                                            className="h-9 w-20"
                                        />
                                    </td>
                                    <td className="py-2 pr-2">
                                        <Input
                                            {...register(`variants.${i}.sku` as const)}
                                            placeholder="SW-HOODIE-BLK-M"
                                            className="h-9"
                                        />
                                    </td>
                                    <td className="py-2 pr-2">
                                        <Input
                                            type="number"
                                            {...register(`variants.${i}.stock` as const, {
                                                valueAsNumber: true,
                                            })}
                                            className="h-9 w-20"
                                        />
                                    </td>
                                    <td className="py-2">
                                        {variantFields.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeVariant(i)}
                                                className="text-muted-foreground hover:text-sale"
                                            >
                                                <Trash2 size={14} strokeWidth={1.5} />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {errors.variants && (
                    <p className="mt-2 text-xs text-sale">
                        {String(errors.variants.message ?? "Check variants")}
                    </p>
                )}

                <button
                    type="button"
                    onClick={() =>
                        appendVariant({
                            color: "",
                            colorHex: "#000000",
                            size: "",
                            stock: 0,
                            sku: "",
                        })
                    }
                    className="text-eyebrow mt-4 inline-flex items-center gap-2 text-muted-foreground hover:text-foreground"
                >
                    <Plus size={12} strokeWidth={2} />
                    Add variant
                </button>
            </section>

            {/* Submit */}
            <div className="flex flex-wrap items-center gap-3 border-t border-border pt-6">
                <Button type="submit" size="lg" disabled={submitting}>
                    {submitting
                        ? "Saving…"
                        : mode === "create"
                            ? "Create product"
                            : "Save changes"}
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    onClick={() => router.push("/admin/products")}
                >
                    Cancel
                </Button>
            </div>
        </form>
    );
}