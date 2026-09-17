"use client";

import { useState } from "react";
import { Container } from "@/components/ui/container";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function Newsletter() {
    const [email, setEmail] = useState("");
    const [state, setState] = useState<"idle" | "loading" | "done" | "error">(
        "idle"
    );
    const [message, setMessage] = useState("");

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setState("loading");
        setMessage("");

        // Client-side validation
        const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        if (!valid) {
            setState("error");
            setMessage("Enter a valid email address.");
            return;
        }

        // Real API wiring comes in a later stage; placeholder for now.
        await new Promise((r) => setTimeout(r, 600));
        setState("done");
        setMessage("You're on the list. Watch your inbox.");
        setEmail("");
    }

    return (
        <section className="border-t border-border bg-foreground text-background">
            <Container className="py-16 md:py-24">
                <div className="mx-auto max-w-2xl text-center">
                    <p className="text-eyebrow text-background/60">Newsletter</p>
                    <h2 className="text-display mt-4 text-4xl md:text-6xl">
                        Get the Drop.
                    </h2>
                    <p className="mt-5 text-sm text-background/70 md:text-base">
                        Be the first to know about new releases, limited collections and
                        exclusive offers.
                    </p>

                    <form
                        onSubmit={onSubmit}
                        className="mx-auto mt-8 flex max-w-md flex-col gap-2 sm:flex-row"
                    >
                        <Input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="border-background/30 bg-transparent text-background placeholder:text-background/40 focus:border-background"
                            aria-label="Email address"
                            required
                        />
                        <Button
                            type="submit"
                            variant="accent"
                            size="md"
                            disabled={state === "loading"}
                            className="sm:w-32"
                        >
                            {state === "loading" ? "Joining…" : state === "done" ? "Joined" : "Join"}
                        </Button>
                    </form>

                    {message && (
                        <p
                            className={`mt-4 text-xs ${state === "error" ? "text-accent" : "text-background/70"
                                }`}
                        >
                            {message}
                        </p>
                    )}
                </div>
            </Container>
        </section>
    );
}