import type { Metadata, Viewport } from "next";
import { Montserrat, Nunito_Sans } from "next/font/google";
import "lenis/dist/lenis.css";
import "./globals.css";
import { SITE_META } from "@/content/portfolio";
import WebVitals from "@/components/WebVitals";
import SmoothScroll from "@/components/SmoothScroll";
import MobileDesktopNotice from "@/components/MobileDesktopNotice";

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
  title: {
    default: SITE_META.title,
    template: `%s | ${SITE_META.creator}`,
  },
  description: SITE_META.description,
  applicationName: SITE_META.siteName,
  authors: [{ name: SITE_META.creator, url: "/" }],
  creator: SITE_META.creator,
  publisher: SITE_META.creator,
  generator: "Next.js",
  keywords: [...SITE_META.keywords],
  referrer: "origin-when-cross-origin",
  category: "portfolio",
  classification: "Graphic Design Portfolio",
  alternates: {
    canonical: "/",
    languages: {
      "en-US": "/",
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [{ url: "/favicon.ico", sizes: "any" }],
    shortcut: ["/favicon.ico"],
    apple: [{ url: "/profile.png", type: "image/png" }],
  },
  manifest: "/manifest.webmanifest",
  openGraph: {
    type: "website",
    url: "/",
    title: SITE_META.title,
    description: SITE_META.description,
    siteName: SITE_META.siteName,
    locale: "en_US",
    images: [
      {
        url: SITE_META.ogImage,
        width: 1200,
        height: 630,
        alt: `${SITE_META.title} social preview`,
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_META.title,
    description: SITE_META.description,
    images: [
      {
        url: SITE_META.ogImage,
        width: 1200,
        height: 630,
        alt: `${SITE_META.title} social preview`,
      },
    ],
  },
  appleWebApp: {
    capable: true,
    title: SITE_META.siteName,
    statusBarStyle: "black-translucent",
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  other: {
    "profile:first_name": "Geetha",
    "profile:last_name": "Krishna",
    "portfolio:focus": "Branding, cinematic visuals, video editing",
  },
};

export const viewport: Viewport = {
  themeColor: "#0b0b0f",
  colorScheme: "dark",
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
        <MobileDesktopNotice />
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
