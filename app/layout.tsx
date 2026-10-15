import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { Orb } from "@/components/Orb";

export const metadata: Metadata = {
  title: { default: "Sai Santhosh Bellam", template: "%s | Sai Santhosh Bellam" },
  description: "Portfolio of Sai Santhosh Bellam. Foundation preview.",
  // Nothing is public before launch: keep every preview out of search engines.
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#03040a", // theme-allow: browser metadata cannot use CSS variables; equals --void
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body>
        <a href="#main" className="sr-only focus:not-sr-only">Skip to content</a>
        <main id="main">{children}</main>
        <Orb />
      </body>
    </html>
  );
}
