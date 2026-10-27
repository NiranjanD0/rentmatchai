import type { Metadata, Viewport } from "next";
import "../styles.css";
import { Providers } from "./providers";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: "RentMatch AI | Intelligent Rental Matching",
  description: "Find verified apartments, flats, and student rentals directly from trusted landlords in Gandhinagar & Ahmedabad with zero brokerage.",
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
    <html lang="en" suppressHydrationWarning className={cn("font-sans", geist.variable)}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

