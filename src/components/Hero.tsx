"use client";

import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const roles = [
  "Graphic Designer",
  "Video Editor",
  "Visual Storyteller",
  "Brand Architect",
];

export default function Hero() {
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);

  const sectionRef = useRef<HTMLElement>(null);
  const zoomLayerRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const roleRef = useRef<HTMLParagraphElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentRoleIndex((prev) => (prev + 1) % roles.length);
    }, 2600);

    return () => clearInterval(interval);
  }, []);

  useGSAP(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    if (!reduceMotion) {
      tl.fromTo(
        zoomLayerRef.current,
        { scale: 1, opacity: 0.85 },
        { scale: 1.2, opacity: 1, duration: 3.2 }
      );
    }

    tl.from(
      [badgeRef.current, nameRef.current, roleRef.current, descriptionRef.current, ctaRef.current],
      {
        y: 24,
        opacity: 0,
        duration: 0.9,
        stagger: 0.12,
      },
      reduceMotion ? 0 : "-=2.8"
    );
  }, { scope: sectionRef });

  useEffect(() => {
    if (!roleRef.current) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion) return;

    gsap.fromTo(
      roleRef.current,
      { y: 10, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.45, ease: "power2.out" }
    );
  }, [currentRoleIndex]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen overflow-hidden bg-[#0B0B0F]"
      aria-label="Intro section"
    >
      <div ref={zoomLayerRef} className="absolute inset-0 will-change-transform">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(139,92,246,0.22)_0%,rgba(11,11,15,0)_55%)]" />
        <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.15)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.15)_1px,transparent_1px)", backgroundSize: "42px 42px" }} />
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[900px] h-[900px] rounded-full border border-white/10" />
        <p className="absolute inset-0 flex items-center justify-center font-serif text-[22vw] font-black text-white/[0.03] tracking-tight select-none">
          GK
        </p>
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center px-6 pb-16 pt-36 text-center md:px-12">
        <div
          ref={badgeRef}
          className="mb-8 inline-flex min-h-11 items-center gap-3 rounded-full border border-white/10 bg-white/[0.03] px-5 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.28em] text-white/70"
        >
          Portfolio 2026 · Available for Projects
        </div>

        <h1
          ref={nameRef}
          className="text-6xl font-serif font-black uppercase leading-[0.88] tracking-tight text-white sm:text-7xl md:text-8xl lg:text-[110px]"
        >
          Geetha
          <br />
          <span className="text-[var(--color-accent)]">Krishna</span>
        </h1>

        <p
          ref={roleRef}
          className="mt-7 min-h-11 text-lg font-semibold uppercase tracking-[0.24em] text-white/85 md:text-2xl"
          aria-live="polite"
        >
          {roles[currentRoleIndex]}
        </p>

        <p
          ref={descriptionRef}
          className="mt-6 max-w-[68ch] text-base leading-relaxed text-white/70 md:text-lg"
        >
          I craft striking brand identities and cinematic visual narratives that help
          ideas look premium, feel modern, and perform in the real world.
        </p>

        <div ref={ctaRef} className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <a
            href="#work"
            className="inline-flex min-h-11 items-center rounded-full bg-[var(--color-accent)] px-8 py-3 font-sans text-xs font-extrabold uppercase tracking-[0.22em] text-white transition-all duration-300 hover:brightness-110 hover:shadow-[0_0_30px_rgba(139,92,246,0.45)]"
          >
            View Projects
          </a>
          <a
            href="#contact"
            className="inline-flex min-h-11 items-center rounded-full border border-white/25 px-8 py-3 font-sans text-xs font-bold uppercase tracking-[0.22em] text-white/90 transition-all duration-300 hover:border-white/60 hover:bg-white/5"
          >
            Let&apos;s Work Together
          </a>
        </div>
      </div>
    </section>
  );
}
