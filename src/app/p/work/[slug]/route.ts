import { readFile } from "node:fs/promises";
import path from "node:path";
import { SITE_META } from "@/content/portfolio";
import work from "../../../../../site-pages/work.json";

// One prerendered page per project (site-pages/work/<slug>.html), served at /work/<slug>.
export const dynamicParams = false;

export function generateStaticParams() {
  return work.map((item) => ({ slug: item.slug }));
}

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const file = path.join(process.cwd(), "site-pages", "work", `${slug}.html`);
  const html = (await readFile(file, "utf8")).replaceAll("{{SITE_URL}}", SITE_META.siteUrl);

  return new Response(html, {
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}
