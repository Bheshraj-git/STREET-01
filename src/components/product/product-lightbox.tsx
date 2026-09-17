"use client";

import Image from "next/image";
import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export function ProductLightbox({
    images,
    index,
    onClose,
    onIndexChange,
}: {
    images: { id: string; url: string; alt: string | null }[];
    index: number;
    onClose: () => void;
    onIndexChange: (i: number) => void;
}) {
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
            if (e.key === "ArrowRight")
                onIndexChange((index + 1) % images.length);
            if (e.key === "ArrowLeft")
                onIndexChange((index - 1 + images.length) % images.length);
        };
        window.addEventListener("keydown", onKey);
        document.body.style.overflow = "hidden";
        return () => {
            window.removeEventListener("keydown", onKey);
            document.body.style.overflow = "";
        };
    }, [index, images.length, onClose, onIndexChange]);

    const current = images[index];

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[80] bg-black/95"
                role="dialog"
                aria-modal="true"
                aria-label="Image viewer"
            >
                <button
                    aria-label="Close"
                    onClick={onClose}
                    className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center text-white/70 transition-colors hover:text-white"
                >
                    <X size={24} strokeWidth={1.5} />
                </button>

                <div className="flex h-full w-full items-center justify-center p-4">
                    <motion.div
                        key={current.id}
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                        className="relative aspect-[3/4] w-full max-w-3xl"
                    >
                        <Image
                            src={current.url}
                            alt={current.alt ?? ""}
                            fill
                            sizes="90vw"
                            className="object-contain"
                            priority
                        />
                    </motion.div>
                </div>

                {images.length > 1 && (
                    <>
                        <button
                            aria-label="Previous image"
                            onClick={() =>
                                onIndexChange((index - 1 + images.length) % images.length)
                            }
                            className="absolute left-4 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center text-white/70 transition-colors hover:text-white"
                        >
                            <ChevronLeft size={28} strokeWidth={1.5} />
                        </button>
                        <button
                            aria-label="Next image"
                            onClick={() => onIndexChange((index + 1) % images.length)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center text-white/70 transition-colors hover:text-white"
                        >
                            <ChevronRight size={28} strokeWidth={1.5} />
                        </button>

                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-xs text-white/60">
                            {index + 1} / {images.length}
                        </div>
                    </>
                )}
            </motion.div>
        </AnimatePresence>
    );
}