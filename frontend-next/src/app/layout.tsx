import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "RentMatch AI | Find a place that fits",
  description: "Personalized AI Rental Matching · Sprint 1 & 2 Prototype",
};

export const viewport: Viewport = {
  themeColor: "#f7f9f7",
  width: "device-width",
  initialScale: 1.0,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
