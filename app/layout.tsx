import type { Metadata, Viewport } from "next";
import { Instrument_Serif, DM_Sans, DM_Mono } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const fallbackSiteUrl = "https://raffaelevitale.it";
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

const title = "Raffaele Vitale — Sviluppatore Web · Web, AI e automazione";
const description =
  "Entra nella camera oscura di Raffaele Vitale, sviluppatore web: Orario Vallauri (1.500 utenti al giorno), Crybu Control Center, AI e automazione per le aziende, fotografia.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: title,
    template: "%s · Raffaele Vitale",
  },
  description,
  keywords: [
    "Raffaele Vitale",
    "sviluppatore web",
    "Next.js",
    "React",
    "AI e automazione",
    "sales engineer",
    "Orario Vallauri",
    "Savigliano",
    "Cuneo",
    "fotografo",
  ],
  authors: [{ name: "Raffaele Vitale", url: "https://www.linkedin.com/in/vitaleraffaele/" }],
  creator: "Raffaele Vitale",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title,
    description,
    url: siteUrl,
    siteName: "Raffaele Vitale Portfolio",
    locale: "it_IT",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
  robots: {
    index: true,
    follow: true,
  },
  category: "portfolio",
};

export const viewport: Viewport = {
  themeColor: "#0b0807",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it">
      <body className={`${instrumentSerif.variable} ${dmSans.variable} ${dmMono.variable} antialiased`}>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
