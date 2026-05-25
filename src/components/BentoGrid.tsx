"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";
import { TOOLS } from "@/content/portfolio";
import DossierChapter from "@/components/DossierChapter";

gsap.registerPlugin(ScrollTrigger);

export default function BentoGrid() {
  const sectionRef = useRef<HTMLElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      const ctx = gsap.context(() => {
        if (marqueeRef.current && !reduced) {
          const totalWidth = marqueeRef.current.scrollWidth / 2;
          gsap.to(marqueeRef.current, {
            x: `-=${totalWidth}`,
            duration: 40,
            ease: "none",
            repeat: -1,
            modifiers: {
              x: gsap.utils.unitize((x) => parseFloat(x) % totalWidth),
            },
          });
        }

        const handleCardMouseMove = (e: MouseEvent) => {
          const target = e.currentTarget as HTMLElement;
          const rect = target.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          target.style.setProperty("--mouse-x", `${x}px`);
          target.style.setProperty("--mouse-y", `${y}px`);
        };

        const bentoCards = cardsRef.current?.querySelectorAll(".bento-card");
        bentoCards?.forEach((card) => {
          card.addEventListener("mousemove", handleCardMouseMove as EventListener);
        });

        return () => {
          bentoCards?.forEach((card) => {
            card.removeEventListener("mousemove", handleCardMouseMove as EventListener);
          });
        };
      }, sectionRef);

      return () => ctx.revert();
    },
    { scope: sectionRef }
  );

  const rail = (
    <>
      <p className="dossier-kicker mb-4">
        Skills & Production
      </p>
      <h2
        id="arsenal-heading"
        className="text-4xl font-serif font-black tracking-tight text-white md:text-5xl"
      >
        Capabilities
      </h2>
      <p className="mt-4 max-w-md text-[15px] leading-relaxed text-white/72">
        A practical production stack for logos, posters, menus, thumbnails, reels, UI screens, and e-learning visuals.
      </p>
    </>
  );

  return (
    <DossierChapter
      ref={sectionRef}
      id="arsenal"
      labelledBy="arsenal-heading"
      rail={rail}
      contentClassName="hide-scrollbar"
      viewportChapter
    >
        <div
          ref={cardsRef}
          className="dossier-panel grid w-full flex-1 grid-cols-1 gap-px overflow-hidden rounded-3xl shadow-2xl lg:grid-cols-12"
        >
        <div className="bento-card group relative flex flex-col overflow-hidden bg-[#0B0B0F] p-6 opacity-100 transition-all duration-500 hover:bg-[#0E0E14] sm:p-8 lg:col-span-12 xl:p-10">
          <div className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{ background: "radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(176,132,246,0.1), transparent 40%)" }} />
          <h3 className="mb-8 text-sm font-mono uppercase tracking-[0.4em] text-white/40">
            Formation
          </h3>
          <div className="mt-auto space-y-8">
            <div>
              <h4 className="font-serif text-3xl font-bold tracking-tight text-white">
                Arena Animations
              </h4>
              <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-soft)]">
                VFX Prime / 2019-2022
              </p>
            </div>
            <div className="space-y-4">
              {["VFX Prime", "Post-production", "Compositing", "Motion basics"].map((item) => (
                <div
                  key={item}
                  className="flex items-center justify-between border-b border-white/[0.08] pb-2 font-mono text-xs text-white/55 transition-colors group-hover:text-white/75"
                >
                  <span>{item}</span>
                  <ArrowRight className="-translate-x-2 h-3 w-3 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bento-card relative h-20 overflow-hidden border-y border-white/[0.08] bg-[#10101A] opacity-100 transition-all duration-500 hover:bg-[#12121E] lg:col-span-12">
          <div className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{ background: "radial-gradient(800px circle at var(--mouse-x) var(--mouse-y), rgba(176,132,246,0.06), transparent 40%)" }} />
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 overflow-hidden">
            <div
              ref={marqueeRef}
              className="flex w-max items-center gap-12 whitespace-nowrap will-change-transform sm:gap-16 lg:gap-24"
            >
              {[...TOOLS, ...TOOLS].map((tool, index) => (
                <div key={`${tool}-${index}`} className="group/item flex items-center gap-6 sm:gap-8 lg:gap-12">
                  <span className="select-none font-mono text-[11px] font-bold uppercase tracking-[0.28em] text-white/35 transition-all duration-300 group-hover/item:text-[var(--color-accent)] sm:tracking-[0.4em] md:text-sm">
                    {tool}
                  </span>
                  <span className="font-mono text-[10px] tracking-widest text-[var(--color-accent)] opacity-30">
                    /
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bento-card group relative flex flex-col items-center justify-between gap-8 overflow-hidden bg-[#0B0B0F] p-6 opacity-100 transition-all duration-500 hover:bg-[#0E0E14] sm:p-8 md:flex-row lg:col-span-12 xl:p-10">
          <div className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{ background: "radial-gradient(800px circle at var(--mouse-x) var(--mouse-y), rgba(176,132,246,0.1), transparent 40%)" }} />
          <div className="flex-1">
            <h3 className="mb-4 text-sm font-mono uppercase tracking-[0.4em] text-white/40">
              Service Range
            </h3>
            <p className="mb-6 max-w-2xl text-lg leading-relaxed text-white/80 md:text-xl">
              From restaurant logos to product posters, thumbnails, UI screens, web banners, and learning modules.
            </p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { label: "Identity", sub: "Logo & Branding" },
                { label: "Campaigns", sub: "Posters & Creatives" },
                { label: "Social", sub: "Thumbnails & Shorts" },
                { label: "Motion", sub: "Video Editing" },
                { label: "Interface", sub: "UI Screens & WIX" },
                { label: "Learning", sub: "Articulate 360" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="group cursor-default rounded-2xl border border-white/10 bg-[#121218] p-5 transition-colors hover:border-[var(--color-accent)]/40"
                >
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
    </DossierChapter>
  );
}
