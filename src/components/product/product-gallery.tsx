"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { ProductLightbox } from "@/components/product/product-lightbox";

export function ProductGallery({
    images,
}: {
    images: { id: string; url: string; alt: string | null }[];
}) {
    const [index, setIndex] = useState(0);
    const [lightboxOpen, setLightboxOpen] = useState(false);

    if (images.length === 0) {
        return <div className="aspect-[3/4] w-full bg-muted" />;
    }

    const current = images[index];

    return (
        <>
            <div className="flex flex-col gap-3">
                <button
                    type="button"
                    onClick={() => setLightboxOpen(true)}
                    className="group relative aspect-[3/4] w-full cursor-zoom-in overflow-hidden bg-muted"
                    aria-label="Open image viewer"
                >
                    <Image
                        src={current.url}
                        alt={current.alt ?? ""}
                        fill
                        sizes="(max-width: 768px) 100vw, 55vw"
                        className="object-cover"
                        priority={index === 0}
                    />
                </button>

                {images.length > 1 && (
                    <div className="grid grid-cols-4 gap-3">
                        {images.map((img, i) => (
                            <button
                                key={img.id}
                                type="button"
                                onClick={() => setIndex(i)}
                                aria-label={`View image ${i + 1}`}
                                aria-current={i === index}
                                className={cn(
                                    "relative aspect-[3/4] overflow-hidden bg-muted transition-opacity",
                                    i === index
                                        ? "ring-1 ring-foreground"
                                        : "opacity-60 hover:opacity-100"
                                )}
                            >
                                <Image
                                    src={img.url}
                                    alt=""
                                    fill
                                    sizes="15vw"
                                    className="object-cover"
                                />
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {lightboxOpen && (
                <ProductLightbox
                    images={images}
                    index={index}
                    onClose={() => setLightboxOpen(false)}
                    onIndexChange={setIndex}
                />
            )}
        </>
    );
}