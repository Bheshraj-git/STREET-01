import { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Mail, MapPin, Clock, Phone } from "lucide-react";

export const metadata: Metadata = {
    title: "Contact Us · STREET/01",
    description: "Get in touch with the STREET/01 support and customer care team.",
};

export default function ContactPage() {
    return (
        <div className="py-12 md:py-20">
            <Container>
                <div className="mx-auto max-w-3xl">
                    <div className="mb-10 border-b border-border pb-6">
                        <p className="text-eyebrow mb-2 text-muted-foreground">Support & Inquiries</p>
                        <h1 className="text-display text-4xl uppercase tracking-tight md:text-5xl">
                            Contact Us
                        </h1>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Have questions regarding an order, size guidance, or collaboration? Reach out below.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                        <div className="space-y-6">
                            <div className="border border-border p-6">
                                <div className="mb-3 flex items-center gap-3">
                                    <Mail size={18} className="text-accent" />
                                    <h3 className="text-display text-base uppercase">Email Support</h3>
                                </div>
                                <p className="text-xs text-muted-foreground">For customer care, returns, or order status:</p>
                                <a href="mailto:support@street01.com" className="mt-1 block text-sm font-medium hover:underline">
                                    support@street01.com
                                </a>
                            </div>

                            <div className="border border-border p-6">
                                <div className="mb-3 flex items-center gap-3">
                                    <MapPin size={18} className="text-accent" />
                                    <h3 className="text-display text-base uppercase">Studio Location</h3>
                                </div>
                                <p className="text-xs text-muted-foreground">Kathmandu Flagship & Design Studio:</p>
                                <p className="mt-1 text-sm font-medium">Jhamsikhel, Lalitpur, Nepal</p>
                            </div>

                            <div className="border border-border p-6">
                                <div className="mb-3 flex items-center gap-3">
                                    <Clock size={18} className="text-accent" />
                                    <h3 className="text-display text-base uppercase">Hours</h3>
                                </div>
                                <p className="text-sm font-medium">Mon — Sat: 10:00 AM — 7:00 PM NPT</p>
                                <p className="text-xs text-muted-foreground">Closed on major public holidays</p>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="border border-border bg-muted/20 p-6 md:p-8">
                            <h3 className="text-display mb-4 text-xl uppercase">Send a message</h3>
                            <form className="space-y-4">
                                <div>
                                    <label className="text-eyebrow mb-1.5 block text-xs">Name</label>
                                    <input
                                        type="text"
                                        placeholder="Your full name"
                                        className="w-full border border-border bg-background px-3 py-2 text-sm focus:border-foreground focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="text-eyebrow mb-1.5 block text-xs">Email</label>
                                    <input
                                        type="email"
                                        placeholder="you@example.com"
                                        className="w-full border border-border bg-background px-3 py-2 text-sm focus:border-foreground focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="text-eyebrow mb-1.5 block text-xs">Message</label>
                                    <textarea
                                        rows={4}
                                        placeholder="How can we help?"
                                        className="w-full border border-border bg-background px-3 py-2 text-sm focus:border-foreground focus:outline-none"
                                    />
                                </div>
                                <button
                                    type="button"
                                    className="w-full bg-foreground py-2.5 text-xs font-semibold uppercase tracking-wider text-background hover:opacity-90"
                                >
                                    Submit Message
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    );
}
