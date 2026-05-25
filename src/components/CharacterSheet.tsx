"use client";

import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { ArrowUpRight, ChevronRight, FileText, X } from "lucide-react";
import { ABOUT_HIGHLIGHTS } from "@/content/portfolio";
import DossierChapter from "@/components/DossierChapter";

gsap.registerPlugin(ScrollTrigger);

const RESUME_PDF_URL = "/resume/GeethaKrishna_5_Graphic%20Designer.pdf";
const RESUME_PREVIEW_SRC = "/resume/geetha-krishna-resume-preview.webp";

export default function CharacterSheet() {
  const [resumeOpen, setResumeOpen] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
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

        const revealItems = rightRef.current?.querySelectorAll(".profile-reveal");
        if (revealItems?.length) {
          gsap.from(revealItems, {
            y: reduced ? 0 : 18,
            opacity: 0,
            duration: reduced ? 0.2 : 0.7,
            stagger: reduced ? 0 : 0.08,
            ease: "power3.out",
            scrollTrigger: {
              trigger: rightRef.current,
              start: "top 85%",
              once: true,
            },
          });
        }

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

  useEffect(() => {
    if (!resumeOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setResumeOpen(false);
    };

    window.addEventListener("keydown", onEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onEscape);
    };
  }, [resumeOpen]);

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
      viewportChapter
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

          <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-[#0d0d13] p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-accent)]">
                Resume dossier
              </p>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/64">
                Full role history, tools, education, and project background.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setResumeOpen(true)}
              className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-full border border-white/12 px-5 py-2 font-mono text-[10px] font-extrabold uppercase tracking-[0.16em] text-white/78 transition-colors hover:border-[var(--color-accent)]/50 hover:text-white"
            >
              <FileText className="mr-2 h-4 w-4" aria-hidden="true" />
              View Resume
            </button>
          </div>

        </div>

        <div ref={rightRef} className="space-y-7 lg:pt-4">
          <div className="profile-reveal flex items-center gap-4 font-mono text-[10px] font-bold uppercase tracking-widest text-[var(--color-accent)]">
            <ChevronRight className="h-3 w-3" aria-hidden="true" /> Creative Operating System
          </div>

          <div className="profile-reveal space-y-5">
            <p className="max-w-4xl font-serif text-3xl font-black leading-[1.08] tracking-tight text-white md:text-5xl">
              Visual designer focused on clean brand communication across print,
              motion, and digital screens.
            </p>
            <p className="max-w-3xl text-[17px] leading-relaxed text-white/72">
              5+ years of visual content practice across
              <span className="text-white"> brand identity, print layouts, motion edits, UI screens,</span>
              and e-learning design. I shape loose briefs into usable, client-ready
              design assets with clear hierarchy and consistent production quality.
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            {[
              ["01", "Brand Identity", "Logo systems, marks, and scalable visual language."],
              ["02", "Print & Campaigns", "Menus, posters, banners, thumbnails, and launch assets."],
              ["03", "Motion & Learning", "Video edits, reels, UI screens, and e-learning visuals."],
            ].map(([index, title, description]) => (
              <div
                key={title}
                className="profile-reveal rounded-2xl border border-white/10 bg-[#0d0d13] p-5"
              >
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-accent)]">
                  {index}
                </p>
                <h3 className="mt-4 font-serif text-xl font-black text-white">
                  {title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-white/62">
                  {description}
                </p>
              </div>
            ))}
          </div>

          <ul className="profile-reveal grid gap-3 border-t border-white/10 pt-6 md:grid-cols-3" aria-label="About highlights">
            {ABOUT_HIGHLIGHTS.map((highlight) => (
              <li
                key={highlight}
                className="flex items-start gap-3 text-[15px] leading-relaxed text-white/70"
              >
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-accent)]" />
                <span>{highlight}</span>
              </li>
            ))}
          </ul>

            </div>
          </div>

      {resumeOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/82 px-4 py-8"
          role="dialog"
          aria-modal="true"
          aria-label="Geetha Krishna resume"
          onClick={() => setResumeOpen(false)}
        >
          <div
            data-native-scroll="true"
            className="relative flex h-[82svh] w-full max-w-5xl flex-col overflow-hidden rounded-[1.25rem] border border-white/12 bg-[#0b0b10] shadow-[0_36px_100px_rgba(0,0,0,0.62)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-4 border-b border-white/10 px-4 py-3 sm:px-5">
              <div className="min-w-0">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-accent)]">
                  Resume Dossier
                </p>
                <h3 className="mt-1 truncate font-serif text-xl font-black text-white">
                  Geetha Krishna
                </h3>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <a
                  href={RESUME_PDF_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-10 items-center rounded-full border border-white/12 px-4 py-2 font-mono text-[10px] font-extrabold uppercase tracking-[0.14em] text-white/72 transition-colors hover:border-[var(--color-accent)]/50 hover:text-white"
                >
                  Open PDF
                  <ArrowUpRight className="ml-2 h-3.5 w-3.5" aria-hidden="true" />
                </a>
                <button
                  type="button"
                  onClick={() => setResumeOpen(false)}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/[0.56] text-white transition-colors hover:border-white/40"
                  aria-label="Close resume"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto bg-[#15151c] px-4 py-5 sm:px-6">
              <div className="mx-auto w-full max-w-3xl overflow-hidden rounded-xl bg-white shadow-[0_24px_80px_rgba(0,0,0,0.45)]">
                <Image
                  src={RESUME_PREVIEW_SRC}
                  alt="Geetha Krishna resume preview"
                  width={1311}
                  height={1853}
                  className="h-auto w-full"
                  unoptimized
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </DossierChapter>
  );
}
