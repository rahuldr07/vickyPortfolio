"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import {
  Mail,
  Download,
  Shield,
  Zap,
  Target,
  Star,
  ChevronRight,
} from "lucide-react";
import { ABOUT_HIGHLIGHTS, CONTACT, SKILLS } from "@/content/portfolio";
import DossierChapter from "@/components/DossierChapter";

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { label: "Logo & Brand Systems", value: 94, icon: Shield },
  { label: "Print & Campaign Design", value: 91, icon: Target },
  { label: "Video Editing", value: 88, icon: Zap },
  { label: "E-Learning Visuals", value: 82, icon: Star },
] as const;

export default function CharacterSheet() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const barsRef = useRef<HTMLDivElement>(null);
  const imgWrapperRef = useRef<HTMLDivElement>(null);
  const colorImgRef = useRef<HTMLImageElement>(null);

  useGSAP(
    () => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      const ctx = gsap.context(() => {
        gsap.from([leftRef.current, rightRef.current], {
          y: reduced ? 0 : 20,
          opacity: 0,
          duration: reduced ? 0.2 : 1,
          stagger: reduced ? 0 : 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: leftRef.current,
            start: "top 85%",
            once: true,
          },
        });

        const fills = barsRef.current?.querySelectorAll(".stat-fill");
        fills?.forEach((fill, i) => {
          gsap.to(fill, {
            width: `${stats[i].value}%`,
            duration: reduced ? 0.3 : 1.8,
            delay: reduced ? 0 : 0.4 + i * 0.1,
            ease: "power4.out",
            scrollTrigger: {
              trigger: barsRef.current,
              start: "top 85%",
              once: true,
            },
          });
        });

        if (reduced) return;

        const maskX = gsap.quickTo(colorImgRef.current, "--mask-x", { duration: 0.4, ease: "power3.out" });
        const maskY = gsap.quickTo(colorImgRef.current, "--mask-y", { duration: 0.4, ease: "power3.out" });

        const handleMouseMove = (event: MouseEvent) => {
          if (!imgWrapperRef.current) return;
          const rect = imgWrapperRef.current.getBoundingClientRect();
          const x = event.clientX - rect.left;
          const y = event.clientY - rect.top;

          if (colorImgRef.current) {
            maskX(x);
            maskY(y);
          }

          const px = x / rect.width - 0.5;
          const py = y / rect.height - 0.5;

          const frame = imgWrapperRef.current.querySelector(".dossier-img");
          if (frame) {
            gsap.to(frame, {
              x: px * 20,
              y: py * 20,
              duration: 1,
              ease: "power2.out",
            });
          }
        };

        imgWrapperRef.current?.addEventListener("mousemove", handleMouseMove);
        return () =>
          imgWrapperRef.current?.removeEventListener("mousemove", handleMouseMove);
      }, sectionRef);

      return () => ctx.revert();
    },
    { scope: sectionRef }
  );

  const rail = (
    <>
      <p className="dossier-kicker mb-4">
        Creative Profile
      </p>
      <h2
        ref={headingRef}
        id="about-heading"
        className="text-4xl font-serif font-black tracking-tight text-white md:text-5xl"
      >
        Profile
      </h2>
      <p className="mt-4 max-w-md text-[15px] leading-relaxed text-white/72">
        A graphic designer building logos, menus, banners, reels, UI screens, and learning content with clear brand communication.
      </p>
    </>
  );

  return (
    <DossierChapter
      ref={sectionRef}
      id="about"
      labelledBy="about-heading"
      rail={rail}
      contentClassName="hide-scrollbar"
    >
          <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[minmax(220px,0.55fr)_minmax(0,1fr)] xl:gap-10">
            <div ref={leftRef} className="space-y-7 lg:self-start">
          <div
            ref={imgWrapperRef}
            className="dossier-panel group relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden rounded-2xl shadow-2xl lg:max-w-none"
          >
            <div className="dossier-img absolute -left-[7.5%] -top-[7.5%] h-[115%] w-[115%]">
              <Image
                src="/blackwhite.jpeg"
                alt="Geetha Krishna black and white portrait"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="absolute inset-0 h-full w-full object-cover opacity-[0.55] grayscale"
              />
              <Image
                ref={colorImgRef}
                src="/color.jpeg"
                alt="Geetha Krishna color portrait reveal"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{ 
                  maskImage: "radial-gradient(circle 140px at var(--mask-x, 50%) var(--mask-y, 50%), black 0%, transparent 100%)", 
                  WebkitMaskImage: "radial-gradient(circle 140px at var(--mask-x, 50%) var(--mask-y, 50%), black 0%, transparent 100%)" 
                }}
              />
            </div>

            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0F] via-[#0B0B0F]/20 to-transparent opacity-90" />

            <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-20 p-7">
              <div className="flex items-end justify-between border-t border-white/10 pt-5">
                <div>
                  <h3 className="text-3xl font-serif font-bold tracking-tight text-white">
                    Geetha Krishna
                  </h3>
                  <p className="mt-3 font-mono text-[9px] font-bold uppercase tracking-[0.4em] text-white/45">
                    Graphic Designer
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <div className="flex items-center gap-4 font-mono text-[10px] font-bold uppercase tracking-widest text-[var(--color-accent)]">
              <ChevronRight className="h-3 w-3" aria-hidden="true" /> Creative Operating System
            </div>
            <p className="font-serif text-xl leading-relaxed text-white/78 lg:text-2xl">
              Four years of visual content practice across
              <span className="text-white"> brand identity, print layouts, motion edits, UI screens,</span>
              and e-learning design.
            </p>

            <ul className="space-y-3" aria-label="About highlights">
              {ABOUT_HIGHLIGHTS.map((highlight) => (
                <li
                  key={highlight}
                  className="flex items-start gap-3 text-[15px] leading-relaxed text-white/72"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" />
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div ref={rightRef} className="space-y-10">
          <div ref={barsRef} className="space-y-7">
            <h4 className="border-b border-white/5 pb-5 font-mono text-[10px] font-bold uppercase tracking-[0.5em] text-white/35">
              Resume-Backed Matrix
            </h4>
            <div className="grid grid-cols-1 gap-x-12 gap-y-7 md:grid-cols-2">
              {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div key={stat.label} className="space-y-4">
                    <div className="flex items-end justify-between">
                      <span className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-white/60">
                        <Icon className="h-3.5 w-3.5 text-[var(--color-soft)]" />
                        {stat.label}
                      </span>
                      <span className="font-mono text-xs font-bold text-white">
                        {stat.value}%
                      </span>
                    </div>
                    <div className="h-[1px] w-full overflow-hidden rounded-full bg-white/5">
                      <div className="stat-fill h-full w-0 rounded-full bg-[var(--color-accent)] shadow-[0_0_10px_var(--color-accent)]" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 border-t border-white/5 pt-8 md:grid-cols-2">
            <div>
              <h4 className="mb-8 font-mono text-[10px] font-bold uppercase tracking-[0.4em] text-white/35">
                Working Stack
              </h4>
              <div className="flex flex-wrap gap-x-6 gap-y-4">
                {SKILLS.map((skill) => (
                  <span
                    key={skill}
                    className="cursor-default font-mono text-xs text-white/60 transition-colors hover:text-white"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-col items-start justify-between gap-12">
              <div className="space-y-6">
                <h4 className="font-mono text-[10px] font-bold uppercase tracking-[0.4em] text-white/35">
                  Brief Channel
                </h4>
                <p className="max-w-sm text-[15px] leading-relaxed text-white/64">
                  Best fit: logo systems, product posters, menu cards, thumbnails, reels, web banners, UI screens, and interactive learning material.
                </p>
                <a
                  href="#contact"
                  className="group flex min-h-11 items-center gap-4 text-white transition-colors hover:text-[var(--color-accent)]"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 transition-all group-hover:border-[var(--color-accent)]/30">
                    <Mail className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <span className="font-mono text-[10px] uppercase tracking-widest">
                    Email Link
                  </span>
                </a>
              </div>

              <a
                href="#contact"
                className="flex w-full items-center justify-center gap-4 rounded-full border border-white/10 py-5 font-mono text-[10px] font-black uppercase tracking-[0.3em] text-white/75 transition-colors hover:border-[var(--color-accent)]/45 hover:text-white"
              >
                Request Full Portfolio <Download className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
          </div>
            </div>
          </div>
    </DossierChapter>
  );
}
