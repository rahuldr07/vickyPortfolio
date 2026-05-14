import type { MetadataRoute } from "next";
import { SITE_META } from "@/content/portfolio";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${SITE_META.siteUrl}/sitemap.xml`,
  };
}
