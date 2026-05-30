"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { motion, useReducedMotion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { BadgeCheck, BriefcaseBusiness, Clapperboard } from "lucide-react";
import { EXPERIENCE_ENTRIES } from "@/content/portfolio";
import PinnedDossierChapter from "@/components/PinnedDossierChapter";

gsap.registerPlugin(ScrollTrigger);

const icons = [Clapperboard, BriefcaseBusiness, BadgeCheck] as const;

export default function ExperiencePath() {
  const sectionRef = useRef<HTMLElement>(null);
  const lineFillRef = useRef<HTMLDivElement>(null);
  const linePulseRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      const reduced =
        reducedMotion ??
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      const ctx = gsap.context(() => {
        if (reduced) {
          gsap.set(lineFillRef.current, { scaleY: 1 });
          gsap.set(linePulseRef.current, { autoAlpha: 0 });
        } else {
          const lineTimeline = gsap.timeline({
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 72%",
              end: "bottom 58%",
              scrub: 0.65,
            },
          });

          lineTimeline
            .fromTo(
              lineFillRef.current,
              { scaleY: 0 },
              {
                scaleY: 1,
                ease: "none",
                transformOrigin: "top center",
              },
              0
            )
            .fromTo(
              linePulseRef.current,
              { top: "0%", autoAlpha: 0.2 },
              { top: "100%", autoAlpha: 1, ease: "none" },
              0
            );
        }

        const stops = sectionRef.current?.querySelectorAll(".experience-stop");
        stops?.forEach((stop, index) => {
          gsap.fromTo(
            stop,
            { scale: 0.82, opacity: 0 },
            {
              scale: 1,
              opacity: 1,
              delay: reduced ? 0 : index * 0.1,
              duration: reduced ? 0.2 : 0.42,
              ease: "back.out(1.7)",
              scrollTrigger: {
                trigger: stop,
                start: "top 82%",
                once: true,
              },
            }
          );
        });

        const cards = cardsRef.current?.querySelectorAll(".exp-card");
        cards?.forEach((card, index) => {
          gsap.fromTo(
            card,
            { y: reduced ? 0 : 26, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              delay: reduced ? 0 : index * 0.08,
              duration: reduced ? 0.2 : 0.7,
              ease: "power3.out",
              scrollTrigger: {
                trigger: card,
                start: "top 84%",
                once: true,
              },
            }
          );
        });
      }, sectionRef);

      return () => ctx.revert();
    },
    { dependencies: [reducedMotion], scope: sectionRef }
  );

  const rail = (
    <>
      <h2
        id="experience-heading"
        className="text-glow font-serif text-4xl font-black leading-[0.94] tracking-normal text-white md:text-5xl"
      >
        Experience
      </h2>
      <p className="mt-2 max-w-sm font-mono text-sm uppercase tracking-widest text-[var(--color-soft)]">
        Signal / Timeline
      </p>
      <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-white/72">
        A clean line through studio production, campaign content, and current
        graphic plus web design work.
      </p>
      <div className="mt-7 grid max-w-sm grid-cols-3 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
        <div className="border-r border-white/10 p-3">
          <p className="font-serif text-2xl font-black text-white">3</p>
          <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.18em] text-white/48">
            Stops
          </p>
        </div>
        <div className="border-r border-white/10 p-3">
          <p className="font-serif text-2xl font-black text-white">5+</p>
          <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.18em] text-white/48">
            Years
          </p>
        </div>
        <div className="p-3">
          <p className="font-serif text-2xl font-black text-white">2</p>
          <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.18em] text-white/48">
            Tracks
          </p>
        </div>
      </div>
    </>
  );

  return (
    <PinnedDossierChapter
      ref={sectionRef}
      id="experience"
      labelledBy="experience-heading"
      rail={rail}
      railClassName="lg:pt-2"
      contentClassName="hide-scrollbar"
      viewportChapter
    >
      <div className="relative w-full min-w-0 py-2 pl-16 sm:pl-20">
        <div
          data-testid="experience-line"
          className="absolute bottom-8 left-7 top-8 w-px bg-white/10 sm:left-9"
        >
          <div
            ref={lineFillRef}
            data-testid="experience-line-fill"
            className="h-full w-px origin-top bg-gradient-to-b from-[var(--color-accent)] via-[var(--color-soft)] to-[#18c7b5] shadow-[0_0_18px_rgba(176,132,246,0.5)]"
          />
          <div
            ref={linePulseRef}
            data-testid="experience-line-pulse"
            className="absolute left-1/2 h-14 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-b from-transparent via-white to-transparent opacity-70 blur-[2px]"
          />
        </div>

        <div ref={cardsRef} className="flex flex-col gap-7">
          {EXPERIENCE_ENTRIES.map((experience, index) => {
            const Icon = icons[index] ?? BadgeCheck;
            const isCurrent = index === EXPERIENCE_ENTRIES.length - 1;

            return (
              <motion.article
                key={`${experience.company}-${experience.duration}`}
                className="exp-card group relative"
                initial={reducedMotion ? false : { opacity: 0, y: 20 }}
                whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
              >
                <div
                  data-testid="experience-stop"
                  className={[
                    "experience-stop absolute -left-[3.6rem] top-6 z-20 flex h-12 w-12 items-center justify-center rounded-2xl border bg-[#101018] shadow-[0_14px_34px_rgba(0,0,0,0.42)] sm:-left-[4.25rem]",
                    isCurrent
                      ? "border-[#18c7b5]/80 text-[#9ff4e5] ring-4 ring-[#18c7b5]/12"
                      : "border-white/15 text-[var(--color-accent)]",
                  ].join(" ")}
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </div>

                <div className="dossier-panel relative overflow-hidden rounded-3xl p-5 transition-all duration-500 hover:-translate-y-1 hover:border-[var(--color-accent)]/40 md:p-7">
                  <div className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-[var(--color-accent)]/0 via-[var(--color-accent)]/70 to-[#18c7b5]/0 opacity-80" />
                  <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-accent)]/10 via-transparent to-[#18c7b5]/[0.04] opacity-0 transition-opacity duration-700 group-hover:opacity-100" />

                  <div className="relative flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="font-mono text-xs uppercase tracking-widest text-[var(--color-soft)]">
                          {experience.duration}
                        </span>
                        {isCurrent ? (
                          <span className="rounded-full border border-[#18c7b5]/30 bg-[#18c7b5]/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-[#9ff4e5]">
                            Current
                          </span>
                        ) : null}
                      </div>
                      <h3 className="mt-2 font-serif text-[1.65rem] font-black leading-tight tracking-normal text-white md:text-3xl">
                        {experience.role}
                      </h3>
                      <h4 className="mt-1 font-sans text-base font-semibold text-[var(--color-soft)] md:text-lg">
                        {experience.company}
                      </h4>
                    </div>
                    <p className="inline-flex w-fit rounded-full border border-white/15 bg-white/5 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-white/78">
                      {experience.highlight}
                    </p>
                  </div>

                  <p className="relative mt-5 max-w-3xl font-sans text-[15px] leading-relaxed text-white/72">
                    {experience.description}
                  </p>

                  <div className="relative mt-5 flex flex-wrap gap-2">
                    {experience.focus.map((item) => (
                      <span
                        key={item}
                        className="rounded-full border border-white/10 bg-[#121218] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-white/62 transition-colors group-hover:border-[#18c7b5]/35 group-hover:text-white/75"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </PinnedDossierChapter>
  );
}
