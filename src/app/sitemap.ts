import type { MetadataRoute } from "next";
import { SHOWCASE_PROJECTS, SITE_META } from "@/content/portfolio";

const workImages = SHOWCASE_PROJECTS.flatMap((project) =>
  project.imgSrc ? [`${SITE_META.siteUrl}${encodeURI(project.imgSrc).replace(/&/g, "%26")}`] : [],
);

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_META.siteUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
      images: [`${SITE_META.siteUrl}/profile.png`, ...workImages],
    },
  ];
}
