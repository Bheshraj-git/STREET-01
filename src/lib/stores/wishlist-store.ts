"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface WishlistItem {
    productId: string;
    slug: string;
    name: string;
    image: string;
    price: number;
    compareAtPrice: number | null;
    categoryName: string;
}

interface WishlistState {
    items: WishlistItem[];
    toggle: (item: WishlistItem) => void;
    remove: (productId: string) => void;
    has: (productId: string) => boolean;
    clear: () => void;
    count: () => number;
}

export const useWishlistStore = create<WishlistState>()(
    persist(
        (set, get) => ({
            items: [],

            toggle: (item) =>
                set((state) => {
                    const exists = state.items.some((i) => i.productId === item.productId);
                    return {
                        items: exists
                            ? state.items.filter((i) => i.productId !== item.productId)
                            : [item, ...state.items],
                    };
                }),

            remove: (productId) =>
                set((state) => ({
                    items: state.items.filter((i) => i.productId !== productId),
                })),

            has: (productId) =>
                get().items.some((i) => i.productId === productId),

            clear: () => set({ items: [] }),

            count: () => get().items.length,
        }),
        { name: "street01-wishlist", version: 1 }
    )
);