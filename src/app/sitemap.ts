import type { MetadataRoute } from "next";
import { SITE_META } from "@/content/portfolio";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_META.siteUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
