"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { BadgeCheck, BriefcaseBusiness, Clapperboard, GraduationCap } from "lucide-react";
import { EXPERIENCE_ENTRIES } from "@/content/portfolio";
import PinnedDossierChapter from "@/components/PinnedDossierChapter";

gsap.registerPlugin(ScrollTrigger);

export default function ExperiencePath() {
  const sectionRef = useRef<HTMLElement>(null);
  const lineFill = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      const ctx = gsap.context(() => {
        gsap.fromTo(
          lineFill.current,
          { scaleY: 0 },
          {
            scaleY: 1,
            duration: reduced ? 0.2 : 0.9,
            ease: "power2.out",
            transformOrigin: "top center",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 82%",
              once: true,
            },
          }
        );

        const nodes = sectionRef.current?.querySelectorAll(".timeline-node");
        nodes?.forEach((node) => {
          gsap.fromTo(
            node,
            { scale: 0.92, opacity: 0 },
            {
              scale: 1,
              opacity: 1,
              duration: reduced ? 0.2 : 0.35,
              ease: "power2.out",
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

  const rail = (
    <>
      <h2
        id="experience-heading"
        className="text-glow text-4xl font-serif md:text-5xl"
      >
        Experience
      </h2>
      <p className="mt-2 max-w-sm font-mono text-sm uppercase tracking-widest text-[var(--color-soft)]">
        Resume / Practice
      </p>
      <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-white/72">
        A clearer path through internship production, GreenMonk campaign content, and ongoing portfolio practice.
      </p>
    </>
  );

  const icons = [GraduationCap, Clapperboard, BriefcaseBusiness] as const;

  return (
    <PinnedDossierChapter
      ref={sectionRef}
      id="experience"
      labelledBy="experience-heading"
      rail={rail}
      railClassName="lg:pt-2"
      contentClassName="hide-scrollbar"
    >
        <div className="relative w-full flex-1 pl-4 sm:pl-6">
          <div className="absolute bottom-0 left-[5.5rem] top-0 w-[2px] bg-white/10" />

          <div
            ref={lineFill}
            className="absolute bottom-0 left-[5.5rem] top-0 z-10 w-[2px] origin-top opacity-60"
            style={{
              background:
                "linear-gradient(to bottom, var(--color-accent), var(--color-soft))",
              boxShadow: "0 0 10px var(--color-accent)",
            }}
          />

          <div ref={cardsRef} className="flex flex-col gap-7">
            {EXPERIENCE_ENTRIES.map((experience, index) => {
              const Icon = icons[index] ?? BadgeCheck;

              return (
              <div
                key={`${experience.company}-${experience.duration}`}
                className="relative pl-24 sm:pl-28"
              >
                <div className="timeline-node absolute left-14 top-7 z-20 flex h-10 w-10 -translate-x-1/2 items-center justify-center rounded-2xl border border-white/15 bg-[#101018] text-[var(--color-accent)] shadow-[0_12px_30px_rgba(0,0,0,0.32)] sm:left-16">
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </div>

                <div className="exp-card dossier-panel group relative overflow-hidden rounded-3xl p-6 transition-all duration-500 hover:border-[var(--color-accent)]/40 md:p-7">
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
                  <p className="font-sans text-[15px] leading-relaxed text-white/72">
                    {experience.description}
                  </p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {experience.focus.map((item) => (
                      <span
                        key={item}
                        className="rounded-full border border-white/10 bg-[#121218] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-white/62"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                  <p className="mt-4 inline-flex rounded-full border border-white/15 bg-white/5 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-white/78">
                    {experience.highlight}
                  </p>
                </div>
              </div>
              );
            })}
          </div>
        </div>
    </PinnedDossierChapter>
  );
}
