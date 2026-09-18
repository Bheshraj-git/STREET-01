import { Metadata } from "next";
import { Container } from "@/components/ui/container";

export const metadata: Metadata = {
    title: "Shipping & Delivery · STREET/01",
    description: "Shipping policies, transit timelines, and delivery rates for STREET/01.",
};

export default function ShippingPage() {
    return (
        <div className="py-12 md:py-20">
            <Container>
                <div className="mx-auto max-w-2xl">
                    <div className="mb-10 border-b border-border pb-6">
                        <p className="text-eyebrow mb-2 text-muted-foreground">Logistics & Delivery</p>
                        <h1 className="text-display text-4xl uppercase tracking-tight md:text-5xl">
                            Shipping Information
                        </h1>
                    </div>

                    <div className="space-y-8 text-sm leading-relaxed text-muted-foreground">
                        <section>
                            <h2 className="text-display mb-2 text-lg uppercase text-foreground">Processing Time</h2>
                            <p>
                                All orders are processed, quality-inspected, and dispatched from our Kathmandu distribution facility within 24 to 48 business hours of order placement.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-display mb-2 text-lg uppercase text-foreground">Domestic Shipping (Nepal)</h2>
                            <ul className="list-inside list-disc space-y-1">
                                <li><strong>Kathmandu Valley:</strong> 1–2 business days. Complimentary on orders over Rs. 5,000 (Flat Rs. 150 for orders below).</li>
                                <li><strong>Major Cities (Pokhara, Biratnagar, Chitwan, Butwal):</strong> 2–4 business days. Flat Rs. 200.</li>
                                <li><strong>Other Regions:</strong> 3–6 business days via trusted courier partners.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-display mb-2 text-lg uppercase text-foreground">Order Tracking</h2>
                            <p>
                                Once your shipment leaves our facility, you will receive an SMS and email notification containing your courier tracking ID and estimated delivery window.
                            </p>
                        </section>
                    </div>
                </div>
            </Container>
        </div>
    );
}
