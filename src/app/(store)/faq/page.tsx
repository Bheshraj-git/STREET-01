import { Metadata } from "next";
import { Container } from "@/components/ui/container";

export const metadata: Metadata = {
    title: "FAQ · STREET/01",
    description: "Frequently asked questions about STREET/01 clothing, sizing, orders, and payments.",
};

const FAQS = [
    {
        q: "What does the fit of STREET/01 clothing look like?",
        a: "Our silhouettes feature an intentional boxy, oversized drape with dropped shoulders. If you prefer a relaxed modern street fit, select your true size. If you prefer a fitted silhouette, size down by one.",
    },
    {
        q: "What fabric weights do you use?",
        a: "We only use heavyweight textiles. Our signature hoodies are constructed from 460 GSM custom-knit loopback French terry cotton. Our t-shirts range from 240 GSM to 280 GSM combed jersey.",
    },
    {
        q: "What payment options do you support?",
        a: "We support major debit/credit cards, digital wallets (eSewa / Khalti), and Cash on Delivery (COD) across Nepal.",
    },
    {
        q: "How should I wash my garments?",
        a: "To preserve color intensity and loopback structure, wash inside out in cold water (30°C or below). Line dry in the shade. Do not tumble dry on high heat.",
    },
    {
        q: "How do I apply coupon discounts?",
        a: "At checkout, enter your promo code (e.g. STREET10) in the promo box and click apply. Qualifying discounts are immediately subtracted from your subtotal.",
    },
];

export default function FAQPage() {
    return (
        <div className="py-12 md:py-20">
            <Container>
                <div className="mx-auto max-w-3xl">
                    <div className="mb-10 border-b border-border pb-6">
                        <p className="text-eyebrow mb-2 text-muted-foreground">Knowledge Base</p>
                        <h1 className="text-display text-4xl uppercase tracking-tight md:text-5xl">
                            Frequently Asked Questions
                        </h1>
                    </div>

                    <div className="divide-y divide-border">
                        {FAQS.map((faq, i) => (
                            <div key={i} className="py-6">
                                <h3 className="text-display text-lg uppercase text-foreground">
                                    {faq.q}
                                </h3>
                                <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
                                    {faq.a}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </Container>
        </div>
    );
}
