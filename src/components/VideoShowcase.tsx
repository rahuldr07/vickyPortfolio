"use client";

import {
  useEffect,
  useState,
  useSyncExternalStore,
  type CSSProperties,
} from "react";
import Image from "next/image";
import { ArrowUpRight, Image as ImageIcon, Play, Video, X } from "lucide-react";
import {
  CONTACT,
  SHOWCASE_PROJECTS,
  type ShowcaseProject,
} from "@/content/portfolio";
import PinnedDossierChapter from "@/components/PinnedDossierChapter";

type WorkArchiveFrame = "logo" | "menu" | "poster" | "banner" | "reel";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeToReducedMotion(callback: () => void) {
  if (typeof window === "undefined") return () => {};

  const query = window.matchMedia(REDUCED_MOTION_QUERY);
  query.addEventListener("change", callback);

  return () => query.removeEventListener("change", callback);
}

function getReducedMotionSnapshot() {
  return typeof window !== "undefined" && window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

function getReducedMotionServerSnapshot() {
  return false;
}

const WORK_ARCHIVE_SECTIONS: readonly {
  id: string;
  frame: WorkArchiveFrame;
  label: string;
  title: string;
  description: string;
}[] = [
  {
    id: "work-logos",
    frame: "logo",
    label: "Logos",
    title: "Logo Systems",
    description: "Identity marks, primary logo mockups, and scalable brand assets.",
  },
  {
    id: "work-menus",
    frame: "menu",
    label: "Menus",
    title: "Menu Cards",
    description: "Print-ready food layouts with hierarchy, readability, and production polish.",
  },
  {
    id: "work-posters",
    frame: "poster",
    label: "Posters",
    title: "Poster Campaigns",
    description: "Product posters, event layouts, and promotional campaign frames.",
  },
  {
    id: "work-banners",
    frame: "banner",
    label: "Banners",
    title: "Banners & Hoardings",
    description: "Wide-format web banners and outdoor visibility assets.",
  },
  {
    id: "work-reels",
    frame: "reel",
    label: "Video Reels",
    title: "Video Reels",
    description: "Motion edits and cinematic output loaded only when previewed.",
  },
] as const;

const ARCHIVE_FRAME_META: Record<
  WorkArchiveFrame,
  {
    className: string;
    imageBoxClassName: string;
    mediaClassName: string;
    label: string;
    titleClassName: string;
  }
> = {
  logo: {
    className: "aspect-[4/3]",
    imageBoxClassName: "inset-3 rounded-[0.9rem] xl:rounded-t-[999px]",
    mediaClassName: "object-cover opacity-90",
    label: "LOGO",
    titleClassName: "text-lg md:text-xl",
  },
  menu: {
    className: "aspect-[4/3]",
    imageBoxClassName: "inset-3 rotate-[-1deg] rounded-[0.9rem]",
    mediaClassName: "object-cover opacity-92",
    label: "MENU",
    titleClassName: "text-lg md:text-xl",
  },
  poster: {
    className: "aspect-[4/3]",
    imageBoxClassName: "inset-3 rounded-[0.85rem] border-[4px] border-[#17171f]",
    mediaClassName: "object-cover opacity-90",
    label: "POSTER",
    titleClassName: "text-lg md:text-xl",
  },
  banner: {
    className: "aspect-[4/3]",
    imageBoxClassName: "inset-3 rounded-[0.9rem]",
    mediaClassName: "object-contain bg-white opacity-95",
    label: "BANNER",
    titleClassName: "text-lg md:text-xl",
  },
  reel: {
    className: "aspect-[4/3]",
    imageBoxClassName: "inset-3 rounded-[0.9rem]",
    mediaClassName: "object-cover opacity-88",
    label: "REEL",
    titleClassName: "text-lg md:text-xl",
  },
};

function getProjectInquiryHref(projectTitle: string) {
  const subject = encodeURIComponent(`Project inquiry: ${projectTitle}`);
  const body = encodeURIComponent(
    "Hi Geetha,\n\nI saw your portfolio and would love to discuss this project direction."
  );

  return `mailto:${CONTACT.email}?subject=${subject}&body=${body}`;
}

function getTreatmentStyle(project: ShowcaseProject): CSSProperties {
  return {
    "--project-accent": project.accent,
    "--project-tint": project.visualTreatment.tint,
  } as CSSProperties;
}

function getArchiveFrame(project: ShowcaseProject): WorkArchiveFrame {
  if (project.type === "video") return "reel";
  if (project.category === "Brand Identity") return "logo";
  if (project.title.toLowerCase().includes("menu")) return "menu";
  if (project.category === "Digital & UI") return "banner";
  return "poster";
}

function filterArchiveProjects(
  projects: readonly ShowcaseProject[],
  frame: WorkArchiveFrame
) {
  return projects.filter((project) => getArchiveFrame(project) === frame);
}

export default function VideoShowcase() {
  const [selectedProject, setSelectedProject] = useState<ShowcaseProject | null>(null);
  const shouldReduceMotion = useSyncExternalStore(
    subscribeToReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot
  );

  const sectionGroups = WORK_ARCHIVE_SECTIONS.map((section) => ({
    ...section,
    projects: filterArchiveProjects(SHOWCASE_PROJECTS, section.frame),
  }));

  const closeModal = () => setSelectedProject(null);

  useEffect(() => {
    if (!selectedProject) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeModal();
    };

    window.addEventListener("keydown", onEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onEscape);
    };
  }, [selectedProject]);

  const rail = (
    <div className="space-y-6">
      <div>
        <p className="dossier-kicker mb-4">Selected Works</p>
        <h2
          id="work-heading"
          className="font-serif text-4xl font-black leading-[0.94] tracking-normal text-white md:text-5xl lg:text-[clamp(2.6rem,4vw,4.6rem)]"
        >
          Visual Work Archive
        </h2>
        <p className="mt-4 max-w-full text-[15px] leading-relaxed text-white/70 sm:max-w-md">
          Logo systems, menus, posters, banners, and reels.
        </p>
      </div>

      <div
        className="grid grid-cols-2 gap-2 border-b border-white/10 pb-4 sm:grid-cols-3 lg:flex lg:flex-col lg:border-b-0 lg:border-l lg:pb-0 lg:pl-5"
        aria-label="Project sections"
      >
        <a
          href="#work"
          aria-label={`All projects section ${SHOWCASE_PROJECTS.length} projects`}
          className="relative rounded-xl border border-[var(--color-accent)]/55 bg-[var(--color-accent)]/14 px-3 py-2.5 text-left text-white transition-[background,border-color,color] duration-200 lg:border-transparent"
        >
          <span className="flex items-center justify-between gap-3">
            <span className="font-sans text-xs font-extrabold uppercase tracking-widest">
              All
            </span>
            <span className="font-mono text-[10px] text-white/45">
              [{SHOWCASE_PROJECTS.length}]
            </span>
          </span>
        </a>
        {sectionGroups.map((section) => (
          <a
            key={section.id}
            href={`#${section.id}`}
            aria-label={`${section.label} section ${section.projects.length} projects`}
            className="relative rounded-xl border border-white/10 bg-[#0d0d13] px-3 py-2.5 text-left text-white/58 transition-[background,border-color,color] duration-200 hover:border-white/20 hover:bg-[#14141c] hover:text-white lg:border-transparent"
          >
            <span className="flex items-center justify-between gap-3">
              <span className="font-sans text-xs font-extrabold uppercase tracking-widest">
                {section.label}
              </span>
              <span className="font-mono text-[10px] text-white/45">
                [{section.projects.length}]
              </span>
            </span>
          </a>
        ))}
      </div>

      <p className="sr-only" aria-live="polite">
        Showing all projects in continuous sections.
      </p>
    </div>
  );

  return (
    <>
      <PinnedDossierChapter
        id="work"
        labelledBy="work-heading"
        rail={rail}
        railClassName="lg:pt-2"
        contentClassName="hide-scrollbar"
      >
        <div className="space-y-10">
          {sectionGroups.map((section) => (
            <section
              key={section.id}
              id={section.id}
              aria-labelledby={`${section.id}-heading`}
              className="scroll-mt-28"
              data-testid="work-archive-section"
              data-archive-frame={section.frame}
            >
              <header className="mb-4 flex flex-col gap-3 border-t border-white/10 pt-5 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--color-accent)]">
                    {section.label} / {String(section.projects.length).padStart(2, "0")}
                  </p>
                  <h3
                    id={`${section.id}-heading`}
                    className="mt-2 font-serif text-3xl font-black leading-tight text-white md:text-4xl"
                  >
                    {section.title}
                  </h3>
                </div>
                <p className="max-w-xl text-[15px] leading-relaxed text-white/64">
                  {section.description}
                </p>
              </header>

              <div className="grid w-full min-w-0 grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:gap-4">
                {section.projects.map((project) => {
                  const treatmentStyle = getTreatmentStyle(project);
                  const frameMeta = ARCHIVE_FRAME_META[section.frame];

                  return (
                    <button
                      key={project.id}
                      style={treatmentStyle}
                      aria-label={`Open ${project.title}`}
                      data-archive-frame={section.frame}
                      data-testid="work-reel-card"
                      className={`archive-card group relative isolate flex min-w-0 cursor-pointer flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0b0b10] text-left opacity-100 shadow-[0_10px_28px_rgba(0,0,0,0.26)] transition-[border-color,background-color] duration-200 hover:border-[var(--project-accent)]/50 hover:bg-[#101018] ${frameMeta.className}`}
                      onClick={() => setSelectedProject(project)}
                      type="button"
                    >
                      <div
                        className={`absolute overflow-hidden border border-white/10 bg-[#111119] ${frameMeta.imageBoxClassName}`}
                      >
                        <Image
                          src={project.imgSrc ?? "/color.jpeg"}
                          alt={project.mediaAlt}
                          fill
                          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 22vw"
                          className={frameMeta.mediaClassName}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#07070a]/88 via-transparent to-transparent" />
                      </div>

                      {section.frame === "reel" && (
                        <div className="pointer-events-none absolute inset-x-7 top-[52%] z-10 hidden items-center gap-2 md:flex">
                          {Array.from({ length: 9 }).map((_, index) => (
                            <span key={index} className="h-1 flex-1 rounded-full bg-white/14" />
                          ))}
                        </div>
                      )}

                      <div className="absolute left-4 top-4 z-20 flex items-center gap-2">
                        <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-[#0b0b10] text-white/72">
                          {project.type === "video" ? (
                            <Video className="h-4 w-4" aria-hidden="true" />
                          ) : (
                            <ImageIcon className="h-4 w-4" aria-hidden="true" />
                          )}
                        </span>
                        <span className="hidden rounded-full border border-white/10 bg-[#0b0b10] px-3 py-2 font-mono text-[9px] uppercase tracking-[0.18em] text-white/62 sm:inline-flex">
                          {frameMeta.label}
                        </span>
                      </div>

                      {project.type === "video" && !shouldReduceMotion && (
                        <div className="pointer-events-none absolute inset-x-0 top-20 z-10 flex justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                          <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/20 bg-[#0b0b10]/90 text-white">
                            <Play className="ml-1 h-5 w-5" aria-hidden="true" />
                          </div>
                        </div>
                      )}

                      <div className="absolute inset-x-0 bottom-0 z-20 min-w-0 p-4 md:p-5">
                        <h4 className={`max-w-2xl font-serif font-black leading-tight tracking-normal text-white drop-shadow-[0_8px_22px_rgba(0,0,0,0.5)] ${frameMeta.titleClassName}`}>
                          {project.title}
                        </h4>
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </PinnedDossierChapter>

      {selectedProject && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/82 px-4 py-8"
          onClick={closeModal}
          role="dialog"
          aria-modal="true"
          aria-label={`${selectedProject.title} preview`}
        >
          <div
            style={getTreatmentStyle(selectedProject)}
            data-native-scroll="true"
            className="relative max-h-[calc(100svh-2rem)] w-full max-w-6xl overflow-auto rounded-[1.25rem] border border-white/12 bg-[#0b0b10] shadow-[0_36px_100px_rgba(0,0,0,0.62)]"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={closeModal}
              className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/[0.56] text-white transition-colors hover:border-white/40"
              aria-label="Close preview"
            >
              <X className="h-4 w-4" />
            </button>

            <div
              className={
                selectedProject.bentoSize === "large"
                  ? "flex flex-col"
                  : "grid lg:grid-cols-[minmax(0,1.08fr)_minmax(320px,0.92fr)]"
              }
            >
              <div
                className={
                  selectedProject.bentoSize === "large"
                    ? "relative min-h-[45vh] w-full shrink-0 overflow-hidden bg-black/70 lg:min-h-[65vh]"
                    : "relative min-h-[320px] self-start overflow-hidden bg-black/70 lg:sticky lg:top-0 lg:min-h-[620px]"
                }
              >
                {selectedProject.type === "video" && selectedProject.videoSrc ? (
                  <video
                    src={selectedProject.videoSrc}
                    controls
                    autoPlay={!shouldReduceMotion}
                    loop={!shouldReduceMotion}
                    muted
                    playsInline
                    preload="metadata"
                    className="h-full w-full bg-black object-contain opacity-100"
                  >
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <>
                    <Image
                      src={selectedProject.imgSrc ?? "/color.jpeg"}
                      alt="Background blur"
                      fill
                      className="object-cover opacity-[0.12] blur-2xl grayscale"
                      aria-hidden="true"
                    />
                    <Image
                      src={selectedProject.imgSrc ?? "/color.jpeg"}
                      alt={selectedProject.mediaAlt}
                      fill
                      sizes="(max-width: 1024px) 100vw, 720px"
                      className="z-10 object-contain opacity-100"
                    />
                  </>
                )}
                <div className="absolute bottom-5 left-5 rounded-full border border-white/[0.12] bg-black/[0.48] px-4 py-2 font-mono text-[10px] uppercase tracking-[0.22em] text-white/68">
                  {selectedProject.visualTreatment.code} / {selectedProject.visualTreatment.texture}
                </div>
              </div>

              <div
                className={`space-y-7 p-6 md:p-9 ${
                  selectedProject.bentoSize === "large"
                    ? "mx-auto w-full max-w-5xl lg:px-12 lg:py-12"
                    : ""
                }`}
              >
                <div>
                  <p className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--project-accent)]">
                    {selectedProject.category} / Compact Case File
                  </p>
                  <h3 className="mt-4 font-serif text-4xl font-black leading-tight text-white md:text-5xl">
                    {selectedProject.title}
                  </h3>
                  <p className="mt-5 text-sm leading-relaxed text-white/76 md:text-base">
                    {selectedProject.summary}
                  </p>
                </div>

                <div className="grid gap-4">
                  {[
                    ["Brief", selectedProject.brief],
                    ["Role", selectedProject.role],
                    ["Impact", selectedProject.impact],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-xl border border-white/10 bg-white/[0.035] p-4">
                      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/42">
                        {label}
                      </p>
                      <p className="mt-2 text-sm leading-relaxed text-white/78">
                        {value}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-2">
                  {selectedProject.deliverables.map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-white/[0.12] bg-white/[0.06] px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-white/76"
                    >
                      {item}
                    </span>
                  ))}
                </div>

                <a
                  href={getProjectInquiryHref(selectedProject.title)}
                  className="inline-flex min-h-12 items-center rounded-full bg-[var(--color-accent)] px-5 py-2 font-mono text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#07070A] transition-colors hover:bg-white"
                >
                  Discuss this direction
                  <ArrowUpRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
