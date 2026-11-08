import { readFile } from "node:fs/promises";
import path from "node:path";
import { SITE_META } from "@/content/portfolio";
import work from "../../../../site-pages/work.json";
import { notFoundResponse } from "../not-found-response";

// Serves every hand-built HTML page in /site-pages, prerendered at build time:
//   /p/index | /p/work | /p/about     -> site-pages/<page>.html      (served at /, /work, /about)
//   /p/work/<slug>                     -> site-pages/work/<slug>.html (served at /work/<slug>)
// One handler for both keeps `next dev` fast: with two route handlers, switching between a main page
// and a project page reloaded the other handler (~0.7 s per click).
// {{SITE_URL}} becomes the deployed origin so canonical, Open Graph and JSON-LD URLs are absolute.
const PAGES = ["index", "work", "about"];
const SLUGS = work.map((item) => item.slug);
const SLUG_SET = new Set(SLUGS);

// Unknown paths 404 from the check in GET.
export const dynamicParams = true;

// Only needed to prerender at build time; skipping it in `next dev` avoids a per-request cost.
export const generateStaticParams =
  process.env.NODE_ENV === "production"
    ? () => [...PAGES.map((page) => ({ path: [page] })), ...SLUGS.map((slug) => ({ path: ["work", slug] }))]
    : undefined;

function fileFor(parts: string[]) {
  if (parts.length === 1 && PAGES.includes(parts[0])) return path.join(process.cwd(), "site-pages", `${parts[0]}.html`);
  if (parts.length === 2 && parts[0] === "work" && SLUG_SET.has(parts[1]))
    return path.join(process.cwd(), "site-pages", "work", `${parts[1]}.html`);
  return null;
}

// Search-engine ownership codes, set on the host (no HTML edits needed):
//   GOOGLE_SITE_VERIFICATION (Google Search Console), BING_SITE_VERIFICATION (Bing Webmaster Tools),
//   YANDEX_SITE_VERIFICATION (Yandex Webmaster)
const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);
function verificationTags() {
  const tags: [string, string | undefined][] = [
    ["google-site-verification", process.env.GOOGLE_SITE_VERIFICATION],
    ["msvalidate.01", process.env.BING_SITE_VERIFICATION],
    ["yandex-verification", process.env.YANDEX_SITE_VERIFICATION],
  ];
  return tags
    .filter(([, v]) => v && v.trim())
    .map(([name, v]) => `<meta name="${name}" content="${esc(v!.trim())}"/>`)
    .join("");
}

export async function GET(_request: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const { path: parts } = await params;
  const file = fileFor(parts);
  if (!file) return notFoundResponse();
  let html = (await readFile(file, "utf8")).replaceAll("{{SITE_URL}}", SITE_META.siteUrl);
  const verify = verificationTags();
  if (verify) html = html.replace("</head>", `${verify}</head>`);

  return new Response(html, {
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}
