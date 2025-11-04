import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import Script from "next/script";
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
    default: "Raffaele Vitale — Designer & Developer",
    template: "%s · Raffaele Vitale",
  },
  description:
    "Il portfolio moderno di Raffaele Vitale: design di interfacce, sistemi visivi e sviluppo front-end.",
  keywords: [
    "Raffaele Vitale",
    "design portfolio",
    "designer",
    "developer",
    "brand identity",
    "UI/UX",
    "creative developer",
  ],
  authors: [{ name: "Raffaele Vitale", url: "https://www.linkedin.com/in/vitaleraffaele/" }],
  creator: "Raffaele Vitale",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Raffaele Vitale — Designer & Developer",
    description:
      "Selezione di progetti tra sistemi di design, brand e interfacce, a cura di Raffaele Vitale.",
    url: siteUrl,
    siteName: "Raffaele Vitale Portfolio",
    locale: "it_IT",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Raffaele Vitale — Designer & Developer",
    description:
      "Interfacce pulite, sistemi visivi e sviluppo front-end con Next.js/TypeScript.",
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
    <html lang="it" suppressHydrationWarning>
      <body
        data-cursor="disabled"
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Script id="theme-init" strategy="beforeInteractive">{`
          try {
            const stored = localStorage.getItem('orario-theme-storage');
            let theme = 'system';
            if (stored) { try { theme = JSON.parse(stored).state.theme || 'system'; } catch {}
            }
            const root = document.documentElement;
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            const isDark = theme === 'dark' || (theme === 'system' && prefersDark);
            if (isDark) root.classList.add('dark'); else root.classList.remove('dark');
          } catch {}
        `}</Script>
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
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
