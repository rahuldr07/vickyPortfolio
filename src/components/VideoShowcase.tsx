"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
} from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import {
  ArrowUpRight,
  FileText,
  Image as ImageIcon,
  Play,
  Video,
  X,
} from "lucide-react";
import { SHOWCASE_PROJECTS, type ShowcaseProject } from "@/content/portfolio";
import PinnedDossierChapter from "@/components/PinnedDossierChapter";

type WorkArchiveFrame = "logo" | "menu" | "poster" | "magazine" | "banner" | "reel";

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
  railLabel: string;
  title: string;
  description: string;
}[] = [
  {
    id: "work-logos",
    frame: "logo",
    label: "Logos",
    railLabel: "Brand Identity",
    title: "Brand Identity & Logos",
    description: "Identity marks, primary logo mockups, and scalable brand assets.",
  },
  {
    id: "work-posters",
    frame: "poster",
    label: "Posters",
    railLabel: "Visual Campaigns",
    title: "Visual Campaign Posters",
    description: "Product posters, event layouts, and promotional campaign frames.",
  },
  {
    id: "work-magazines",
    frame: "magazine",
    label: "Magazines",
    railLabel: "Editorial",
    title: "Magazine & Cover Pages",
    description: "Editorial cover pages and publication PDFs opened only on request.",
  },
  {
    id: "work-banners",
    frame: "banner",
    label: "Banners",
    railLabel: "Ads & Banners",
    title: "Ads, Banners & Hoardings",
    description: "Wide-format web banners and outdoor visibility assets.",
  },
  {
    id: "work-reels",
    frame: "reel",
    label: "Video Reels",
    railLabel: "Motion & Reels",
    title: "Motion Edits & Reels",
    description: "Motion edits and cinematic output loaded only when previewed.",
  },
  {
    id: "work-menus",
    frame: "menu",
    label: "Menus",
    railLabel: "Print & Menus",
    title: "Print Menus & Layouts",
    description: "Print-ready food layouts with hierarchy, readability, and production polish.",
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
    hoverScaleClassName: string;
  }
> = {
  logo: {
    className: "aspect-[4/5] sm:aspect-[4/3]",
    imageBoxClassName: "inset-3 rounded-[0.9rem] xl:rounded-t-[999px]",
    mediaClassName: "object-cover opacity-95",
    label: "LOGO",
    titleClassName: "text-sm sm:text-lg md:text-xl",
    hoverScaleClassName: "duration-300 motion-safe:group-hover:scale-[1.22]",
  },
  menu: {
    className: "aspect-[4/5] sm:aspect-[4/3]",
    imageBoxClassName: "inset-3 rotate-[-1deg] rounded-[0.9rem]",
    mediaClassName: "object-cover opacity-92",
    label: "MENU",
    titleClassName: "text-sm sm:text-lg md:text-xl",
    hoverScaleClassName: "duration-700 motion-safe:group-hover:scale-[1.08]",
  },
  poster: {
    className: "aspect-[4/5] sm:aspect-[4/3]",
    imageBoxClassName: "inset-3 rounded-[0.85rem] border-[4px] border-[#17171f]",
    mediaClassName: "object-cover opacity-90",
    label: "POSTER",
    titleClassName: "text-sm sm:text-lg md:text-xl",
    hoverScaleClassName: "duration-700 motion-safe:group-hover:scale-[1.08]",
  },
  magazine: {
    className: "aspect-[4/5] sm:aspect-[4/3]",
    imageBoxClassName: "inset-3 rounded-[0.75rem] border-[5px] border-[#1c1b1f]",
    mediaClassName: "object-cover opacity-94",
    label: "EDITORIAL",
    titleClassName: "text-sm sm:text-lg md:text-xl",
    hoverScaleClassName: "duration-700 motion-safe:group-hover:scale-[1.08]",
  },
  banner: {
    className: "aspect-[4/5] sm:aspect-[4/3]",
    imageBoxClassName: "inset-3 rounded-[0.9rem]",
    mediaClassName: "object-contain bg-white opacity-95",
    label: "BANNER",
    titleClassName: "text-sm sm:text-lg md:text-xl",
    hoverScaleClassName: "duration-700 motion-safe:group-hover:scale-[1.08]",
  },
  reel: {
    className: "aspect-[4/5] sm:aspect-[4/3]",
    imageBoxClassName: "inset-3 rounded-[0.9rem]",
    mediaClassName: "object-cover opacity-88",
    label: "REEL",
    titleClassName: "text-sm sm:text-lg md:text-xl",
    hoverScaleClassName: "duration-700 motion-safe:group-hover:scale-[1.08]",
  },
};

function getTreatmentStyle(project: ShowcaseProject): CSSProperties {
  return {
    "--project-accent": project.accent,
    "--project-tint": project.visualTreatment.tint,
  } as CSSProperties;
}

function getArchiveFrame(project: ShowcaseProject): WorkArchiveFrame {
  if (project.type === "video") return "reel";
  if (project.category === "Brand Identity") return "logo";
  if (project.pdfSrc || project.visualTreatment.frame === "COVER") return "magazine";
  if (project.title.toLowerCase().includes("menu")) return "menu";
  if (project.category === "Digital & UI") return "banner";
  return "poster";
}

function getArchiveThumbnailSrc(project: ShowcaseProject) {
  return `/works/thumbs/project-${project.id}.webp`;
}

function filterArchiveProjects(
  projects: readonly ShowcaseProject[],
  frame: WorkArchiveFrame
) {
  return projects.filter((project) => getArchiveFrame(project) === frame);
}

function isMagazineProject(
  project: ShowcaseProject
): project is ShowcaseProject & { imgSrc: string } {
  return Boolean(project.pdfSrc || project.visualTreatment.frame === "COVER") && Boolean(project.imgSrc);
}

function getPdfPagePreviewSrc(project: ShowcaseProject, pageIndex: number) {
  const pageNumber = String(pageIndex + 1).padStart(3, "0");
  return `${project.pdfPagePreviewBase}/page-${pageNumber}.webp`;
}

export default function VideoShowcase() {
  const archiveRef = useRef<HTMLDivElement>(null);
  const reelPreviewRefs = useRef(new Map<number, HTMLVideoElement>());
  const [selectedProject, setSelectedProject] = useState<ShowcaseProject | null>(null);
  const [activeArchiveSectionId, setActiveArchiveSectionId] = useState("work");
  const [activeReelPreviewIds, setActiveReelPreviewIds] = useState<ReadonlySet<number>>(
    () => new Set()
  );
  const shouldReduceMotion = useSyncExternalStore(
    subscribeToReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot
  );

  const sectionGroups = WORK_ARCHIVE_SECTIONS.map((section) => ({
    ...section,
    projects: filterArchiveProjects(SHOWCASE_PROJECTS, section.frame),
  }));

  const openProject = (project: ShowcaseProject) => {
    setSelectedProject(project);
  };

  const closeModal = () => {
    setSelectedProject(null);
  };
  const goToArchiveSection = useCallback(
    (sectionId: string) => {
      setActiveArchiveSectionId(sectionId);
      const targetId = sectionId === "work" ? "work" : sectionId;
      const target = document.getElementById(targetId);
      if (!target) return;

      const scrollMarginTop = Number.parseFloat(
        window.getComputedStyle(target).scrollMarginTop
      );
      const offset = Number.isNaN(scrollMarginTop) ? 0 : scrollMarginTop;
      const top = target.getBoundingClientRect().top + window.scrollY;

      if (window.__lenis) {
        window.__lenis?.scrollTo(top, { offset: -offset });
        return;
      }

      window.scrollTo({
        top: Math.max(top - offset, 0),
        behavior: "auto",
      });
    },
    []
  );
  const setReelPreviewRef = useCallback(
    (projectId: number, node: HTMLVideoElement | null) => {
      if (node) {
        reelPreviewRefs.current.set(projectId, node);
        return;
      }

      reelPreviewRefs.current.delete(projectId);
    },
    []
  );

  useGSAP(
    () => {
      if (shouldReduceMotion || !archiveRef.current) return;

      const sections = Array.from(
        archiveRef.current.querySelectorAll<HTMLElement>("[data-testid='work-archive-section']")
      );

      sections.forEach((section) => {
        const targets = [
          section.querySelector<HTMLElement>(".work-section-header"),
          ...Array.from(section.querySelectorAll<HTMLElement>(".archive-card")),
        ].filter(Boolean);

        if (targets.length) {
          gsap.set(targets, { opacity: 0, y: 16 });
        }
      });

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;

            const section = entry.target as HTMLElement;
            const targets = [
              section.querySelector<HTMLElement>(".work-section-header"),
              ...Array.from(section.querySelectorAll<HTMLElement>(".archive-card")),
            ].filter(Boolean);

            if (targets.length) {
              gsap.to(targets, {
                opacity: 1,
                y: 0,
                duration: 0.46,
                ease: "power2.out",
                stagger: 0.045,
                overwrite: true,
                onComplete: () => {
                  gsap.set(targets, { clearProps: "opacity,transform" });
                },
              });
            }

            observer.unobserve(section);
          });
        },
        { rootMargin: "0px 0px -12% 0px", threshold: 0.16 }
      );

      sections.forEach((section) => observer.observe(section));

      return () => observer.disconnect();
    },
    { scope: archiveRef, dependencies: [shouldReduceMotion] }
  );

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

  useEffect(() => {
    if (shouldReduceMotion) {
      reelPreviewRefs.current.forEach((video) => video.pause());
      return;
    }

    if (typeof IntersectionObserver === "undefined") return;

    const videos = Array.from(reelPreviewRefs.current.values());
    if (!videos.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        setActiveReelPreviewIds((previousIds) => {
          const nextIds = new Set(previousIds);
          let changed = false;

          entries.forEach((entry) => {
            const video = entry.target as HTMLVideoElement;
            const projectId = Number.parseInt(video.dataset.projectId ?? "", 10);
            if (!Number.isFinite(projectId)) return;

            if (entry.isIntersecting) {
              if (!nextIds.has(projectId)) {
                nextIds.add(projectId);
                changed = true;
              }
              return;
            }

            if (nextIds.delete(projectId)) {
              video.pause();
              changed = true;
            }
          });

          return changed ? nextIds : previousIds;
        });
      },
      { rootMargin: "320px 0px 240px 0px", threshold: 0.12 }
    );

    videos.forEach((video) => observer.observe(video));

    return () => {
      observer.disconnect();
      videos.forEach((video) => video.pause());
    };
  }, [shouldReduceMotion]);

  useEffect(() => {
    reelPreviewRefs.current.forEach((video, projectId) => {
      if (shouldReduceMotion || !activeReelPreviewIds.has(projectId)) {
        video.pause();
        return;
      }

      const playPromise = video.play();
      if (playPromise) {
        void playPromise.catch(() => {});
      }
    });
  }, [activeReelPreviewIds, shouldReduceMotion]);

  useEffect(() => {
    const sections = ["work", ...WORK_ARCHIVE_SECTIONS.map((section) => section.id)]
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => section !== null);

    if (!sections.length || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((left, right) => right.intersectionRatio - left.intersectionRatio);

        if (visible[0]) {
          setActiveArchiveSectionId(visible[0].target.id);
        }
      },
      {
        root: null,
        rootMargin: "-22% 0px -55% 0px",
        threshold: [0.1, 0.25, 0.45, 0.65],
      }
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  const rail = (
    <div className="space-y-4">
      <div>
        <p className="dossier-kicker mb-3">Portfolio Categories</p>
        <h2
          id="work-heading"
          className="font-serif text-4xl font-black leading-[0.94] tracking-normal text-white md:text-5xl lg:text-[clamp(2rem,2.8vw,3rem)]"
        >
          Creative Portfolio
        </h2>
        <p className="mt-3 max-w-full text-sm leading-relaxed text-white/70 sm:max-w-md">
          Brand identity, print layouts, campaigns, ads, and motion reels.
        </p>
      </div>

      <div
        className="grid grid-cols-2 gap-2 border-b border-white/10 pb-4 sm:grid-cols-3 lg:flex lg:flex-col lg:gap-1 lg:border-b-0 lg:border-l lg:pb-0 lg:pl-4"
        aria-label="Project sections"
      >
        <button
          type="button"
          onClick={() => goToArchiveSection("work")}
          aria-current={activeArchiveSectionId === "work" ? "true" : undefined}
          aria-controls="work"
          aria-label={`All projects section ${SHOWCASE_PROJECTS.length} projects`}
          className="relative min-h-14 rounded-xl border border-[var(--color-accent)]/55 bg-[var(--color-accent)]/14 px-3 py-2 text-left text-white transition-[background,border-color,color] duration-200 lg:min-h-0 lg:border-transparent lg:py-1.5"
        >
          <span className="flex items-start justify-between gap-3">
            <span className="min-w-0">
              <span className="block font-sans text-xs font-extrabold uppercase tracking-widest">
                All
              </span>
              <span className="mt-1 block truncate font-mono text-[9px] uppercase tracking-[0.16em] text-white/42">
                All Work
              </span>
            </span>
            <span className="font-mono text-[10px] text-white/45">
              [{SHOWCASE_PROJECTS.length}]
            </span>
          </span>
        </button>
        {sectionGroups.map((section) => {
          const isActive = activeArchiveSectionId === section.id;

          return (
          <button
            key={section.id}
            type="button"
            onClick={() => goToArchiveSection(section.id)}
            aria-current={isActive ? "true" : undefined}
            aria-controls={section.id}
            aria-label={`${section.label} section ${section.projects.length} projects`}
            className={`relative min-h-14 rounded-xl border px-3 py-2 text-left transition-[background,border-color,color] duration-200 lg:min-h-0 lg:border-transparent lg:py-1.5 ${
              isActive
                ? "border-[var(--color-accent)]/45 bg-[var(--color-accent)]/12 text-white"
                : "border-white/10 bg-[#0d0d13] text-white/58 hover:border-white/20 hover:bg-[#14141c] hover:text-white"
            }`}
          >
            <span className="flex items-start justify-between gap-3">
              <span className="min-w-0">
                <span className="block font-sans text-xs font-extrabold uppercase tracking-widest">
                  {section.label}
                </span>
                <span className="mt-1 block truncate font-mono text-[9px] uppercase tracking-[0.16em] text-white/42">
                  {section.railLabel}
                </span>
              </span>
              <span className="font-mono text-[10px] text-white/45">
                [{section.projects.length}]
              </span>
            </span>
          </button>
          );
        })}
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
        viewportChapter
        contentScrollable={false}
      >
          <div ref={archiveRef} className="space-y-10 pr-1">
            {sectionGroups.map((section) => (
              <section
                key={section.id}
                id={section.id}
                aria-labelledby={`${section.id}-heading`}
                className="scroll-mt-28"
                data-testid="work-archive-section"
                data-archive-frame={section.frame}
              >
                <header className="work-section-header mb-4 flex flex-col gap-3 border-t border-white/10 pt-5 sm:flex-row sm:items-end sm:justify-between">
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

                <div className="grid w-full min-w-0 grid-cols-2 gap-2.5 sm:gap-3 md:grid-cols-3 lg:grid-cols-4 xl:gap-4">
                  {section.projects.map((project) => {
                    const treatmentStyle = getTreatmentStyle(project);
                    const frameMeta = ARCHIVE_FRAME_META[section.frame];
                    const isInlineReel =
                      section.frame === "reel" && project.type === "video" && project.videoSrc;
                    const isReelPreviewActive =
                      !shouldReduceMotion && activeReelPreviewIds.has(project.id);

                    return (
                      <button
                        key={project.id}
                        style={treatmentStyle}
                        aria-label={`Open ${project.title}`}
                        data-archive-frame={section.frame}
                        data-testid="work-reel-card"
                        className={`archive-card group relative isolate flex min-w-0 cursor-pointer flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0b0b10] text-left opacity-100 shadow-[0_10px_28px_rgba(0,0,0,0.26)] transition-[border-color,background-color] duration-200 hover:border-[var(--project-accent)]/50 hover:bg-[#101018] ${frameMeta.className}`}
                        onClick={() => openProject(project)}
                        type="button"
                      >
                        <div
                          className={`absolute overflow-hidden border border-white/10 bg-[#111119] ${frameMeta.imageBoxClassName}`}
                        >
                          {isInlineReel ? (
                            <video
                              ref={(node) => setReelPreviewRef(project.id, node)}
                              data-project-id={project.id}
                              src={isReelPreviewActive ? project.videoSrc : undefined}
                              poster={getArchiveThumbnailSrc(project)}
                              muted
                              playsInline
                              loop
                              preload="metadata"
                              aria-label={project.mediaAlt}
                              className={`h-full w-full ${frameMeta.mediaClassName} transition-transform ease-[cubic-bezier(0.22,1,0.36,1)] ${frameMeta.hoverScaleClassName}`}
                            >
                              Your browser does not support the video tag.
                            </video>
                          ) : (
                            <Image
                              src={getArchiveThumbnailSrc(project)}
                              alt={project.mediaAlt}
                              fill
                              sizes="(max-width: 768px) 44vw, (max-width: 1200px) 30vw, 20vw"
                              className={`${frameMeta.mediaClassName} transition-transform ease-[cubic-bezier(0.22,1,0.36,1)] ${frameMeta.hoverScaleClassName}`}
                            />
                          )}
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
                            ) : section.frame === "magazine" ? (
                              <FileText className="h-4 w-4" aria-hidden="true" />
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
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 px-3 py-5 backdrop-blur-md sm:px-5 sm:py-7"
          onClick={closeModal}
          role="dialog"
          aria-modal="true"
          aria-label={`${selectedProject.title} preview`}
        >
          <div
            style={getTreatmentStyle(selectedProject)}
            data-native-scroll="true"
            data-lenis-prevent="true"
            className="relative flex max-h-[calc(100svh-2rem)] w-full max-w-7xl items-center justify-center overflow-hidden rounded-[1.35rem] border border-white/14 bg-[#050507] shadow-[0_40px_120px_rgba(0,0,0,0.74)]"
            onClick={(event) => event.stopPropagation()}
          >
            {!selectedProject.pdfSrc && (
              <button
                type="button"
                onClick={closeModal}
                className="absolute right-3 top-3 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-white/18 bg-black/70 text-white shadow-[0_12px_34px_rgba(0,0,0,0.42)] backdrop-blur transition-colors hover:border-white/40 sm:right-4 sm:top-4"
                aria-label="Close preview"
              >
                <X className="h-4 w-4" />
              </button>
            )}

            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_8%,var(--project-tint),transparent_38%)] opacity-70" />
            {isMagazineProject(selectedProject) ? (
              <div
                data-testid="magazine-preview"
                className={`relative flex w-full flex-col overflow-hidden bg-[#0b0b10] ${
                  selectedProject.pdfSrc ? "h-[min(90svh,920px)]" : "h-[min(82svh,840px)]"
                }`}
              >
                {selectedProject.pdfSrc ? (
                  <div className="relative z-10 flex items-center justify-between gap-3 border-b border-white/10 px-3 py-2 sm:px-4">
                    <div className="min-w-0">
                      <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-[var(--project-accent)]">
                        Magazine PDF
                      </p>
                      <h3 className="mt-0.5 truncate font-serif text-base font-black text-white sm:text-lg">
                        {selectedProject.title}
                      </h3>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <a
                        href={selectedProject.pdfSrc}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex min-h-9 items-center rounded-full border border-white/12 px-3 py-2 font-mono text-[9px] font-extrabold uppercase tracking-[0.12em] text-white/72 transition-colors hover:border-[var(--project-accent)]/50 hover:text-white sm:px-4"
                      >
                        Open PDF
                        <ArrowUpRight className="ml-2 h-3.5 w-3.5" aria-hidden="true" />
                      </a>
                      <button
                        type="button"
                        onClick={closeModal}
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-white/18 bg-black/50 text-white transition-colors hover:border-white/40"
                        aria-label="Close preview"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ) : null}

                <div
                  className={
                    selectedProject.pdfSrc
                      ? "relative z-10 min-h-0 flex-1 overflow-y-auto bg-[#15151c] px-2 py-3 sm:px-3"
                      : "relative h-full overflow-hidden bg-black/72"
                  }
                >
                  {selectedProject.pdfSrc ? (
                    <div className="mx-auto grid w-full max-w-[760px] gap-3">
                      {selectedProject.pdfPagePreviewBase && selectedProject.pdfPageCount ? (
                        Array.from({ length: selectedProject.pdfPageCount }, (_, pageIndex) => (
                          <figure
                            key={pageIndex}
                            className="overflow-hidden rounded-lg bg-white shadow-[0_18px_56px_rgba(0,0,0,0.32)]"
                          >
                            <Image
                              src={getPdfPagePreviewSrc(selectedProject, pageIndex)}
                              alt={`${selectedProject.title} page ${pageIndex + 1}`}
                              width={selectedProject.pdfPagePreviewWidth ?? 900}
                              height={selectedProject.pdfPagePreviewHeight ?? 1160}
                              className="h-auto w-full"
                              priority={pageIndex === 0}
                              unoptimized
                            />
                          </figure>
                        ))
                      ) : (
                        <div className="overflow-hidden rounded-xl bg-white shadow-[0_24px_80px_rgba(0,0,0,0.45)]">
                          <Image
                            src={selectedProject.imgSrc}
                            alt={selectedProject.mediaAlt}
                            width={1200}
                            height={1500}
                            className="h-auto w-full"
                            priority
                          />
                        </div>
                      )}
                    </div>
                  ) : (
                    <>
                      <Image
                        src={selectedProject.imgSrc}
                        alt=""
                        fill
                        sizes="100vw"
                        className="object-cover opacity-[0.16] blur-3xl saturate-150"
                        aria-hidden="true"
                      />
                      <Image
                        src={selectedProject.imgSrc}
                        alt={selectedProject.mediaAlt}
                        fill
                        sizes="(max-width: 768px) 96vw, (max-width: 1280px) 88vw, 1180px"
                        className="z-10 object-contain opacity-100"
                        priority
                      />
                    </>
                  )}
                </div>
              </div>
            ) : (
              <div className="relative h-[min(82svh,840px)] w-full overflow-hidden bg-black/72">
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
                    alt=""
                    fill
                    sizes="100vw"
                    className="object-cover opacity-[0.16] blur-3xl saturate-150"
                    aria-hidden="true"
                  />
                  <Image
                    src={selectedProject.imgSrc ?? "/color.jpeg"}
                    alt={selectedProject.mediaAlt}
                    fill
                    sizes="(max-width: 768px) 96vw, (max-width: 1280px) 88vw, 1180px"
                    className="z-10 object-contain opacity-100"
                    priority
                  />
                </>
              )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
