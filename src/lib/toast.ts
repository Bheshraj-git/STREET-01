"use client";

import { toast } from "sonner";

export const notify = {
    cartAdded: (name: string) =>
        toast.success("Added to bag", { description: name }),
    cartRemoved: (name: string) =>
        toast.message("Removed from bag", { description: name }),
    wishlistAdded: (name: string) =>
        toast.success("Saved to wishlist", { description: name }),
    wishlistRemoved: (name: string) =>
        toast.message("Removed from wishlist", { description: name }),
    error: (message: string) => toast.error(message),
    success: (message: string) => toast.success(message),
};