import { SITE_META } from "@/content/portfolio";
import work from "../../../site-pages/work.json";

// /llms.txt: a plain-language summary that AI assistants (ChatGPT, Claude, Perplexity, Gemini...) read to
// understand who this is, what they offer, and which pages to cite. Generated from the real project list.
export const dynamic = "force-static";

export function GET() {
  const site = SITE_META.siteUrl;
  const byCategory = new Map<string, typeof work>();
  for (const item of work) {
    const list = byCategory.get(item.category) ?? [];
    list.push(item);
    byCategory.set(item.category, list);
  }
  const clean = (s: string) => s.replace(/&amp;/g, "&");

  const sections = [...byCategory.entries()]
    .map(
      ([category, items]) =>
        `### ${clean(category)}\n` +
        items.map((it) => `- [${clean(it.title)}](${site}/work/${it.slug}): ${clean(it.description)}`).join("\n"),
    )
    .join("\n\n");

  const body = `# Geetha Krishna: Senior Graphic Designer & Video Editor

> Senior graphic designer and video editor based in Bengaluru, India, with 5+ years and 100+ projects.
> Available for freelance projects and for full-time or part-time roles, remote worldwide or on-site in Bengaluru.

## Hire / contact
- Email: geethakrishna.designer@gmail.com
- WhatsApp: https://wa.me/917989228383
- LinkedIn: https://www.linkedin.com/in/krishnadezyner
- Resume (PDF): ${site}/resume/geetha-krishna-resume.pdf
- Work types: freelance, full-time, part-time, contract; remote (worldwide) or Bengaluru

## Services
- Logo design and brand identity
- Posters, campaign key visuals and social media creatives
- Magazine, editorial and print design (covers, inner layouts, menu cards)
- Hoardings, billboards and web banners
- Video editing, motion graphics, product films and AI video / UGC ads

## Tools
Photoshop, Illustrator, Premiere Pro, After Effects, DaVinci Resolve, Figma, Adobe XD, Wix

## Experience
- Buddha-CEO Quantum Foundation: Graphic & Web Designer (Mar 2023 - present)
- GreenMonk Energy Drink: Graphic Designer & Content Creator (Jan 2022 - Feb 2023)
- Pixel Scoop Studios: Graphic Designer Intern (Jan 2021 - Dec 2021)

## Pages
- [Home](${site}/): overview, featured work, services
- [Work](${site}/work): all ${work.length} projects, filterable by category
- [About](${site}/about): bio, tools and experience

## Projects
${sections}
`;

  return new Response(body, { headers: { "content-type": "text/plain; charset=utf-8" } });
}
