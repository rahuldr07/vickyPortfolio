export const NAV_LINKS = [
  { href: "#about", label: "About" },
  { href: "#work", label: "Work" },
  { href: "#arsenal", label: "Arsenal" },
  { href: "#experience", label: "Journey" },
  { href: "#contact", label: "Contact" },
] as const;

export const HERO_ROLES = [
  "Graphic Designer",
  "Video Editor",
  "Visual Storyteller",
  "Brand Architect",
] as const;

export const HERO_PROOF_POINTS = [
  { value: "4+", label: "Years of creative practice" },
  { value: "70+", label: "Brand and campaign assets delivered" },
  { value: "3", label: "Core specializations in one workflow" },
] as const;

export type ProjectType = "image" | "video";

export type ProjectCategory =
  | "All Works"
  | "Cinematic"
  | "Brand Identity"
  | "Digital & UI";

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
}

export const PROJECT_CATEGORIES: readonly ProjectCategory[] = [
  "All Works",
  "Cinematic",
  "Brand Identity",
  "Digital & UI",
] as const;

export const SHOWCASE_PROJECTS: readonly ShowcaseProject[] = [
  {
    id: 1,
    title: "Brand Identity Genesis",
    category: "Brand Identity",
    gradient: "from-violet-500/20 via-purple-500/5 to-transparent",
    accent: "#8B5CF6",
    tags: ["Logo Design", "Print"],
    summary: "Identity system for a premium coaching and wellness brand.",
    outcome: "Delivered a cohesive visual language across print and digital touchpoints.",
    type: "image",
    imgSrc: "/color.jpeg",
    bentoSize: "large",
  },
  {
    id: 2,
    title: "Cinematic Showreel",
    category: "Cinematic",
    gradient: "from-indigo-500/20 via-blue-500/5 to-transparent",
    accent: "#6366F1",
    tags: ["Premiere Pro", "Color Grade"],
    summary: "Poster frame selections from cinematic edits and narrative pacing studies.",
    outcome: "Presented a polished visual storyboard for client discussions and approvals.",
    type: "image",
    imgSrc: "/blackwhite.jpeg",
    bentoSize: "medium",
  },
  {
    id: 3,
    title: "E-Learning UI",
    category: "Digital & UI",
    gradient: "from-fuchsia-500/20 via-pink-500/5 to-transparent",
    accent: "#D946EF",
    tags: ["Figma", "Prototyping"],
    summary: "Interface snapshots from a modular e-learning design system.",
    outcome: "Created a cleaner lesson flow and clearer navigation patterns.",
    type: "image",
    imgSrc: "/profile.png",
    bentoSize: "medium",
  },
  {
    id: 4,
    title: "Product Motion",
    category: "Digital & UI",
    gradient: "from-cyan-500/20 via-teal-500/5 to-transparent",
    accent: "#06B6D4",
    tags: ["After Effects", "Social"],
    summary: "Launch-ready social motion assets designed for conversion campaigns.",
    outcome: "Strengthened product storytelling with short-form motion narratives.",
    type: "video",
    videoSrc:
      "https://assets.mixkit.co/videos/preview/mixkit-stars-in-space-1610-large.mp4",
    bentoSize: "large",
  },
  {
    id: 5,
    title: "Editorial Design",
    category: "Brand Identity",
    gradient: "from-rose-500/20 via-orange-500/5 to-transparent",
    accent: "#F43F5E",
    tags: ["InDesign", "Typography"],
    summary: "Spread concepts and page layouts balancing typography with image rhythm.",
    outcome: "Built publication-ready templates for repeatable monthly issues.",
    type: "image",
    imgSrc: "/color.jpeg",
    bentoSize: "medium",
  },
  {
    id: 6,
    title: "VFX Compositing",
    category: "Cinematic",
    gradient: "from-emerald-500/20 via-green-500/5 to-transparent",
    accent: "#10B981",
    tags: ["Nuke", "VFX"],
    summary: "Shot breakdown stills from compositing and post-production experiments.",
    outcome: "Elevated visual polish and production value for campaign concepts.",
    type: "image",
    imgSrc: "/blackwhite.jpeg",
    bentoSize: "medium",
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
] as const;

export const ABOUT_HIGHLIGHTS = [
  "Cross-disciplinary creative with branding + motion + digital product fluency.",
  "Combines instructional design structure with cinematic visual storytelling.",
  "Comfortable owning projects from concept, direction, and final delivery.",
] as const;

export const EXPERIENCE_ENTRIES = [
  {
    role: "Graphic Designer (Intern)",
    company: "Pixel scoop studios",
    duration: "2021 Jan – 2021 Dec",
    description:
      "Started as a Graphic Design intern focusing on Adobe Photoshop and Illustrator. Also took care of editing short videos and album videos.",
    highlight: "Built core design and post-production foundations across multiple formats.",
  },
  {
    role: "Graphic Designer & Content Creator",
    company: "GreenMonk Energy Drink",
    duration: "2022 Jan – 2023 Feb",
    description:
      "Worked on product posters, creative thumbnails, and UI screens. Video editing for music videos, product concept shorts, and YouTube content.",
    highlight: "Owned social-first creative production from concept to final publish.",
  },
  {
    role: "Graphic & Web Designer",
    company: "Buddha-CEO Quantum Foundation",
    duration: "2023 March – Present",
    description:
      "Designing flyers, brochures, standees, magazines, and books. Also taking care of daily website updates and web design handling.",
    highlight: "Leading end-to-end visual communication across print, digital, and web.",
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
  title: "Geetha Krishna | Visual Explorer",
  description:
    "Portfolio of Geetha Krishna, a Graphic Designer & Video Editor focused on brand systems, cinematic edits, and digital storytelling.",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com",
} as const;
