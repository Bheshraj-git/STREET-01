import { Metadata } from "next";
import { Container } from "@/components/ui/container";

export const metadata: Metadata = {
    title: "Returns & Exchanges · STREET/01",
    description: "Returns and exchange policy for STREET/01 apparel.",
};

export default function ReturnsPage() {
    return (
        <div className="py-12 md:py-20">
            <Container>
                <div className="mx-auto max-w-2xl">
                    <div className="mb-10 border-b border-border pb-6">
                        <p className="text-eyebrow mb-2 text-muted-foreground">Guarantee</p>
                        <h1 className="text-display text-4xl uppercase tracking-tight md:text-5xl">
                            Returns & Exchanges
                        </h1>
                    </div>

                    <div className="space-y-8 text-sm leading-relaxed text-muted-foreground">
                        <section>
                            <h2 className="text-display mb-2 text-lg uppercase text-foreground">7-Day Exchange Window</h2>
                            <p>
                                We stand firmly behind the fit and quality of every garment. If the size isn't ideal or you are not completely satisfied, we offer hassle-free exchanges within 7 calendar days of delivery.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-display mb-2 text-lg uppercase text-foreground">Condition Requirements</h2>
                            <ul className="list-inside list-disc space-y-1">
                                <li>Items must be unworn, unwashed, and in their original packaging with all security tags attached.</li>
                                <li>Proof of purchase (order number or email confirmation) is required.</li>
                                <li>Final-sale archived items and personal accessories (like socks/masks) cannot be returned due to hygiene protocols.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-display mb-2 text-lg uppercase text-foreground">How to Initiate an Exchange</h2>
                            <p>
                                Contact our team at <a href="mailto:support@street01.com" className="text-foreground underline">support@street01.com</a> with your Order ID and the requested exchange size. We will arrange reverse pickup within Kathmandu Valley or coordinate with your local courier.
                            </p>
                        </section>
                    </div>
                </div>
            </Container>
        </div>
    );
}
