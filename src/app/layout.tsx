import type { Metadata } from "next";
import { Montserrat, Nunito_Sans } from "next/font/google";
import "./globals.css";
import { SITE_META } from "@/content/portfolio";
import SmoothScroll from "@/components/SmoothScroll";
import WebVitals from "@/components/WebVitals";

const montserrat = Montserrat({
  weight: ["400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  variable: "--font-heading",
});

const nunitoSans = Nunito_Sans({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_META.siteUrl),
  title: SITE_META.title,
  description: SITE_META.description,
  applicationName: "Geetha Krishna Portfolio",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    title: SITE_META.title,
    description: SITE_META.description,
    siteName: "Geetha Krishna Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_META.title,
    description: SITE_META.description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${montserrat.variable} ${nunitoSans.variable} antialiased`}
    >
      <body className="min-h-screen bg-background font-sans text-foreground selection:bg-accent/30 selection:text-accent">
        <WebVitals />
        <SmoothScroll />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-6 focus:top-6 focus:z-50 focus:rounded-full focus:bg-[var(--color-accent)] focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-[#0B0B0F]"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
