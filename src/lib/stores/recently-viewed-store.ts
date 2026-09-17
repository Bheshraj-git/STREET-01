"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface RecentlyViewedItem {
    productId: string;
    slug: string;
    name: string;
    image: string;
    price: number;
}

interface RecentlyViewedState {
    items: RecentlyViewedItem[];
    track: (item: RecentlyViewedItem) => void;
    clear: () => void;
}

const MAX_ITEMS = 8;

export const useRecentlyViewedStore = create<RecentlyViewedState>()(
    persist(
        (set) => ({
            items: [],

            track: (item) =>
                set((state) => {
                    const filtered = state.items.filter(
                        (i) => i.productId !== item.productId
                    );
                    return {
                        items: [item, ...filtered].slice(0, MAX_ITEMS),
                    };
                }),

            clear: () => set({ items: [] }),
        }),
        { name: "street01-recently-viewed", version: 1 }
    )
);