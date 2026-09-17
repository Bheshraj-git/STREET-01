import type { Metadata } from "next";
import { Inter, Inter_Tight, JetBrains_Mono } from "next/font/google";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { SessionProvider } from "@/components/providers/session-provider";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const interTight = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-inter-tight",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "STREET/01 — Wear Your Attitude",
    template: "%s · STREET/01",
  },
  description:
    "Independent streetwear label. Built for everyday. Designed for everywhere.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"
  ),
  openGraph: {
    type: "website",
    siteName: "STREET/01",
    title: "STREET/01 — Wear Your Attitude",
    description:
      "Independent streetwear label. Built for everyday. Designed for everywhere.",
  },
  twitter: {
    card: "summary_large_image",
    title: "STREET/01 — Wear Your Attitude",
    description:
      "Independent streetwear label. Built for everyday. Designed for everywhere.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${interTight.variable} ${jetbrainsMono.variable} antialiased`}
      >
        <SessionProvider>
          <ThemeProvider>
            {children}
            <Toaster
              position="bottom-right"
              toastOptions={{
                style: {
                  background: "var(--foreground)",
                  color: "var(--background)",
                  border: "1px solid var(--border)",
                  borderRadius: 0,
                  fontFamily: "var(--font-sans)",
                  fontSize: "0.875rem",
                },
              }}
            />
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}