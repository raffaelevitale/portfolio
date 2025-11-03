import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import ConditionalNavigation from "./components/ConditionalNavigation";
import ConditionalPadding from "./components/ConditionalPadding";
import ScrollProgress from "./components/ScrollProgress";
import ClientEnhancements from "./components/ClientEnhancements";

const fallbackSiteUrl = "https://raffaelevitale.com";
const siteUrl = (() => {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (envUrl && /^https?:\/\//.test(envUrl)) {
    return envUrl;
  }
  return fallbackSiteUrl;
})();

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Raffaele Vitale — Design & Photography",
    template: "%s · Raffaele Vitale",
  },
  description:
    "A modern portfolio from Raffaele Vitale showcasing multidisciplinary design, brand systems, and photography projects.",
  keywords: [
    "Raffaele Vitale",
    "design portfolio",
    "graphic design",
    "brand identity",
    "photography",
    "creative developer",
  ],
  authors: [{ name: "Raffaele Vitale", url: "https://www.linkedin.com/in/vitaleraffaele/" }],
  creator: "Raffaele Vitale",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Raffaele Vitale — Design & Photography",
    description:
      "Explore selected graphic design, branding, and photography work by Raffaele Vitale.",
    url: siteUrl,
    siteName: "Raffaele Vitale Portfolio",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Raffaele Vitale — Design & Photography",
    description:
      "Selected projects spanning design systems, posters, UI, and photography by Raffaele Vitale.",
  },
  robots: {
    index: true,
    follow: true,
  },
  category: "portfolio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        data-cursor="disabled"
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Client-only enhancements (dynamic with ssr:false) */}
        <ClientEnhancements />
        {/* Decorative global background */}
        <div className="fixed inset-0 -z-10 pointer-events-none [mask-image:radial-gradient(80%_80%_at_50%_40%,_black,_transparent)]">
          <div className="aurora" aria-hidden="true"></div>
          <div
            className="absolute inset-0 opacity-[.04] sm:opacity-[.07] text-foreground/80 bg-[linear-gradient(to_right,currentColor_1px,transparent_1px),linear-gradient(to_bottom,currentColor_1px,transparent_1px)] [background-size:40px_40px]"
            aria-hidden="true"
          ></div>
        </div>
        <ScrollProgress />
        <ConditionalNavigation />
        <ConditionalPadding>
          {children}
        </ConditionalPadding>
        <SpeedInsights />
      </body>
    </html>
  );
}
