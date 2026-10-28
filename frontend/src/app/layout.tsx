import type { Metadata, Viewport } from "next";
import "../styles.css";
import { Providers } from "./providers";
import { Plus_Jakarta_Sans } from "next/font/google";
import { cn } from "@/lib/utils";

const fontSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "RentMatchAI",
  description: "Find verified apartments, flats, and student rentals directly from trusted landlords in Gandhinagar & Ahmedabad with zero brokerage.",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/site.webmanifest",
};

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1.0,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={cn("font-sans", fontSans.variable)}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

