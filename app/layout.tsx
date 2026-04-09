import type { Metadata } from "next";
import { Instrument_Serif, DM_Sans, DM_Mono } from "next/font/google";
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

const instrumentSerif = Instrument_Serif({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  preload: true,
});

const dmSans = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const dmMono = DM_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Raffaele Vitale — Creative Director & Brand Strategist",
    template: "%s · Raffaele Vitale",
  },
  description:
    "Il portfolio di Raffaele Vitale: direzione creativa, brand identity, digital strategy e sistemi visivi.",
  keywords: [
    "Raffaele Vitale",
    "creative director",
    "brand strategist",
    "brand identity",
    "UI/UX",
    "digital strategy",
    "design portfolio",
  ],
  authors: [{ name: "Raffaele Vitale", url: "https://www.linkedin.com/in/vitaleraffaele/" }],
  creator: "Raffaele Vitale",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Raffaele Vitale — Creative Director & Brand Strategist",
    description:
      "Direzione creativa, brand identity e digital strategy, a cura di Raffaele Vitale.",
    url: siteUrl,
    siteName: "Raffaele Vitale Portfolio",
    locale: "it_IT",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Raffaele Vitale — Creative Director & Brand Strategist",
    description:
      "Direzione creativa, sistemi visivi e brand strategy per prodotti digitali.",
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
        className={`${instrumentSerif.variable} ${dmSans.variable} ${dmMono.variable} antialiased`}
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
        {/* Subtle ambient background */}
        <div className="fixed inset-0 -z-10 pointer-events-none">
          <div className="aurora" aria-hidden="true"></div>
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
