"use client";

import { useEffect } from "react";
import { useRecentlyViewedStore } from "@/lib/stores/recently-viewed-store";

export function RecentlyViewedTracker({
    item,
}: {
    item: {
        productId: string;
        slug: string;
        name: string;
        image: string;
        price: number;
    };
}) {
    const track = useRecentlyViewedStore((s) => s.track);
    useEffect(() => {
        track(item);
    }, [track, item]);
    return null;
}