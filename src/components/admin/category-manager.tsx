"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Pencil, Eye, EyeOff, Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CategoryForm } from "./category-form";
import { notify } from "@/lib/toast";
import {
    deleteCategory,
    toggleCategoryVisibility,
} from "@/lib/actions/admin/categories";

export interface CategoryRow {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    image: string | null;
    visible: boolean;
    sortOrder: number;
    productCount: number;
}

export function CategoryManager({ categories }: { categories: CategoryRow[] }) {
    const router = useRouter();
    const [adding, setAdding] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    async function onDelete(id: string, name: string) {
        if (!confirm(`Delete "${name}"?`)) return;
        const r = await deleteCategory(id);
        if (!r.ok) notify.error(r.error);
        else {
            notify.success("Category deleted");
            router.refresh();
        }
    }

    async function onToggle(id: string, visible: boolean) {
        const r = await toggleCategoryVisibility(id);
        if (!r.ok) notify.error(r.error);
        else {
            notify.success(visible ? "Hidden" : "Visible");
            router.refresh();
        }
    }

    return (
        <div className="flex flex-col gap-4">
            {categories.map((cat) =>
                editingId === cat.id ? (
                    <CategoryForm
                        key={cat.id}
                        mode="edit"
                        id={cat.id}
                        initialValues={{
                            name: cat.name,
                            slug: cat.slug,
                            description: cat.description ?? "",
                            image: cat.image ?? "",
                            visible: cat.visible,
                            sortOrder: cat.sortOrder,
                        }}
                        onCancel={() => setEditingId(null)}
                    />
                ) : (
                    <div
                        key={cat.id}
                        className="flex flex-col gap-4 border border-border p-5 sm:flex-row sm:items-center sm:justify-between"
                    >
                        <div className="flex items-center gap-4">
                            <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden bg-muted">
                                {cat.image && (
                                    <Image
                                        src={cat.image}
                                        alt={cat.name}
                                        fill
                                        sizes="56px"
                                        className="object-cover"
                                    />
                                )}
                            </div>
                            <div>
                                <p className="text-sm font-medium">{cat.name}</p>
                                <p className="text-xs text-muted-foreground">
                                    {cat.slug} · {cat.productCount} product
                                    {cat.productCount === 1 ? "" : "s"}
                                </p>
                                {!cat.visible && (
                                    <p className="mt-1 text-eyebrow text-muted-foreground">
                                        Hidden
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={() => onToggle(cat.id, cat.visible)}
                                className="text-xs text-muted-foreground hover:text-foreground"
                                aria-label={cat.visible ? "Hide" : "Show"}
                            >
                                {cat.visible ? (
                                    <Eye size={14} strokeWidth={1.5} />
                                ) : (
                                    <EyeOff size={14} strokeWidth={1.5} />
                                )}
                            </button>
                            <button
                                type="button"
                                onClick={() => setEditingId(cat.id)}
                                className="text-xs text-muted-foreground hover:text-foreground"
                            >
                                <Pencil size={12} strokeWidth={1.5} />
                            </button>
                            <button
                                type="button"
                                onClick={() => onDelete(cat.id, cat.name)}
                                className="text-xs text-muted-foreground hover:text-sale"
                            >
                                <Trash2 size={12} strokeWidth={1.5} />
                            </button>
                        </div>
                    </div>
                )
            )}

            {adding ? (
                <CategoryForm
                    mode="create"
                    onCancel={() => setAdding(false)}
                />
            ) : (
                <Button
                    variant="outline"
                    onClick={() => setAdding(true)}
                    className="self-start"
                >
                    <Plus size={14} strokeWidth={2} />
                    New category
                </Button>
            )}
        </div>
    );
}