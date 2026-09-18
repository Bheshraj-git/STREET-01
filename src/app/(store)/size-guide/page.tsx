import { Metadata } from "next";
import { Container } from "@/components/ui/container";

export const metadata: Metadata = {
    title: "Size Guide · STREET/01",
    description: "Detailed measurement charts and sizing guidance for STREET/01 apparel.",
};

const TOPS = [
    { size: "S", chest: "44 in / 112 cm", length: "27 in / 68 cm", shoulder: "21 in / 53 cm" },
    { size: "M", chest: "46 in / 117 cm", length: "28 in / 71 cm", shoulder: "22 in / 56 cm" },
    { size: "L", chest: "48 in / 122 cm", length: "29 in / 74 cm", shoulder: "23 in / 58 cm" },
    { size: "XL", chest: "51 in / 130 cm", length: "30 in / 76 cm", shoulder: "24 in / 61 cm" },
];

const BOTTOMS = [
    { size: "S (30)", waist: "30-31 in", inseam: "30 in", thigh: "25 in" },
    { size: "M (32)", waist: "32-33 in", inseam: "31 in", thigh: "26 in" },
    { size: "L (34)", waist: "34-35 in", inseam: "31.5 in", thigh: "27 in" },
    { size: "XL (36)", waist: "36-37 in", inseam: "32 in", thigh: "28 in" },
];

export default function SizeGuidePage() {
    return (
        <div className="py-12 md:py-20">
            <Container>
                <div className="mx-auto max-w-3xl">
                    <div className="mb-10 border-b border-border pb-6">
                        <p className="text-eyebrow mb-2 text-muted-foreground">Dimensions</p>
                        <h1 className="text-display text-4xl uppercase tracking-tight md:text-5xl">
                            Size Guide
                        </h1>
                        <p className="mt-2 text-sm text-muted-foreground">
                            All measurements are garment dimensions laid flat. Our cuts are oversized by design.
                        </p>
                    </div>

                    <div className="space-y-12">
                        <div>
                            <h2 className="text-display mb-4 text-xl uppercase">T-Shirts & Hoodies (Tops)</h2>
                            <div className="overflow-x-auto border border-border">
                                <table className="w-full text-left text-xs md:text-sm">
                                    <thead className="bg-muted text-xs uppercase tracking-wider text-muted-foreground">
                                        <tr>
                                            <th className="px-4 py-3">Size</th>
                                            <th className="px-4 py-3">Chest Circumference</th>
                                            <th className="px-4 py-3">Body Length</th>
                                            <th className="px-4 py-3">Shoulder Width</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border">
                                        {TOPS.map((row) => (
                                            <tr key={row.size} className="hover:bg-muted/40">
                                                <td className="px-4 py-3 font-semibold">{row.size}</td>
                                                <td className="px-4 py-3 text-muted-foreground">{row.chest}</td>
                                                <td className="px-4 py-3 text-muted-foreground">{row.length}</td>
                                                <td className="px-4 py-3 text-muted-foreground">{row.shoulder}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div>
                            <h2 className="text-display mb-4 text-xl uppercase">Pants & Sweatpants (Bottoms)</h2>
                            <div className="overflow-x-auto border border-border">
                                <table className="w-full text-left text-xs md:text-sm">
                                    <thead className="bg-muted text-xs uppercase tracking-wider text-muted-foreground">
                                        <tr>
                                            <th className="px-4 py-3">Size</th>
                                            <th className="px-4 py-3">Waistband Range</th>
                                            <th className="px-4 py-3">Inseam</th>
                                            <th className="px-4 py-3">Thigh</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border">
                                        {BOTTOMS.map((row) => (
                                            <tr key={row.size} className="hover:bg-muted/40">
                                                <td className="px-4 py-3 font-semibold">{row.size}</td>
                                                <td className="px-4 py-3 text-muted-foreground">{row.waist}</td>
                                                <td className="px-4 py-3 text-muted-foreground">{row.inseam}</td>
                                                <td className="px-4 py-3 text-muted-foreground">{row.thigh}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    );
}
