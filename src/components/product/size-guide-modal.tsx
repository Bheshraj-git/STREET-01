"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

const ROWS = [
    { size: "XS", chest: "86–91", length: "66", shoulder: "42" },
    { size: "S", chest: "91–97", length: "68", shoulder: "44" },
    { size: "M", chest: "97–102", length: "70", shoulder: "46" },
    { size: "L", chest: "102–107", length: "72", shoulder: "48" },
    { size: "XL", chest: "107–112", length: "74", shoulder: "50" },
    { size: "XXL", chest: "112–117", length: "76", shoulder: "52" },
];

export function SizeGuideModal({
    open,
    onClose,
}: {
    open: boolean;
    onClose: () => void;
}) {
    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", onKey);
        document.body.style.overflow = "hidden";
        return () => {
            window.removeEventListener("keydown", onKey);
            document.body.style.overflow = "";
        };
    }, [open, onClose]);

    return (
        <AnimatePresence>
            {open && (
                <div className="fixed inset-0 z-[75] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/50"
                    />
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        className="relative w-full max-w-lg bg-background p-8 shadow-xl"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="size-guide-title"
                    >
                        <button
                            aria-label="Close"
                            onClick={onClose}
                            className="absolute right-4 top-4 text-muted-foreground hover:text-foreground"
                        >
                            <X size={18} strokeWidth={1.5} />
                        </button>

                        <p className="text-eyebrow text-muted-foreground">Reference</p>
                        <h2 id="size-guide-title" className="text-display mt-2 text-2xl">
                            Size Guide
                        </h2>
                        <p className="mt-2 text-xs text-muted-foreground">
                            Measurements in centimeters. Take with a soft tape measure.
                        </p>

                        <table className="mt-6 w-full text-sm">
                            <thead>
                                <tr className="border-b border-border text-left text-eyebrow text-muted-foreground">
                                    <th className="pb-3">Size</th>
                                    <th className="pb-3">Chest</th>
                                    <th className="pb-3">Length</th>
                                    <th className="pb-3">Shoulder</th>
                                </tr>
                            </thead>
                            <tbody>
                                {ROWS.map((r) => (
                                    <tr key={r.size} className="border-b border-border/50">
                                        <td className="py-3 font-medium">{r.size}</td>
                                        <td className="py-3 text-muted-foreground">{r.chest}</td>
                                        <td className="py-3 text-muted-foreground">{r.length}</td>
                                        <td className="py-3 text-muted-foreground">{r.shoulder}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}