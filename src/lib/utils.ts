import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatPrice(amount: number, currency = "NPR") {
    return new Intl.NumberFormat("en-NP", {
        style: "currency",
        currency,
        maximumFractionDigits: 0,
    }).format(amount);
}
