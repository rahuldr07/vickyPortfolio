import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Montserrat, Nunito_Sans } from "next/font/google";
import "lenis/dist/lenis.css";
import "./globals.css";
import { CONTACT, SITE_META, TOOLS } from "@/content/portfolio";
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
  category: "design",
  classification: "Freelance Graphic Designer Portfolio, Bengaluru",
  alternates: {
    canonical: "/",
    languages: {
      "en-IN": "/",
      "x-default": "/",
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
    locale: "en_IN",
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
    "portfolio:focus": SITE_META.services.join(", "),
    "geo.region": SITE_META.location.regionCode,
    "geo.placename": `${SITE_META.location.city}, ${SITE_META.location.region}, ${SITE_META.location.country}`,
    "geo.position": `${SITE_META.location.latitude};${SITE_META.location.longitude}`,
    ICBM: `${SITE_META.location.latitude}, ${SITE_META.location.longitude}`,
  },
};

const { location } = SITE_META;
const personId = `${SITE_META.siteUrl}/#person`;
const businessId = `${SITE_META.siteUrl}/#business`;
const postalAddress = {
  "@type": "PostalAddress",
  addressLocality: location.city,
  addressRegion: location.region,
  addressCountry: location.countryCode,
};
const areaServed = [
  { "@type": "City", name: location.city, alternateName: location.altCity },
  { "@type": "State", name: location.region },
  { "@type": "Country", name: location.country },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": personId,
      name: SITE_META.creator,
      url: SITE_META.siteUrl,
      image: `${SITE_META.siteUrl}/profile.png`,
      jobTitle: SITE_META.jobTitle,
      description: SITE_META.description,
      email: `mailto:${CONTACT.email}`,
      telephone: CONTACT.phone,
      address: postalAddress,
      homeLocation: { "@type": "City", name: location.city },
      knowsAbout: [...SITE_META.services, ...TOOLS],
      worksFor: { "@id": businessId },
    },
    {
      "@type": "ProfessionalService",
      "@id": businessId,
      name: `${SITE_META.creator} — Freelance Graphic Designer in ${location.city}`,
      url: SITE_META.siteUrl,
      image: `${SITE_META.siteUrl}/profile.png`,
      description: SITE_META.description,
      email: CONTACT.email,
      telephone: CONTACT.phone,
      priceRange: "₹₹",
      address: postalAddress,
      geo: {
        "@type": "GeoCoordinates",
        latitude: location.latitude,
        longitude: location.longitude,
      },
      areaServed,
      founder: { "@id": personId },
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Graphic design and video services",
        itemListElement: SITE_META.services.map((service) => ({
          "@type": "Offer",
          itemOffered: { "@type": "Service", name: service, areaServed },
        })),
      },
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_META.siteUrl}/#website`,
      url: SITE_META.siteUrl,
      name: SITE_META.siteName,
      description: SITE_META.description,
      inLanguage: "en-IN",
      publisher: { "@id": personId },
    },
    {
      "@type": "ProfilePage",
      "@id": `${SITE_META.siteUrl}/#profile`,
      url: SITE_META.siteUrl,
      name: SITE_META.title,
      inLanguage: "en-IN",
      mainEntity: { "@id": personId },
      isPartOf: { "@id": `${SITE_META.siteUrl}/#website` },
    },
  ],
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
      lang="en-IN"
      className={`${montserrat.variable} ${nunitoSans.variable} antialiased`}
    >
      <body className="min-h-screen bg-background font-sans text-foreground selection:bg-accent/30 selection:text-accent">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />
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
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
