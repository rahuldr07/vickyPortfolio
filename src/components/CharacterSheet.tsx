"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
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

gsap.registerPlugin(ScrollTrigger, SplitText);

const stats = [
  { label: "Visual Design", value: 95, icon: Shield },
  { label: "Video Editing", value: 88, icon: Zap },
  { label: "UX / UI", value: 82, icon: Target },
  { label: "Motion Graphics", value: 85, icon: Star },
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
        if (headingRef.current && !reduced) {
          const split = new SplitText(headingRef.current, { type: "chars" });
          gsap.from(split.chars, {
            y: 20,
            opacity: 0,
            stagger: 0.02,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: headingRef.current,
              start: "top 95%",
              once: true,
            },
          });
        }

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

        const handleMouseMove = (event: MouseEvent) => {
          if (!imgWrapperRef.current) return;
          const rect = imgWrapperRef.current.getBoundingClientRect();
          const x = event.clientX - rect.left;
          const y = event.clientY - rect.top;

          if (colorImgRef.current) {
            colorImgRef.current.style.maskImage = `radial-gradient(circle 110px at ${x}px ${y}px, black 0%, transparent 100%)`;
            colorImgRef.current.style.webkitMaskImage = `radial-gradient(circle 110px at ${x}px ${y}px, black 0%, transparent 100%)`;
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

  return (
    <section
      ref={sectionRef}
      id="about"
      aria-labelledby="about-heading"
      className="relative mx-auto max-w-[1400px] scroll-mt-28 bg-transparent px-6 py-20 md:px-12 md:py-24"
    >
      <div className="flex flex-col items-start gap-12 lg:flex-row lg:gap-12">
        <header className="z-20 w-full flex-shrink-0 space-y-4 text-left lg:sticky lg:top-32 lg:w-[280px]">
          <p className="mb-4 font-mono text-[10px] font-bold uppercase tracking-[0.5em] text-[var(--color-accent)]">
            Subject / Profile 01
          </p>
          <h2
            ref={headingRef}
            id="about-heading"
            className="text-4xl font-serif font-black tracking-tight text-white md:text-5xl"
          >
            Character Sheet
          </h2>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-white/72">
            A focused profile of capabilities, process, and creative strengths — built to
            show how ideas move from concept to polished final output.
          </p>
        </header>

        <div className="w-full flex-1">
          <div className="grid grid-cols-1 items-start gap-24 lg:grid-cols-12">
            <div ref={leftRef} className="space-y-12 lg:col-span-5 lg:sticky lg:top-24 lg:self-start">
          <div
            ref={imgWrapperRef}
            className="group relative aspect-[4/5] overflow-hidden rounded-2xl border border-white/5 bg-[#0B0B0F] shadow-2xl"
          >
            <div className="dossier-img absolute -left-[7.5%] -top-[7.5%] h-[115%] w-[115%]">
              <Image
                src="/blackwhite.jpeg"
                alt="Geetha Krishna black and white portrait"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="absolute inset-0 h-full w-full object-cover opacity-55 grayscale"
              />
              <Image
                ref={colorImgRef}
                src="/color.jpeg"
                alt="Geetha Krishna color portrait reveal"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{ maskImage: "none", WebkitMaskImage: "none" }}
              />
            </div>

            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0F] via-[#0B0B0F]/20 to-transparent opacity-90" />

            <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-20 p-10">
              <div className="flex items-end justify-between border-t border-white/10 pt-6">
                <div>
                  <h3 className="text-3xl font-serif font-bold tracking-tight text-white">
                    Geetha Krishna
                  </h3>
                  <p className="mt-3 font-mono text-[9px] font-bold uppercase tracking-[0.4em] text-white/45">
                    Subject ID: GK-2025-V4
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-4 font-mono text-[10px] font-bold uppercase tracking-widest text-[var(--color-accent)]">
              <ChevronRight className="h-3 w-3" aria-hidden="true" /> Origin Summary
            </div>
            <p className="font-serif text-xl leading-relaxed text-white/78">
              A creative engineer merging the precision of
              <span className="text-white"> Instructional Design</span> with
              the soul of cinematic storytelling.
            </p>

            <ul className="space-y-3" aria-label="About highlights">
              {ABOUT_HIGHLIGHTS.map((highlight) => (
                <li
                  key={highlight}
                  className="flex items-start gap-3 text-sm leading-relaxed text-white/72"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" />
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div ref={rightRef} className="space-y-20 lg:col-span-7">
          <div ref={barsRef} className="space-y-12">
            <h4 className="border-b border-white/5 pb-6 font-mono text-[10px] font-bold uppercase tracking-[0.5em] text-white/35">
              Attribute Matrix
            </h4>
            <div className="grid grid-cols-1 gap-x-16 gap-y-12 md:grid-cols-2">
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

          <div className="grid grid-cols-1 gap-12 border-t border-white/5 pt-12 md:grid-cols-2">
            <div>
              <h4 className="mb-8 font-mono text-[10px] font-bold uppercase tracking-[0.4em] text-white/35">
                Inventory
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
                  Communication
                </h4>
                <a
                  href={`mailto:${CONTACT.email}`}
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
                href={`mailto:${CONTACT.email}?subject=${encodeURIComponent("Request full portfolio dossier")}`}
                className="flex w-full items-center justify-center gap-4 rounded-full border border-white/10 py-5 font-mono text-[10px] font-black uppercase tracking-[0.3em] text-white/75 transition-colors hover:border-[var(--color-accent)]/45 hover:text-white"
              >
                Export Dossier <Download className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
          </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
