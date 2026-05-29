import type { MetadataRoute } from "next";
import { SITE_META } from "@/content/portfolio";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_META.title,
    short_name: "Geetha Krishna",
    description: SITE_META.description,
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait-primary",
    background_color: "#0b0b0f",
    theme_color: "#0b0b0f",
    categories: ["design", "portfolio", "productivity"],
    lang: "en",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
      {
        src: "/profile.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
