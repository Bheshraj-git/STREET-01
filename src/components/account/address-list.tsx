"use client";

import { useState } from "react";
import { Pencil, Trash2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AddressForm } from "./address-form";
import {
    createAddress,
    deleteAddress,
    setDefaultAddress,
    updateAddress,
} from "@/lib/actions/addresses";
import { notify } from "@/lib/toast";
import type { AddressInput } from "@/lib/schemas/account";

export interface AddressRow {
    id: string;
    label: string | null;
    fullName: string;
    phone: string | null;
    line1: string;
    line2: string | null;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    isDefault: boolean;
}

export function AddressList({ addresses }: { addresses: AddressRow[] }) {
    const [adding, setAdding] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    return (
        <div className="flex flex-col gap-4">
            {addresses.map((addr) =>
                editingId === addr.id ? (
                    <AddressForm
                        key={addr.id}
                        initial={{
                            label: addr.label ?? "",
                            fullName: addr.fullName,
                            phone: addr.phone ?? "",
                            line1: addr.line1,
                            line2: addr.line2 ?? "",
                            city: addr.city,
                            state: addr.state,
                            postalCode: addr.postalCode,
                            country: addr.country,
                            isDefault: addr.isDefault,
                        }}
                        onSubmitAction={(values) => updateAddress(addr.id, values)}
                        onCancel={() => setEditingId(null)}
                        submitLabel="Update address"
                    />
                ) : (
                    <div
                        key={addr.id}
                        className="flex flex-col gap-4 border border-border p-5 sm:flex-row sm:items-start sm:justify-between"
                    >
                        <div className="min-w-0">
                            <div className="flex items-center gap-2">
                                {addr.label && (
                                    <span className="text-eyebrow">{addr.label}</span>
                                )}
                                {addr.isDefault && (
                                    <span className="text-eyebrow flex items-center gap-1 text-accent">
                                        <Star size={10} strokeWidth={2} className="fill-accent" />
                                        Default
                                    </span>
                                )}
                            </div>
                            <address className="mt-2 not-italic text-sm leading-relaxed text-muted-foreground">
                                {addr.fullName}
                                <br />
                                {addr.line1}
                                {addr.line2 ? (
                                    <>
                                        <br />
                                        {addr.line2}
                                    </>
                                ) : null}
                                <br />
                                {addr.city}, {addr.state} {addr.postalCode}
                                <br />
                                {addr.country}
                                {addr.phone && (
                                    <>
                                        <br />
                                        {addr.phone}
                                    </>
                                )}
                            </address>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {!addr.isDefault && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={async () => {
                                        const r = await setDefaultAddress(addr.id);
                                        if (r.ok) notify.success("Default updated");
                                        else notify.error(r.error);
                                    }}
                                >
                                    Set default
                                </Button>
                            )}
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setEditingId(addr.id)}
                            >
                                <Pencil size={12} strokeWidth={1.5} />
                                Edit
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={async () => {
                                    if (!confirm("Delete this address?")) return;
                                    const r = await deleteAddress(addr.id);
                                    if (r.ok) notify.success("Address removed");
                                    else notify.error(r.error);
                                }}
                            >
                                <Trash2 size={12} strokeWidth={1.5} />
                                Delete
                            </Button>
                        </div>
                    </div>
                )
            )}

            {adding ? (
                <AddressForm
                    onSubmitAction={createAddress}
                    onCancel={() => setAdding(false)}
                />
            ) : (
                <Button
                    variant="outline"
                    onClick={() => setAdding(true)}
                    className="self-start"
                >
                    + Add new address
                </Button>
            )}
        </div>
    );
}