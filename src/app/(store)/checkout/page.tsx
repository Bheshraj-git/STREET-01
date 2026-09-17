import { Container } from "@/components/ui/container";
import { CheckoutForm } from "@/components/checkout/checkout-form";

export const metadata = {
    title: "Checkout",
};

export default function CheckoutPage() {
    return (
        <Container className="py-12 md:py-20">
            <div className="mb-10">
                <p className="text-eyebrow text-muted-foreground">Secure checkout</p>
                <h1 className="text-display mt-3 text-4xl md:text-6xl">
                    Checkout
                </h1>
            </div>

            <CheckoutForm />
        </Container>
    );
}