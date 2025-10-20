import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navigation from "./components/Navigation";
import ScrollReveal from "./components/ScrollReveal";
import ScrollProgress from "./components/ScrollProgress";
import CustomCursor from "./components/CustomCursor";
import SmoothScroll from "./components/SmoothScroll";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Design & Photography Portfolio",
  description: "A modern portfolio showcasing graphic design, poster art, and photography work",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <CustomCursor />
        <SmoothScroll />
        {/* Decorative global background */}
        <div className="fixed inset-0 -z-10 pointer-events-none [mask-image:radial-gradient(80%_80%_at_50%_40%,_black,_transparent)]">
          <div className="aurora" aria-hidden="true"></div>
          <div
            className="absolute inset-0 opacity-[.04] sm:opacity-[.07] text-foreground/80 bg-[linear-gradient(to_right,currentColor_1px,transparent_1px),linear-gradient(to_bottom,currentColor_1px,transparent_1px)] [background-size:40px_40px]"
            aria-hidden="true"
          ></div>
        </div>
        <ScrollProgress />
        <Navigation />
        <ScrollReveal />
        <div className="pt-16 relative">
          {children}
        </div>
      </body>
    </html>
  );
}
