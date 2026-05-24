"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Image as ImageIcon, Play, Video, X } from "lucide-react";
import {
  CONTACT,
  PROJECT_CATEGORIES,
  SHOWCASE_PROJECTS,
  type ProjectCategory,
  type ShowcaseProject,
} from "@/content/portfolio";
import {
  filterProjectsByCategory,
  getProjectCountByCategory,
} from "@/lib/projects";
import PinnedDossierChapter from "@/components/PinnedDossierChapter";
import SmartVideoPreview from "@/components/SmartVideoPreview";

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

export default function VideoShowcase() {
  const [activeCategory, setActiveCategory] =
    useState<ProjectCategory>("All Works");
  const [selectedProject, setSelectedProject] = useState<ShowcaseProject | null>(
    null
  );
  const shouldReduceMotion = useReducedMotion();

  const filteredProjects = useMemo(
    () => filterProjectsByCategory(SHOWCASE_PROJECTS, activeCategory),
    [activeCategory]
  );

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
    <div className="space-y-10">
      <div>
        <p className="dossier-kicker mb-4">Selected Works</p>
        <h2
          id="work-heading"
          className="font-serif text-4xl font-black tracking-normal text-white md:text-5xl"
        >
          Featured Projects
        </h2>
        <p className="mt-5 max-w-full text-sm leading-relaxed text-white/70 sm:max-w-md">
          A curated set of visual systems, motion studies, and digital interfaces.
        </p>
      </div>

      <div
        className="flex flex-wrap gap-2 border-b border-white/10 pb-4 lg:flex-col lg:flex-nowrap lg:border-b-0 lg:border-l lg:pb-0 lg:pl-6"
        role="group"
        aria-label="Project categories"
      >
        {PROJECT_CATEGORIES.map((category) => {
          const isActive = activeCategory === category;
          const count = getProjectCountByCategory(SHOWCASE_PROJECTS, category);

          return (
            <button
              key={category}
              type="button"
              aria-pressed={isActive}
              onClick={() => setActiveCategory(category)}
              className={`group relative inline-flex min-h-11 items-center justify-between whitespace-nowrap rounded-xl px-4 py-3 text-left transition-all duration-300 lg:px-0 ${
                isActive
                  ? "text-white"
                  : "text-white/55 hover:text-white/[0.86]"
              }`}
            >
              <span className="relative z-10 font-sans text-sm font-extrabold uppercase tracking-widest">
                {category}
              </span>
              <span className="ml-6 hidden font-mono text-[10px] text-white/45 lg:block">
                [{count}]
              </span>

              {isActive && (
                <motion.div
                  layoutId="activeCategoryMarker"
                  className="absolute -left-[25px] bottom-0 top-0 hidden w-[2px] bg-[var(--color-accent)] lg:block"
                />
              )}
              {isActive && (
                <motion.div
                  layoutId="activeCategoryBg"
                  className="absolute inset-0 rounded-xl bg-white/[0.06] lg:hidden"
                />
              )}
            </button>
          );
        })}
      </div>

      <div className="hud-glass hidden rounded-2xl p-4 lg:block">
        <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.22em] text-white/48">
          <span>Scroll Reel</span>
          <span>{String(filteredProjects.length).padStart(2, "0")}</span>
        </div>
        <div className="mt-4 h-px overflow-hidden rounded-full bg-white/10">
          <motion.div
            layout
            className="h-full rounded-full bg-[var(--color-accent)]"
            style={{
              width: `${Math.max(
                18,
                (filteredProjects.length / SHOWCASE_PROJECTS.length) * 100
              )}%`,
            }}
          />
        </div>
        <p className="mt-4 text-xs leading-relaxed text-white/55">
          Organized by medium, client context, and visual treatment.
        </p>
      </div>

      <p className="sr-only" aria-live="polite">
        Showing {filteredProjects.length} projects for {activeCategory}.
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
          <motion.div layout className="grid w-full min-w-0 auto-rows-[minmax(380px,52svh)] grid-cols-1 gap-5 xl:grid-cols-2">
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project) => {
                const treatmentStyle = getTreatmentStyle(project);

                return (
                  <motion.article
                    layout
                    initial={
                      shouldReduceMotion
                        ? { opacity: 0 }
                        : { opacity: 0, scale: 0.98, filter: "blur(8px)" }
                    }
                    animate={
                      shouldReduceMotion
                        ? { opacity: 1 }
                        : { opacity: 1, scale: 1, filter: "blur(0px)" }
                    }
                    exit={
                      shouldReduceMotion
                        ? { opacity: 0 }
                        : { opacity: 0, scale: 0.98, filter: "blur(8px)" }
                    }
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    key={project.id}
                    style={treatmentStyle}
                    data-cursor="media"
                    data-cursor-label="Open"
                    data-testid="work-reel-card"
                    className={`group scan-sweep dossier-panel relative flex min-w-0 cursor-pointer flex-col justify-end overflow-hidden rounded-[1.75rem] shadow-[0_26px_70px_rgba(0,0,0,0.36)] transition-all duration-500 hover:-translate-y-1 hover:border-white/[0.18] ${
                      project.bentoSize === "large"
                        ? "xl:col-span-2"
                        : "xl:col-span-1"
                    }`}
                    onClick={() => setSelectedProject(project)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        setSelectedProject(project);
                      }
                    }}
                  >
                    <div className="absolute inset-0 overflow-hidden">
                      {project.type === "video" && project.videoSrc ? (
                        <SmartVideoPreview
                          src={project.videoSrc}
                          shouldReduceMotion={Boolean(shouldReduceMotion)}
                          className="h-full w-full object-cover object-center opacity-60 transition-all duration-700 group-hover:scale-105 group-hover:opacity-100"
                        />
                      ) : (
                        <Image
                          src={project.imgSrc ?? "/color.jpeg"}
                          alt={project.mediaAlt}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 70vw"
                          className="object-cover opacity-60 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03] group-hover:opacity-100 group-hover:brightness-110"
                        />
                      )}

                      <div className="absolute inset-0 archive-texture opacity-35 transition-opacity duration-700 group-hover:opacity-20" />
                      <div
                        className="absolute inset-0"
                        style={{
                          background:
                            "linear-gradient(180deg, transparent 0%, rgba(7,7,10,0.32) 34%, rgba(7,7,10,0.94) 100%), linear-gradient(115deg, var(--project-tint), transparent 58%)",
                        }}
                      />
                    </div>

                    <div className="absolute left-5 top-5 flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-black/[0.35] text-white/72 backdrop-blur-md">
                        {project.type === "video" ? (
                          <Video className="h-4 w-4" aria-hidden="true" />
                        ) : (
                          <ImageIcon className="h-4 w-4" aria-hidden="true" />
                        )}
                      </div>
                      <span className="rounded-full border border-white/10 bg-black/[0.35] px-3 py-2 font-mono text-[10px] uppercase tracking-[0.22em] text-white/60 backdrop-blur-md">
                        {project.visualTreatment.code}
                      </span>
                    </div>

                    {project.type === "video" && !shouldReduceMotion && (
                      <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center opacity-0 transition-all duration-500 group-hover:opacity-100">
                        <div className="flex h-20 w-20 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white shadow-[0_0_30px_rgba(0,0,0,0.4)] backdrop-blur-xl transition-transform duration-500 group-hover:scale-110">
                          <Play className="ml-1 h-6 w-6" aria-hidden="true" />
                        </div>
                      </div>
                    )}

                    <div className="relative z-20 min-w-0 p-7 md:p-8">
                      <div className="mb-4 flex flex-wrap items-center gap-2">
                        <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--project-accent)]">
                          {project.category}
                        </span>
                        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/42">
                          / {project.visualTreatment.signal}
                        </span>
                      </div>

                      <h3 className="max-w-2xl font-serif text-3xl font-black leading-tight tracking-normal text-white md:text-4xl">
                        {project.title}
                      </h3>

                      <p className="mt-4 max-w-3xl text-sm leading-relaxed text-white/76">
                        {project.brief}
                      </p>

                      <div className="mt-5 flex flex-wrap gap-2">
                        {project.deliverables.slice(0, 3).map((item) => (
                          <span
                            key={item}
                            className="rounded-full border border-white/[0.12] bg-white/[0.08] px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-white/76"
                          >
                            {item}
                          </span>
                        ))}
                      </div>

                      <div className="mt-6 inline-flex min-h-10 items-center rounded-full border border-white/20 px-4 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-white/[0.86] transition-colors group-hover:border-[var(--project-accent)]/70 group-hover:text-white">
                        Open Project
                        <ArrowUpRight className="ml-2 h-3.5 w-3.5" aria-hidden="true" />
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </AnimatePresence>
          </motion.div>
      </PinnedDossierChapter>

      <AnimatePresence>
        {selectedProject && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 py-8 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
            role="dialog"
            aria-modal="true"
            aria-label={`${selectedProject.title} preview`}
          >
            <motion.div
              style={getTreatmentStyle(selectedProject)}
              data-native-scroll="true"
              className="dossier-panel hide-scrollbar relative max-h-[calc(100svh-2rem)] w-full max-w-6xl overflow-auto rounded-[1.75rem]"
              initial={
                shouldReduceMotion
                  ? { opacity: 0 }
                  : { opacity: 0, y: 24, scale: 0.95 }
              }
              animate={
                shouldReduceMotion
                  ? { opacity: 1 }
                  : { opacity: 1, y: 0, scale: 1 }
              }
              exit={
                shouldReduceMotion
                  ? { opacity: 0 }
                  : { opacity: 0, y: 16, scale: 0.95 }
              }
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              onClick={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                onClick={closeModal}
                className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/[0.48] text-white transition-colors hover:border-white/40"
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
                      ? "relative overflow-hidden bg-black/60 w-full min-h-[45vh] lg:min-h-[65vh] shrink-0"
                      : "relative overflow-hidden bg-black/60 min-h-[320px] lg:min-h-[620px] self-start lg:sticky lg:top-0"
                  }
                  data-cursor="media"
                  data-cursor-label="Preview"
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
                        className="object-cover opacity-[0.15] blur-2xl grayscale"
                        aria-hidden="true"
                      />
                      <Image
                        src={selectedProject.imgSrc ?? "/color.jpeg"}
                        alt={selectedProject.mediaAlt}
                        fill
                        sizes="(max-width: 1024px) 100vw, 720px"
                        className="object-contain opacity-100 z-10"
                      />
                    </>
                  )}
                  <div className="absolute inset-0 archive-texture opacity-30" />
                  <div className="absolute bottom-5 left-5 rounded-full border border-white/[0.12] bg-black/[0.42] px-4 py-2 font-mono text-[10px] uppercase tracking-[0.24em] text-white/68 backdrop-blur-md">
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
                    <p className="font-mono text-[10px] font-bold uppercase tracking-[0.24em] text-[var(--project-accent)]">
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
                    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/42">
                        Brief
                      </p>
                      <p className="mt-2 text-sm leading-relaxed text-white/78">
                        {selectedProject.brief}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/42">
                        Role
                      </p>
                      <p className="mt-2 text-sm leading-relaxed text-white/78">
                        {selectedProject.role}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/42">
                        Impact
                      </p>
                      <p className="mt-2 text-sm leading-relaxed text-white/78">
                        {selectedProject.impact}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {selectedProject.deliverables.map((item) => (
                      <span
                        key={item}
                        className="rounded-full border border-white/[0.12] bg-white/[0.08] px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-white/76"
                      >
                        {item}
                      </span>
                    ))}
                  </div>

                  <a
                    href={getProjectInquiryHref(selectedProject.title)}
                    className="scan-sweep inline-flex min-h-12 items-center rounded-full bg-[var(--color-accent)] px-5 py-2 font-mono text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#07070A] transition-shadow hover:shadow-[0_0_24px_rgba(159,122,234,0.34)]"
                  >
                    Discuss this direction
                    <ArrowUpRight className="ml-2 h-4 w-4" aria-hidden="true" />
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
