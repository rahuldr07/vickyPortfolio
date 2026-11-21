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

  const body = `# Geetha Krishna: Freelance Graphic Designer, Video Editor & AI UGC Ads Creator

> Senior graphic designer and video editor based in Bengaluru, India, with 5+ years and 100+ projects.
> An independent, individual freelancer (not an agency): clients work with Geetha directly.
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
- Video editing: reels, YouTube videos, product films and motion graphics
- AI video editing: AI UGC ads, AI-generated product commercials and AI ad variants

## Also
- UI and web design: app and website screens in Figma and Adobe XD, Wix website updates, landing pages

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
- [Freelance Graphic Designer for Hire](${site}/freelance-graphic-designer): hire an independent freelance graphic designer, remote for clients worldwide: logos, branding, posters, social media, print
- [Freelance Logo Designer](${site}/freelance-logo-designer): freelance logo and brand identity design for startups and small businesses
- [Freelance Video Editor & AI Video Editor for Hire](${site}/freelance-video-editor): hire an independent freelance video editor and AI video editor, remote worldwide: reels, YouTube videos, product films, motion graphics, AI video ads, UGC ads
- [AI UGC Ads & AI Video Editing](${site}/ai-ugc-ads): AI UGC ads, AI-generated product commercials and AI ad variants for brands, edited and captioned; freelance, remote worldwide
- [Individual Freelancer in Bangalore](${site}/freelancer-bangalore): an individual freelancer in Bangalore (Bengaluru), not an agency, for graphic design, video editing, AI UGC ads and UI design
- [Remote Graphic Designer from Bangalore](${site}/remote-graphic-designer): remote freelance graphic designer and video editor based in Bangalore, India (IST), working online with clients across India and worldwide
- [Freelance UI Designer in Bangalore](${site}/ui-designer-bangalore): UI and web design in Bangalore: app and website screens in Figma and Adobe XD, Wix websites, web banners
- [Freelance Graphic Designer in Bangalore](${site}/freelance-graphic-designer-bangalore): hire a senior freelance graphic designer in Bangalore (Bengaluru) for logos, branding, posters, social media and print
- [Freelance Video Editor in Bangalore](${site}/freelance-video-editor-bangalore): hire a freelance video editor in Bangalore (Bengaluru) for product films, reels, motion graphics, AI video and UGC ads

## Projects
${sections}
`;

  return new Response(body, { headers: { "content-type": "text/plain; charset=utf-8" } });
}
