"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
    // Identity
    variantId: string;
    productId: string;
    productSlug: string;
    productName: string;
    image: string;
    color: string;
    size: string;
    // Money — plain numbers, not Prisma Decimals
    unitPrice: number;
    compareAtPrice: number | null;
    // Quantity
    quantity: number;
    // Stock guard — prevents exceeding available
    maxStock: number;
}

interface CartState {
    items: CartItem[];
    // Actions
    add: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
    remove: (variantId: string) => void;
    updateQuantity: (variantId: string, quantity: number) => void;
    clear: () => void;
    // Selectors
    totalItems: () => number;
    subtotal: () => number;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],

            add: (incoming, quantity = 1) => {
                set((state) => {
                    const existing = state.items.find(
                        (i) => i.variantId === incoming.variantId
                    );

                    if (existing) {
                        const nextQty = Math.min(
                            existing.quantity + quantity,
                            existing.maxStock
                        );
                        return {
                            items: state.items.map((i) =>
                                i.variantId === incoming.variantId
                                    ? { ...i, quantity: nextQty }
                                    : i
                            ),
                        };
                    }

                    const newQty = Math.min(quantity, incoming.maxStock);
                    return {
                        items: [...state.items, { ...incoming, quantity: newQty }],
                    };
                });
            },

            remove: (variantId) =>
                set((state) => ({
                    items: state.items.filter((i) => i.variantId !== variantId),
                })),

            updateQuantity: (variantId, quantity) => {
                if (quantity <= 0) {
                    get().remove(variantId);
                    return;
                }
                set((state) => ({
                    items: state.items.map((i) =>
                        i.variantId === variantId
                            ? { ...i, quantity: Math.min(quantity, i.maxStock) }
                            : i
                    ),
                }));
            },

            clear: () => set({ items: [] }),

            totalItems: () =>
                get().items.reduce((sum, i) => sum + i.quantity, 0),

            subtotal: () =>
                get().items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0),
        }),
        {
            name: "street01-cart",
            version: 1,
        }
    )
);