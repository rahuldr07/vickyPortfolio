"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";
import { TOOLS } from "@/content/portfolio";

gsap.registerPlugin(ScrollTrigger);

export default function BentoGrid() {
  const sectionRef = useRef<HTMLElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      const ctx = gsap.context(() => {
        const cards = cardsRef.current?.querySelectorAll(".bento-card");
        if (cards?.length) {
          gsap.from(cards, {
            y: reduced ? 0 : 20,
            opacity: 0,
            duration: reduced ? 0.25 : 1,
            ease: "power2.out",
            stagger: reduced ? 0 : 0.1,
            scrollTrigger: {
              trigger: cardsRef.current,
              start: "top 90%",
              once: true,
            },
          });
        }

        if (marqueeRef.current && !reduced) {
          const totalWidth = marqueeRef.current.scrollWidth / 2;
          gsap.to(marqueeRef.current, {
            x: `-=${totalWidth}`,
            duration: 35,
            ease: "none",
            repeat: -1,
            modifiers: {
              x: gsap.utils.unitize((x) => parseFloat(x) % totalWidth),
            },
          });
        }
      }, sectionRef);

      return () => ctx.revert();
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="arsenal"
      aria-labelledby="arsenal-heading"
      className="relative mx-auto max-w-[1400px] scroll-mt-28 bg-transparent px-6 py-20 md:px-12 md:py-24"
    >
      <div className="flex flex-col items-start gap-12 lg:flex-row lg:gap-12">
        <header className="z-20 w-full flex-shrink-0 space-y-4 text-left lg:sticky lg:top-32 lg:w-[280px]">
          <p className="mb-4 font-mono text-[10px] font-bold uppercase tracking-[0.5em] text-[var(--color-accent)]">
            Inventory / 02
          </p>
          <h2
            id="arsenal-heading"
            className="text-4xl font-serif font-black tracking-tight text-white md:text-5xl"
          >
            The Arsenal
          </h2>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-white/72">
            A curated selection of tools and methodologies leveraged to craft
            high-performance visual identities.
          </p>
        </header>

        <div
          ref={cardsRef}
          className="grid w-full flex-1 grid-cols-1 gap-px overflow-hidden rounded-3xl border border-white/8 bg-white/8 shadow-2xl md:grid-cols-12"
        >
        <div className="bento-card group relative flex flex-col justify-center bg-[#0B0B0F] p-12 md:col-span-8 md:p-20">
          <div className="motion-safe:animate-ping absolute left-12 top-12 h-1 w-1 rounded-full bg-[var(--color-accent)]" />
          <h3 className="mb-12 text-sm font-mono uppercase tracking-[0.4em] text-white/40">
            Design Philosophy
          </h3>
          <p className="max-w-2xl font-serif text-2xl leading-tight text-white/70 transition-colors duration-700 group-hover:text-white md:text-4xl">
            I synthesize <span className="text-white">Instructional Design</span>{" "}
            with high-end
            <span className="text-[var(--color-accent)]">
              {" "}
              Cinematic Storytelling
            </span>{" "}
            to bridge the gap between complex data and intuitive human
            experience.
          </p>
          <div className="mt-16 flex items-center gap-8 font-mono text-[10px] uppercase tracking-widest text-white/40">
            <div className="flex items-center gap-2">
              <span className="text-[var(--color-accent)]">[01]</span> Strategy
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[var(--color-accent)]">[02]</span> Execution
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[var(--color-accent)]">[03]</span> Refinement
            </div>
          </div>
        </div>

        <div className="bento-card group flex flex-col border-l border-white/8 bg-[#0B0B0F] p-12 md:col-span-4">
          <h3 className="mb-12 text-sm font-mono uppercase tracking-[0.4em] text-white/40">
            Formation
          </h3>
          <div className="mt-auto space-y-12">
            <div>
              <h4 className="font-serif text-3xl font-bold tracking-tight text-white">
                Arena Animations
              </h4>
              <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-soft)]">
                VFX Prime / 2019—2022
              </p>
            </div>
            <div className="space-y-4">
              {["Post-Production", "Compositing", "CGI Mastery"].map((item) => (
                <div
                  key={item}
                  className="flex items-center justify-between border-b border-white/8 pb-2 font-mono text-xs text-white/55 transition-colors group-hover:text-white/75"
                >
                  <span>{item}</span>
                  <ArrowRight className="-translate-x-2 h-3 w-3 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bento-card overflow-hidden border-y border-white/8 bg-[#10101A] py-10 md:col-span-12">
          <div
            ref={marqueeRef}
            className="flex w-max items-center gap-24 whitespace-nowrap will-change-transform"
          >
            {[...TOOLS, ...TOOLS, ...TOOLS].map((tool, index) => (
              <div key={`${tool}-${index}`} className="group/item flex items-center gap-12">
                <span className="select-none font-mono text-xs font-bold uppercase tracking-[0.5em] text-white/35 transition-all duration-300 group-hover/item:text-[var(--color-accent)] md:text-sm">
                  {tool}
                </span>
                <span className="font-mono text-[10px] tracking-widest text-[var(--color-accent)] opacity-30">
                  /
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bento-card flex flex-col items-center justify-between gap-20 bg-[#0B0B0F] p-12 md:col-span-12 md:flex-row md:p-16">
          <div className="flex-1">
            <h3 className="mb-8 text-sm font-mono uppercase tracking-[0.4em] text-white/40">
              Strategic Capability
            </h3>
            <div className="grid grid-cols-2 gap-x-8 gap-y-12 md:grid-cols-3">
              {[
                { label: "Identity", sub: "Logo & Branding" },
                { label: "Interface", sub: "Web & UX/UI" },
                { label: "Narrative", sub: "Video & Editing" },
                { label: "Instruction", sub: "E-Learning UI" },
                { label: "Structure", sub: "Print & Layout" },
                { label: "Foundation", sub: "Color Theory" },
              ].map((item) => (
                <div key={item.label} className="group cursor-default">
                  <p className="font-serif text-lg font-bold text-white transition-colors group-hover:text-[var(--color-accent)]">
                    {item.label}
                  </p>
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-white/50">
                    {item.sub}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
        </div>
      </div>
    </section>
  );
}
