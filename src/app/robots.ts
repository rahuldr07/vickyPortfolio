import type { MetadataRoute } from "next";
import { SITE_META } from "@/content/portfolio";

// Open to every search engine and to the AI assistants' crawlers (so ChatGPT, Claude, Perplexity,
// Gemini/Google AI and Apple Intelligence can find and cite the portfolio). Only the enquiry API is off-limits.
const AI_AND_SEARCH_BOTS = [
  "Googlebot",
  "Googlebot-Image",
  "Google-Extended",
  "Bingbot",
  "DuckDuckBot",
  "Slurp",
  "YandexBot",
  "Baiduspider",
  "Applebot",
  "Applebot-Extended",
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-SearchBot",
  "Claude-User",
  "PerplexityBot",
  "Perplexity-User",
  "Amazonbot",
  "meta-externalagent",
  "LinkedInBot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: "/api/" },
      { userAgent: AI_AND_SEARCH_BOTS, allow: "/", disallow: "/api/" },
    ],
    sitemap: `${SITE_META.siteUrl}/sitemap.xml`,
    host: SITE_META.siteUrl,
  };
}
