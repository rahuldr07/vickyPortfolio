"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Ship } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const experiences = [
  {
    role: "Graphic Designer (Intern)",
    company: "Pixel scoop studios",
    duration: "2021 Jan – 2021 Dec",
    description: "Started as a Graphic Design intern focusing on Adobe Photoshop and Illustrator. Also took care of editing short videos and album videos.",
  },
  {
    role: "Graphic Designer & Content Creator",
    company: "GreenMonk Energy Drink",
    duration: "2022 Jan – 2023 Feb",
    description: "Worked on product posters, creative thumbnails, and UI screens. Video editing for music videos, product concept shorts, and YouTube content.",
  },
  {
    role: "Graphic & Web Designer",
    company: "Buddha-CEO Quantum Foundation",
    duration: "2023 March – Present",
    description: "Designing flyers, brochures, standees, magazines, and books. Also taking care of daily website updates and web design handling.",
  },
];

export default function ExperiencePath() {
  const sectionRef  = useRef<HTMLElement>(null);
  const lineFill    = useRef<HTMLDivElement>(null);
  const cardsRef    = useRef<HTMLDivElement>(null);
  const shipRef     = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const ctx = gsap.context(() => {

      // ── 1. Scrubbed line — draws 1:1 with scroll progress
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
            scrub: 0.5,
          },
        }
      );

      // ── 2. Ship follows the line
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
            scrub: 0.5,
          },
        }
      );

      // ── 3. Timeline nodes pulse in when the ship/scroll reaches them
      const nodes = sectionRef.current?.querySelectorAll(".timeline-node");
      nodes?.forEach((node) => {
        gsap.fromTo(
          node,
          { scale: 0, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.4,
            ease: "back.out(2)",
            scrollTrigger: {
              trigger: node,
              start: "top 65%",
              once: true,
            },
          }
        );
      });

      // ── 4. Cards stagger in from alternating sides
      const cards = cardsRef.current?.querySelectorAll(".exp-card");
      cards?.forEach((card, i) => {
        const fromX = i % 2 === 0 ? -60 : 60;
        gsap.from(card, {
          x: fromX,
          opacity: 0,
          duration: 0.8,
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
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="relative py-32 px-6 md:px-20 max-w-5xl mx-auto" id="experience">
      <div className="mb-24 relative z-10">
        <h2 className="text-4xl md:text-6xl font-serif text-glow">The Journey</h2>
        <p className="font-mono text-[var(--color-soft)] mt-2 uppercase tracking-widest text-sm">Experience & Evolution</p>
      </div>

      <div className="relative">
        {/* Track line */}
        <div
          className="absolute left-6 md:left-1/2 md:-translate-x-1/2 top-0 bottom-0 w-[2px] bg-white/10"
        />

        {/* GSAP-driven fill line */}
        <div
          ref={lineFill}
          className="absolute left-6 md:left-1/2 md:-translate-x-1/2 top-0 bottom-0 w-[2px] origin-top z-10"
          style={{
            background: "linear-gradient(to bottom, var(--color-accent), var(--color-soft))",
            boxShadow: "0 0 15px var(--color-accent)",
          }}
        />

        {/* THE SHIP — follows scroll */}
        <div
          ref={shipRef}
          className="absolute left-6 md:left-1/2 md:-translate-x-1/2 -ml-3 md:-ml-0 z-30 pointer-events-none"
          style={{ top: 0, transform: "translateX(-50%)" }}
        >
          <div className="relative">
            <Ship className="w-8 h-8 text-[var(--color-accent)] filter drop-shadow-[0_0_8px_var(--color-accent)]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-[var(--color-accent)]/20 blur-xl rounded-full animate-pulse" />
          </div>
        </div>

        <div ref={cardsRef} className="flex flex-col gap-32">
          {experiences.map((exp, index) => {
            const isEven = index % 2 === 0;
            return (
              <div key={index} className={`relative flex flex-col md:flex-row items-center ${isEven ? "" : "md:flex-row-reverse"} gap-8 md:gap-16`}>

                {/* Animated node */}
                <div className="absolute left-6 md:left-1/2 md:-translate-x-1/2 w-5 h-5 rounded-full bg-[var(--color-background)] border-2 border-white/10 z-20" />
                <div
                  className="timeline-node absolute left-6 md:left-1/2 md:-translate-x-1/2 w-5 h-5 rounded-full z-20"
                  style={{
                    background: "var(--color-accent)",
                    boxShadow: "0 0 20px var(--color-accent)",
                    opacity: 0,
                  }}
                />

                {/* Card */}
                <div className={`exp-card flex-1 pl-10 md:pl-0 w-full ${isEven ? "md:text-right" : "md:text-left"}`}>
                  <div className={`p-8 rounded-3xl bg-[var(--color-surface)]/40 border border-white/5 backdrop-blur-md hover:border-[var(--color-accent)]/40 transition-all duration-500 relative group overflow-hidden ${isEven ? "md:ml-12" : "md:mr-12"}`}>
                    <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-accent)]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    <span className="font-mono text-xs text-[var(--color-soft)] uppercase tracking-widest">{exp.duration}</span>
                    <h3 className="text-2xl font-serif mt-2 mb-1 text-white">{exp.role}</h3>
                    <h4 className="text-lg font-sans text-[var(--color-soft)] mb-4">{exp.company}</h4>
                    <p className="text-[var(--color-muted)] font-sans leading-relaxed text-sm">{exp.description}</p>
                  </div>
                </div>

                {/* Spacer */}
                <div className="hidden md:block flex-1" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
