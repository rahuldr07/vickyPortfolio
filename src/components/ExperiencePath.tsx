"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { EXPERIENCE_ENTRIES } from "@/content/portfolio";

gsap.registerPlugin(ScrollTrigger);

export default function ExperiencePath() {
  const sectionRef = useRef<HTMLElement>(null);
  const lineFill = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const shipRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      const ctx = gsap.context(() => {
        gsap.fromTo(
          lineFill.current,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            transformOrigin: "top center",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top center",
              end: "bottom center",
              scrub: reduced ? false : 0.5,
            },
          }
        );

        gsap.fromTo(
          shipRef.current,
          { y: 0, opacity: 0 },
          {
            y: () => sectionRef.current?.offsetHeight || 0,
            opacity: 1,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top center",
              end: "bottom center",
              scrub: reduced ? false : 0.5,
            },
          }
        );

        const nodes = sectionRef.current?.querySelectorAll(".timeline-node");
        nodes?.forEach((node) => {
          gsap.fromTo(
            node,
            { scale: 0, opacity: 0 },
            {
              scale: 1,
              opacity: 1,
              duration: reduced ? 0.2 : 0.4,
              ease: "back.out(2)",
              scrollTrigger: {
                trigger: node,
                start: "top 65%",
                once: true,
              },
            }
          );
        });

        const cards = cardsRef.current?.querySelectorAll(".exp-card");
        cards?.forEach((card) => {
          gsap.from(card, {
            y: reduced ? 0 : 24,
            opacity: 0,
            duration: reduced ? 0.25 : 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 80%",
              once: true,
            },
          });
        });
      }, sectionRef);

      return () => ctx.revert();
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="experience"
      aria-labelledby="experience-heading"
      className="relative mx-auto max-w-[1400px] scroll-mt-28 px-6 py-20 md:px-12 md:py-24"
    >
      <div className="flex flex-col items-start gap-12 lg:flex-row lg:gap-12">
        <header className="z-20 w-full flex-shrink-0 space-y-4 text-left lg:sticky lg:top-32 lg:w-[280px]">
          <h2
            id="experience-heading"
            className="text-glow text-4xl font-serif md:text-5xl"
          >
            The Journey
          </h2>
          <p className="mt-2 max-w-sm font-mono text-sm uppercase tracking-widest text-[var(--color-soft)]">
            Experience & Evolution
          </p>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/72">
            A timeline of growth across design, content, and digital execution — with
            impact and ownership at each stage.
          </p>
        </header>

        <div className="relative w-full flex-1">
          <div className="absolute bottom-0 left-2 top-0 w-[2px] bg-white/10" />

          <div
            ref={lineFill}
            className="absolute bottom-0 left-2 top-0 z-10 w-[2px] origin-top"
            style={{
              background:
                "linear-gradient(to bottom, var(--color-accent), var(--color-soft))",
              boxShadow: "0 0 15px var(--color-accent)",
            }}
          />

          <div
            ref={shipRef}
            className="pointer-events-none absolute left-2 z-30 flex justify-center"
            style={{ top: 0, transform: "translateX(-50%)" }}
          >
          <div className="relative flex items-center justify-center">
            <div className="h-3 w-3 rotate-45 border border-white/50 bg-[var(--color-accent)] shadow-[0_0_15px_var(--color-accent)]" />
            <div className="motion-safe:animate-pulse absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--color-accent)]/20 blur-xl" />
          </div>
        </div>

          <div ref={cardsRef} className="flex flex-col gap-14">
            {EXPERIENCE_ENTRIES.map((experience) => (
              <div
                key={`${experience.company}-${experience.duration}`}
                className="relative pl-10"
              >
                <div className="absolute left-2 top-8 z-20 h-5 w-5 -translate-x-1/2 rounded-full border-2 border-white/10 bg-[var(--color-background)]" />
                <div
                  className="timeline-node absolute left-2 top-8 z-20 h-5 w-5 -translate-x-1/2 rounded-full"
                  style={{
                    background: "var(--color-accent)",
                    boxShadow: "0 0 20px var(--color-accent)",
                    opacity: 0,
                  }}
                />

                <div className="exp-card group relative overflow-hidden rounded-3xl border border-white/5 bg-[var(--color-surface)]/40 p-8 backdrop-blur-md transition-all duration-500 hover:border-[var(--color-accent)]/40">
                  <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-accent)]/10 to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
                  <span className="font-mono text-xs uppercase tracking-widest text-[var(--color-soft)]">
                    {experience.duration}
                  </span>
                  <h3 className="mt-2 font-serif text-2xl text-white">
                    {experience.role}
                  </h3>
                  <h4 className="mb-4 text-lg text-[var(--color-soft)]">
                    {experience.company}
                  </h4>
                  <p className="font-sans text-sm leading-relaxed text-white/72">
                    {experience.description}
                  </p>
                  <p className="mt-4 inline-flex rounded-full border border-white/15 bg-white/5 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-white/78">
                    {experience.highlight}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
