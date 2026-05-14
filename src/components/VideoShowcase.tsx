"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Play, ArrowUpRight, Image as ImageIcon, Video, X } from "lucide-react";
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
import SmartVideoPreview from "@/components/SmartVideoPreview";

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

  const getProjectInquiryHref = (projectTitle: string) => {
    const subject = encodeURIComponent(`Project inquiry: ${projectTitle}`);
    const body = encodeURIComponent(
      "Hi Geetha,\n\nI saw your portfolio and would love to discuss this project direction."
    );

    return `mailto:${CONTACT.email}?subject=${subject}&body=${body}`;
  };

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

  return (
    <section
      id="work"
      aria-labelledby="work-heading"
      className="relative mx-auto min-h-screen max-w-[1400px] scroll-mt-28 bg-transparent px-6 py-20 md:px-12 md:py-24"
    >
      <div className="flex flex-col items-start gap-12 lg:flex-row lg:gap-24">
        <div className="z-20 w-full flex-shrink-0 space-y-12 lg:sticky lg:top-32 lg:w-[280px]">
          <div>
            <p className="mb-4 font-mono text-[10px] font-bold uppercase tracking-[0.6em] text-[var(--color-accent)]">
              The Archives
            </p>
            <h2
              id="work-heading"
              className="text-4xl font-serif font-black tracking-tight text-white md:text-5xl"
            >
              Selected <br className="hidden lg:block" /> Works
            </h2>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-white/78">
              A curated directory of cinematic edits, brand explorations, and
              digital design snapshots.
            </p>
          </div>

          <div
            className="hide-scrollbar flex gap-2 overflow-x-auto border-b border-white/10 pb-4 lg:flex-col lg:border-b-0 lg:border-l lg:pb-0 lg:pl-6"
            role="group"
            aria-label="Project categories"
          >
            {PROJECT_CATEGORIES.map((category) => {
              const isActive = activeCategory === category;
              const count = getProjectCountByCategory(
                SHOWCASE_PROJECTS,
                category
              );

              return (
                <button
                  key={category}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => setActiveCategory(category)}
                  className={`group relative inline-flex min-h-11 items-center justify-between whitespace-nowrap rounded-lg px-4 py-3 text-left transition-all duration-300 lg:px-0 ${
                    isActive
                      ? "text-white"
                      : "text-white/55 hover:text-white/85"
                  }`}
                >
                  <span className="relative z-10 font-sans text-sm font-bold uppercase tracking-widest">
                    {category}
                  </span>
                  <span className="ml-6 hidden font-mono text-[10px] opacity-60 lg:block">
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
                      className="absolute inset-0 rounded-lg bg-white/5 lg:hidden"
                    />
                  )}
                </button>
              );
            })}
          </div>
          <p className="sr-only" aria-live="polite">
            Showing {filteredProjects.length} projects for {activeCategory}.
          </p>
        </div>

        <div className="w-full flex-1">
          <motion.div
            layout
            className="grid auto-rows-[340px] grid-cols-1 gap-6 md:grid-cols-2"
          >
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project) => (
                <motion.article
                  layout
                  initial={
                    shouldReduceMotion
                      ? { opacity: 0 }
                      : { opacity: 0, scale: 0.96, filter: "blur(8px)" }
                  }
                  animate={
                    shouldReduceMotion
                      ? { opacity: 1 }
                      : { opacity: 1, scale: 1, filter: "blur(0px)" }
                  }
                  exit={
                    shouldReduceMotion
                      ? { opacity: 0 }
                      : { opacity: 0, scale: 0.96, filter: "blur(8px)" }
                  }
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  key={project.id}
                  className={`group relative flex cursor-pointer flex-col justify-end overflow-hidden rounded-[2rem] border border-white/5 bg-[#0A0A0E] shadow-xl transition-shadow duration-500 hover:shadow-[0_20px_60px_rgba(0,0,0,0.4)] ${
                    project.bentoSize === "large"
                      ? "md:col-span-2"
                      : "md:col-span-1"
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
                        className="h-full w-full object-cover opacity-45 transition-all duration-700 group-hover:opacity-70 group-hover:scale-105"
                      />
                    ) : (
                      <Image
                        src={project.imgSrc ?? "/color.jpeg"}
                        alt={`${project.title} project preview`}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 70vw"
                        className="object-cover opacity-45 grayscale transition-all duration-700 group-hover:opacity-70 group-hover:scale-105 group-hover:grayscale-0"
                      />
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0F] via-[#0B0B0F]/60 to-transparent" />
                  </div>

                  <div className="absolute left-6 top-6 flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-black/40 text-white/75 backdrop-blur-md">
                      {project.type === "video" ? (
                        <Video className="h-3.5 w-3.5" aria-hidden="true" />
                      ) : (
                        <ImageIcon className="h-3.5 w-3.5" aria-hidden="true" />
                      )}
                    </div>
                  </div>

                  {project.type === "video" && !shouldReduceMotion && (
                    <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center opacity-0 transition-all duration-500 group-hover:scale-100 group-hover:opacity-100">
                      <div className="flex h-20 w-20 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white shadow-[0_0_30px_rgba(0,0,0,0.3)] backdrop-blur-xl">
                        <Play className="ml-1 h-6 w-6" aria-hidden="true" />
                      </div>
                    </div>
                  )}

                  <div className="relative z-20 p-8 pt-20">
                    <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-[var(--color-accent)] opacity-95">
                      {project.category}
                    </p>
                    <h3 className="text-2xl font-serif font-bold leading-tight tracking-tight text-white md:text-3xl">
                      {project.title}
                    </h3>

                    <p className="mt-3 text-sm leading-relaxed text-white/78">
                      {project.summary}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-white/15 bg-white/10 px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-white/80"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="mt-5 inline-flex min-h-10 items-center rounded-full border border-white/25 px-4 py-2 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-white/90 transition-colors group-hover:border-[var(--color-accent)]/50 group-hover:text-[var(--color-accent)]">
                      Open preview
                    </div>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {selectedProject && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 px-4 py-8 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
            role="dialog"
            aria-modal="true"
            aria-label={`${selectedProject.title} preview`}
          >
            <motion.div
              className="hide-scrollbar relative max-h-[90vh] w-full max-w-5xl overflow-auto rounded-3xl border border-white/10 bg-[#0C0C12]"
              initial={
                shouldReduceMotion
                  ? { opacity: 0 }
                  : { opacity: 0, y: 16, scale: 0.98 }
              }
              animate={
                shouldReduceMotion
                  ? { opacity: 1 }
                  : { opacity: 1, y: 0, scale: 1 }
              }
              exit={
                shouldReduceMotion
                  ? { opacity: 0 }
                  : { opacity: 0, y: 12, scale: 0.98 }
              }
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              onClick={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                onClick={closeModal}
                className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white transition-colors hover:border-white/40"
                aria-label="Close preview"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="relative aspect-[16/10] w-full overflow-hidden bg-black/40">
                {selectedProject.type === "video" && selectedProject.videoSrc ? (
                  <video
                    src={selectedProject.videoSrc}
                    controls
                    autoPlay={!shouldReduceMotion}
                    loop={!shouldReduceMotion}
                    muted
                    playsInline
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Image
                    src={selectedProject.imgSrc ?? "/color.jpeg"}
                    alt={`${selectedProject.title} preview`}
                    fill
                    sizes="(max-width: 1024px) 100vw, 960px"
                    className="object-cover"
                  />
                )}
              </div>

              <div className="space-y-4 p-6 md:p-8">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-accent)]">
                  {selectedProject.category}
                </p>
                <h3 className="font-serif text-3xl font-black text-white md:text-4xl">
                  {selectedProject.title}
                </h3>
                <p className="max-w-3xl text-sm leading-relaxed text-white/80 md:text-base">
                  {selectedProject.summary}
                </p>
                <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/65">
                  Outcome: {selectedProject.outcome}
                </p>

                <div className="flex flex-wrap gap-2">
                  {selectedProject.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-white/15 bg-white/10 px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-white/80"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <a
                  href={getProjectInquiryHref(selectedProject.title)}
                  className="inline-flex min-h-11 items-center rounded-full bg-[var(--color-accent)] px-5 py-2 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-white transition-shadow hover:shadow-[0_0_22px_rgba(139,92,246,0.45)]"
                >
                  Discuss this project
                  <ArrowUpRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
