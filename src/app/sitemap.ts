import { statSync } from "node:fs";
import path from "node:path";
import type { MetadataRoute } from "next";
import { SITE_META } from "@/content/portfolio";
import work from "../../site-pages/work.json";

const abs = (p: string) => `${SITE_META.siteUrl}${encodeURI(p)}`;
const modified = (file: string) => statSync(path.join(process.cwd(), "site-pages", file)).mtime;

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${SITE_META.siteUrl}/`,
      lastModified: modified("index.html"),
      changeFrequency: "monthly",
      priority: 1,
      images: [abs("/gk/og.jpg"), abs("/gk/work/geetha-portrait.webp")],
    },
    {
      url: `${SITE_META.siteUrl}/work`,
      lastModified: modified("work.html"),
      changeFrequency: "monthly",
      priority: 0.9,
      images: work.map((item) => abs(item.thumb)),
    },
    ...work.map((item) => ({
      url: `${SITE_META.siteUrl}/work/${item.slug}`,
      lastModified: modified(`work/${item.slug}.html`),
      changeFrequency: "yearly" as const,
      priority: 0.7,
      images: [abs(item.type === "video" ? item.thumb : item.src)],
    })),
    {
      url: `${SITE_META.siteUrl}/about`,
      lastModified: modified("about.html"),
      changeFrequency: "yearly",
      priority: 0.7,
    },
  ];
}
