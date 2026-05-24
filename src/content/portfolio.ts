export const NAV_LINKS = [
  { href: "#about", label: "Profile" },
  { href: "#work", label: "Work" },
  { href: "#arsenal", label: "Capabilities" },
  { href: "#experience", label: "Journey" },
  { href: "#contact", label: "Contact" },
] as const;

export const HERO_ROLES = [
  "Brand Identity Systems",
  "Cinematic Campaign Edits",
  "Premium UI Storytelling",
  "Launch Visual Direction",
] as const;

export const HERO_PROOF_POINTS = [
  { value: "4+", label: "Years shaping visual systems" },
  { value: "70+", label: "Campaign assets and design outputs" },
  { value: "3", label: "Core disciplines in one workflow" },
] as const;

export type ProjectType = "image" | "video";

export type ProjectCategory =
  | "All Works"
  | "Cinematic"
  | "Brand Identity"
  | "Digital & UI"
  | "Print Design"
  | "Campaign Design";

export interface ProjectVisualTreatment {
  code: string;
  signal: string;
  texture: string;
  tint: string;
  frame: string;
}

export interface ShowcaseProject {
  id: number;
  title: string;
  category: Exclude<ProjectCategory, "All Works">;
  gradient: string;
  accent: string;
  tags: readonly string[];
  summary: string;
  outcome: string;
  type: ProjectType;
  videoSrc?: string;
  imgSrc?: string;
  bentoSize: "large" | "medium";
  brief: string;
  deliverables: readonly string[];
  impact: string;
  role: string;
  mediaAlt: string;
  visualTreatment: ProjectVisualTreatment;
}

export const PROJECT_CATEGORIES: readonly ProjectCategory[] = [
  "All Works",
  "Cinematic",
  "Brand Identity",
  "Digital & UI",
  "Print Design",
  "Campaign Design",
] as const;

export const SHOWCASE_PROJECTS: readonly ShowcaseProject[] = [
  {
    id: 1,
    title: "Coastal Cravings Identity",
    category: "Brand Identity",
    gradient: "from-violet-500/20 via-zinc-950/40 to-transparent",
    accent: "#9F7AEA",
    tags: ["Logo Design", "Brand System"],
    summary: "Premium brand language for a modern dining experience.",
    outcome: "Built a recognizable identity kit from logo design to mockup.",
    type: "image",
    imgSrc: "/works/Logo/Logo mockup.png",
    bentoSize: "large",
    brief: "Create a confident visual system that feels premium and appetizing.",
    deliverables: ["Logo direction", "Brand marks", "Mockups"],
    impact: "Established a clear, recognizable brand presence.",
    role: "Brand identity, logo design",
    mediaAlt: "Coastal Cravings Logo Mockup",
    visualTreatment: {
      code: "SYS-01",
      signal: "Identity Mockup",
      texture: "vellum grid",
      tint: "rgba(159, 122, 234, 0.34)",
      frame: "01",
    },
  },
  {
    id: 2,
    title: "Coastal Cravings Mark (Color)",
    category: "Brand Identity",
    gradient: "from-fuchsia-500/20 via-zinc-950/40 to-transparent",
    accent: "#D946EF",
    tags: ["Logo Design", "Vector Art"],
    summary: "Primary full-color logo mark for Coastal Cravings.",
    outcome: "Clean, scalable vector logo for versatile applications.",
    type: "image",
    imgSrc: "/works/Logo/Coastal Cravings Logo.png",
    bentoSize: "large",
    brief: "Develop a scalable, instantly recognizable restaurant logo.",
    deliverables: ["Vector Logo", "Color Palette"],
    impact: "Provided a strong primary identifier for the brand.",
    role: "Logo Design",
    mediaAlt: "Coastal Cravings Logo Full Color",
    visualTreatment: {
      code: "SYS-02",
      signal: "Primary Mark",
      texture: "clean vector",
      tint: "rgba(217, 70, 239, 0.28)",
      frame: "02",
    },
  },
  {
    id: 3,
    title: "Coastal Cravings Mark (Monotone)",
    category: "Brand Identity",
    gradient: "from-slate-500/20 via-zinc-950/40 to-transparent",
    accent: "#94A3B8",
    tags: ["Logo Design", "Monotone"],
    summary: "High-contrast monotone variant for print and stamping.",
    outcome: "Ensured brand consistency across all low-fidelity mediums.",
    type: "image",
    imgSrc: "/works/Logo/Coastal Cravings Logo black.png",
    bentoSize: "large",
    brief: "Adapt the primary logo for single-color print usage.",
    deliverables: ["Monotone Logo", "Print-ready assets"],
    impact: "Enabled cost-effective print scaling for packaging.",
    role: "Logo Design",
    mediaAlt: "Coastal Cravings Logo Black",
    visualTreatment: {
      code: "SYS-03",
      signal: "Monotone Mark",
      texture: "matte finish",
      tint: "rgba(148, 163, 184, 0.28)",
      frame: "03",
    },
  },
  {
    id: 4,
    title: "Cinematic Final Output",
    category: "Cinematic",
    gradient: "from-indigo-500/20 via-zinc-950/40 to-transparent",
    accent: "#818CF8",
    tags: ["Premiere Pro", "Video Editing"],
    summary: "Edits built around pacing, mood, and narrative recall.",
    outcome: "Sharper visual storyboard and dynamic final reel.",
    type: "video",
    videoSrc: "/works/Videos/Final Output.mp4",
    bentoSize: "medium",
    brief: "Shape footage into a concise, premium rhythm.",
    deliverables: ["Edit structure", "Motion graphics", "Final render"],
    impact: "Translated motion decisions into a strong narrative reel.",
    role: "Video editing, motion direction",
    mediaAlt: "Cinematic Video Reel",
    visualTreatment: {
      code: "CIN-01",
      signal: "Narrative Pacing",
      texture: "film grain",
      tint: "rgba(129, 140, 248, 0.32)",
      frame: "16:9",
    },
  },
  {
    id: 5,
    title: "Restaurant Menu Layout",
    category: "Print Design",
    gradient: "from-amber-500/20 via-zinc-950/40 to-transparent",
    accent: "#F59E0B",
    tags: ["Print Layout", "Typography"],
    summary: "Clear and structured layout for physical menu prints.",
    outcome: "Clarified reading flow and dish hierarchy.",
    type: "image",
    imgSrc: "/works/Menu card/Menu Card Mockup.jpg",
    bentoSize: "large",
    brief: "Design a print-ready menu with reduced friction.",
    deliverables: ["Menu Layout", "Typography", "Print Mockup"],
    impact: "Converted complex menus into a scannable experience.",
    role: "Layout design, print setup",
    mediaAlt: "Menu Card Mockup",
    visualTreatment: {
      code: "PRT-01",
      signal: "Print System",
      texture: "paper grain",
      tint: "rgba(245, 158, 11, 0.28)",
      frame: "A5",
    },
  },
  {
    id: 6,
    title: "A5 Menu Print File",
    category: "Print Design",
    gradient: "from-orange-500/20 via-zinc-950/40 to-transparent",
    accent: "#F97316",
    tags: ["Production", "Print Layout"],
    summary: "Production-ready A5 file for the restaurant menu.",
    outcome: "Delivered precise margins and bleed for commercial printing.",
    type: "image",
    imgSrc: "/works/Menu card/A5 Menu card.jpg",
    bentoSize: "medium",
    brief: "Finalize the menu layout for professional offset printing.",
    deliverables: ["A5 Layout", "CMYK Setup", "Print files"],
    impact: "Ensured zero-error transition from screen to print.",
    role: "Production Artist",
    mediaAlt: "A5 Menu Card Flat",
    visualTreatment: {
      code: "PRT-02",
      signal: "Production File",
      texture: "print marks",
      tint: "rgba(249, 115, 22, 0.28)",
      frame: "A5",
    },
  },
  {
    id: 7,
    title: "Product Campaign Posters",
    category: "Campaign Design",
    gradient: "from-cyan-500/20 via-zinc-950/40 to-transparent",
    accent: "#22D3EE",
    tags: ["Photoshop", "Compositing"],
    summary: "High-impact visual posters designed for product campaigns.",
    outcome: "Strengthened product storytelling with striking visuals.",
    type: "image",
    imgSrc: "/works/Posters_Product posters/Posters/output in mockup.jpg",
    bentoSize: "medium",
    brief: "Create posters that hook immediately and showcase the product.",
    deliverables: ["Visual concept", "Compositing", "Mockups"],
    impact: "Gave campaign assets a premium focal point.",
    role: "Visual direction, compositing",
    mediaAlt: "Product Poster Mockup",
    visualTreatment: {
      code: "CMP-01",
      signal: "Launch Visual",
      texture: "poster paper",
      tint: "rgba(34, 211, 238, 0.24)",
      frame: "A4",
    },
  },
  {
    id: 8,
    title: "Product Poster Flat (A4)",
    category: "Campaign Design",
    gradient: "from-sky-500/20 via-zinc-950/40 to-transparent",
    accent: "#0EA5E9",
    tags: ["Layout", "Typography"],
    summary: "The flat A4 layout design of the product campaign poster.",
    outcome: "Detailed typography and hierarchy rules established.",
    type: "image",
    imgSrc: "/works/Posters_Product posters/Posters/A4_1.jpg",
    bentoSize: "medium",
    brief: "Design the core typographical hierarchy for the product poster.",
    deliverables: ["A4 Layout", "Typography", "Visual balance"],
    impact: "Created a scalable poster layout for multiple products.",
    role: "Layout design",
    mediaAlt: "A4 Product Poster Flat",
    visualTreatment: {
      code: "CMP-02",
      signal: "Flat Layout",
      texture: "clean digital",
      tint: "rgba(14, 165, 233, 0.24)",
      frame: "A4",
    },
  },
  {
    id: 9,
    title: "Kalyan Events Billboard",
    category: "Campaign Design",
    gradient: "from-teal-500/20 via-zinc-950/40 to-transparent",
    accent: "#14B8A6",
    tags: ["OOH", "Large Format"],
    summary: "Large format outdoor billboard design for Kalyan Events.",
    outcome: "High visibility and legible typography at scale.",
    type: "image",
    imgSrc: "/works/Posters_Product posters/KE bill board.jpg",
    bentoSize: "medium",
    brief: "Design an eye-catching billboard that communicates the event instantly.",
    deliverables: ["Billboard layout", "Large format typography"],
    impact: "Drove significant local awareness for the event series.",
    role: "OOH Layout Design",
    mediaAlt: "Kalyan Events Billboard",
    visualTreatment: {
      code: "OOH-01",
      signal: "Large Scale",
      texture: "vinyl print",
      tint: "rgba(20, 184, 166, 0.24)",
      frame: "WIDE",
    },
  },
  {
    id: 10,
    title: "Promotional Collateral 01",
    category: "Campaign Design",
    gradient: "from-emerald-500/20 via-zinc-950/40 to-transparent",
    accent: "#10B981",
    tags: ["Visual Design", "Poster"],
    summary: "Dynamic poster series for focused promotional bursts.",
    outcome: "Raised campaign polish with cleaner, bolder frames.",
    type: "image",
    imgSrc: "/works/Posters_Product posters/poster 1.jpg",
    bentoSize: "medium",
    brief: "Refine visual material for production-ready promotional pieces.",
    deliverables: ["Poster design", "Visual polish"],
    impact: "Improved visual communication for the brand.",
    role: "Visual design, layout",
    mediaAlt: "Promotional Poster 1",
    visualTreatment: {
      code: "VIS-01",
      signal: "Promo Frame 1",
      texture: "matte finish",
      tint: "rgba(16, 185, 129, 0.24)",
      frame: "POSTER",
    },
  },
  {
    id: 11,
    title: "Promotional Collateral 02",
    category: "Campaign Design",
    gradient: "from-emerald-400/20 via-zinc-950/40 to-transparent",
    accent: "#34D399",
    tags: ["Visual Design", "Poster"],
    summary: "Second variant in the dynamic promotional poster series.",
    outcome: "Expanded the visual vocabulary of the campaign.",
    type: "image",
    imgSrc: "/works/Posters_Product posters/poster 2.jpg",
    bentoSize: "medium",
    brief: "Create an alternate visual direction for A/B testing.",
    deliverables: ["Alternate Poster", "Color iteration"],
    impact: "Provided clients with diverse aesthetic options.",
    role: "Visual design",
    mediaAlt: "Promotional Poster 2",
    visualTreatment: {
      code: "VIS-02",
      signal: "Promo Frame 2",
      texture: "matte finish",
      tint: "rgba(52, 211, 153, 0.24)",
      frame: "POSTER",
    },
  },
  {
    id: 12,
    title: "Promotional Collateral 03",
    category: "Campaign Design",
    gradient: "from-green-500/20 via-zinc-950/40 to-transparent",
    accent: "#22C55E",
    tags: ["Visual Design", "Poster"],
    summary: "Third variant showcasing alternate typography and layout.",
    outcome: "Delivered a comprehensive suite of promotional assets.",
    type: "image",
    imgSrc: "/works/Posters_Product posters/poster 3.jpg",
    bentoSize: "medium",
    brief: "Explore a typographic-heavy approach for the campaign.",
    deliverables: ["Typographic Poster", "Layout grid"],
    impact: "Strengthened the campaign's flexibility across channels.",
    role: "Typography, layout",
    mediaAlt: "Promotional Poster 3",
    visualTreatment: {
      code: "VIS-03",
      signal: "Promo Frame 3",
      texture: "matte finish",
      tint: "rgba(34, 197, 94, 0.24)",
      frame: "POSTER",
    },
  },
  {
    id: 13,
    title: "Promotional Collateral 04",
    category: "Campaign Design",
    gradient: "from-lime-500/20 via-zinc-950/40 to-transparent",
    accent: "#84CC16",
    tags: ["Visual Design", "Poster"],
    summary: "Final variant in the promotional poster exploration series.",
    outcome: "Finalized the overarching look and feel of the print campaign.",
    type: "image",
    imgSrc: "/works/Posters_Product posters/Poster 7.jpg",
    bentoSize: "medium",
    brief: "Finalize the visual direction incorporating all stakeholder feedback.",
    deliverables: ["Final Poster", "Print ready file"],
    impact: "Successfully launched the primary campaign asset.",
    role: "Visual design, finishing",
    mediaAlt: "Promotional Poster 7",
    visualTreatment: {
      code: "VIS-04",
      signal: "Promo Frame 4",
      texture: "matte finish",
      tint: "rgba(132, 204, 22, 0.24)",
      frame: "POSTER",
    },
  },
  {
    id: 14,
    title: "Digital Hoarding Design",
    category: "Digital & UI",
    gradient: "from-rose-500/20 via-zinc-950/40 to-transparent",
    accent: "#FB7185",
    tags: ["Web Banner", "OOH"],
    summary: "Scalable banner systems balancing hierarchy with brand messaging.",
    outcome: "Built ready-to-deploy banners for web and outdoor.",
    type: "image",
    imgSrc: "/works/Web banner_ Hoardings/Hoarding design.jpg",
    bentoSize: "large",
    brief: "Bring campaign content into a highly visible hoarding framework.",
    deliverables: ["Hoarding layout", "Asset delivery"],
    impact: "Maximized visibility in out-of-home and digital spaces.",
    role: "Layout design, campaign rollout",
    mediaAlt: "Hoarding Design",
    visualTreatment: {
      code: "WEB-01",
      signal: "Outdoor Visibility",
      texture: "print marks",
      tint: "rgba(251, 113, 133, 0.24)",
      frame: "WIDE",
    },
  },
  {
    id: 15,
    title: "Web Banner Variant A",
    category: "Digital & UI",
    gradient: "from-pink-500/20 via-zinc-950/40 to-transparent",
    accent: "#EC4899",
    tags: ["Digital Ads", "Web Banner"],
    summary: "Optimized web banner for direct response campaigns.",
    outcome: "High click-through rates driven by clear CTA placement.",
    type: "image",
    imgSrc: "/works/Web banner_ Hoardings/web banner_1.jpg",
    bentoSize: "large",
    brief: "Translate the hoarding design into a clickable web format.",
    deliverables: ["Digital Banner", "Responsive layout"],
    impact: "Improved digital ad performance and conversion.",
    role: "Digital Design",
    mediaAlt: "Web Banner 1",
    visualTreatment: {
      code: "WEB-02",
      signal: "Digital Display",
      texture: "pixel grid",
      tint: "rgba(236, 72, 153, 0.24)",
      frame: "BANNER",
    },
  },
  {
    id: 16,
    title: "Web Banner Variant B",
    category: "Digital & UI",
    gradient: "from-rose-400/20 via-zinc-950/40 to-transparent",
    accent: "#F43F5E",
    tags: ["Digital Ads", "Web Banner"],
    summary: "Secondary web banner layout for A/B digital testing.",
    outcome: "Provided marketing teams with diverse testing assets.",
    type: "image",
    imgSrc: "/works/Web banner_ Hoardings/web banner_2.jpg",
    bentoSize: "large",
    brief: "Create an alternate layout for digital banner testing.",
    deliverables: ["Alternate Banner", "Typography adjustments"],
    impact: "Enabled data-driven design decisions for the ad campaign.",
    role: "Digital Design",
    mediaAlt: "Web Banner 2",
    visualTreatment: {
      code: "WEB-03",
      signal: "Digital Alternate",
      texture: "pixel grid",
      tint: "rgba(244, 63, 94, 0.24)",
      frame: "BANNER",
    },
  },
] as const;

export const SKILLS = [
  "Photoshop",
  "Illustrator",
  "Premiere Pro",
  "After Effects",
  "DaVinci Resolve",
  "Figma",
  "Adobe XD",
  "WIX",
  "Articulate 360",
  "Logo Design",
  "Print Design",
  "Color Theory",
] as const;

export const ABOUT_HIGHLIGHTS = [
  "4 years across graphic design, visual content creation, motion edits, and brand storytelling.",
  "Strong Adobe production stack: Photoshop, Illustrator, Premiere Pro, After Effects, and DaVinci Resolve.",
  "Design systems and prototype thinking through Figma, Adobe XD, WIX, and Articulate 360 e-learning workflows.",
] as const;

export const EXPERIENCE_ENTRIES = [
  {
    role: "Graphic Designer Intern",
    company: "Design Internship",
    duration: "2021 Jan - 2021 Dec",
    description:
      "Started as an intern graphic designer, building production confidence in Adobe Photoshop and Illustrator while supporting short video and album video edits.",
    highlight: "Adobe production foundation",
    focus: ["Photoshop", "Illustrator", "Short edits", "Album videos"],
  },
  {
    role: "Graphic Designer & Content Creator",
    company: "GreenMonk Energy Drink",
    duration: "Product & social content",
    description:
      "Created product posters, creatives, thumbnails, and UI screens, then extended the same campaign language into music videos, product concept shorts, and YouTube edits.",
    highlight: "Campaign content system",
    focus: ["Product posters", "Thumbnails", "UI screens", "YouTube edits"],
  },
  {
    role: "Graphic Designer & Visual Content Creator",
    company: "Portfolio Practice",
    duration: "4+ years total practice",
    description:
      "Develops logo systems, menu cards, banners, reels, and learning-oriented digital layouts with a focus on clear hierarchy, color control, and brand communication.",
    highlight: "Brand, print, UI, motion",
    focus: ["Logo systems", "Menu cards", "Banners", "E-learning layouts"],
  },
] as const;

export const TOOLS = [
  "Photoshop",
  "Illustrator",
  "Premiere Pro",
  "After Effects",
  "DaVinci Resolve",
  "Figma",
  "Adobe XD",
  "WIX",
  "Articulate 360",
  "Logo Design",
  "Print Design",
  "Visual Design",
  "Color Theory",
  "E-Learning",
] as const;

export const CONTACT = {
  email: "geethakrishna.designer@gmail.com",
  phone: "+917989228383",
  socials: [
    { label: "LinkedIn", href: undefined },
    { label: "Behance", href: undefined },
    { label: "Instagram", href: undefined },
  ],
} as const;

export const SITE_META = {
  title: "Geetha Krishna | Cinematic Visual Dossier",
  description:
    "Premium visual portfolio for Geetha Krishna, a graphic designer and video editor building brand systems, cinematic edits, and digital storytelling assets.",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com",
} as const;
