import { readFile } from "node:fs/promises";
import path from "node:path";
import { SITE_META } from "@/content/portfolio";

// Serves the hand-built HTML pages in /site-pages, prerendered at build time.
// {{SITE_URL}} becomes the deployed origin so canonical, Open Graph and JSON-LD URLs are absolute.
const PAGES = ["index", "work", "about"] as const;

export const dynamicParams = false;

export function generateStaticParams() {
  return PAGES.map((page) => ({ page }));
}

export async function GET(_request: Request, { params }: { params: Promise<{ page: string }> }) {
  const { page } = await params;
  const file = path.join(process.cwd(), "site-pages", `${page}.html`);
  const html = (await readFile(file, "utf8")).replaceAll("{{SITE_URL}}", SITE_META.siteUrl);

  return new Response(html, {
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}
