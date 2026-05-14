"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { HERO_PROOF_POINTS, HERO_ROLES } from "@/content/portfolio";

const scrambleChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$#@%&*";

const heroPillars = [
  "Brand Identity Systems",
  "Cinematic Video Editing",
  "UI/UX Storytelling",
] as const;

export default function Hero() {
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayRole, setDisplayRole] = useState<string>(HERO_ROLES[0]);

  const sectionRef = useRef<HTMLElement>(null);
  const bgZoomRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const firstLineRef = useRef<HTMLSpanElement>(null);
  const secondLineRef = useRef<HTMLSpanElement>(null);
  const roleRef = useRef<HTMLParagraphElement>(null);
  const bodyRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const portraitWrapRef = useRef<HTMLDivElement>(null);
  const colorRevealRef = useRef<HTMLDivElement>(null);
  const chipsRef = useRef<HTMLDivElement>(null);
  const previousRoleRef = useRef<string>(HERO_ROLES[0]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % HERO_ROLES.length);
    }, 4500); // Increased interval to allow text to stay longer

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const target = HERO_ROLES[roleIndex];

    if (reduced) {
      previousRoleRef.current = target;
      const id = window.setTimeout(() => setDisplayRole(target), 0);
      return () => window.clearTimeout(id);
    }

    let frame = 0;
    const maxLen = Math.max(target.length, previousRoleRef.current.length);

    const scramble = window.setInterval(() => {
      const revealCount = Math.floor(frame / 2);
      const next = target
        .padEnd(maxLen, " ")
        .split("")
        .map((ch, i) => {
          if (ch === " ") return " ";
          if (i < revealCount) return ch;
          return scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
        })
        .join("")
        .trimEnd();

      setDisplayRole(next);
      frame += 1;

      if (revealCount >= target.length) {
        previousRoleRef.current = target;
        setDisplayRole(target);
        window.clearInterval(scramble);
      }
    }, 60); // Slowed down from 30ms to 60ms

    return () => window.clearInterval(scramble);
  }, [roleIndex]);

  useGSAP(
    () => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      if (!reduced) {
        tl.fromTo(
          bgZoomRef.current,
          { scale: 1, opacity: 0.86 },
          { scale: 1.18, opacity: 1, duration: 2.6 }
        );
      }

      tl.from(
        [badgeRef.current, firstLineRef.current, secondLineRef.current],
        {
          y: 34,
          opacity: 0,
          duration: 0.8,
          stagger: 0.1,
        },
        reduced ? 0 : "-=2.1"
      )
        .from(roleRef.current, { y: 14, opacity: 0, duration: 0.45 }, "-=0.35")
        .from(bodyRef.current, { y: 18, opacity: 0, duration: 0.6 }, "-=0.25")
        .from(ctaRef.current, { y: 18, opacity: 0, duration: 0.6 }, "-=0.25")
        .from(
          portraitWrapRef.current,
          { x: 38, opacity: 0, scale: 0.96, duration: 0.9 },
          "-=0.85"
        )
        .from(
          chipsRef.current?.querySelectorAll(".chip") ?? [],
          { y: 14, opacity: 0, stagger: 0.06, duration: 0.45 },
          "-=0.45"
        );
    },
    { scope: sectionRef }
  );

  useGSAP(() => {
    if (!roleRef.current) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    gsap.fromTo(
      roleRef.current,
      { y: 8, opacity: 0.3 },
      { y: 0, opacity: 1, duration: 0.35, ease: "power2.out", delay: 0.6 }
    );
  }, { scope: sectionRef });

  useEffect(() => {
    const wrap = portraitWrapRef.current;
    const reveal = colorRevealRef.current;
    if (!wrap || !reveal) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;

    if (reduced || coarse) return;

    const rotateXTo = gsap.quickTo(wrap, "rotateX", {
      duration: 0.32,
      ease: "power3.out",
    });
    const rotateYTo = gsap.quickTo(wrap, "rotateY", {
      duration: 0.32,
      ease: "power3.out",
    });
    const revealOpacityTo = gsap.quickTo(reveal, "opacity", {
      duration: 0.3,
      ease: "power2.out",
    });

    gsap.set(reveal, { opacity: 0.55 });

    let rect = wrap.getBoundingClientRect();
    let centerX = rect.width / 2;
    let centerY = rect.height / 2;
    let radius = Math.min(rect.width, rect.height) * 0.24;

    const updateRect = () => {
      rect = wrap.getBoundingClientRect();
      centerX = rect.width / 2;
      centerY = rect.height / 2;
      radius = Math.min(rect.width, rect.height) * 0.24;
    };

    const orbit = { angle: 0 };
    const updateOrbit = () => {
      const x = centerX + Math.cos(orbit.angle) * radius;
      const y = centerY + Math.sin(orbit.angle) * radius * 0.9;
      reveal.style.setProperty("--mx", `${x}px`);
      reveal.style.setProperty("--my", `${y}px`);
    };

    updateOrbit();

    const orbitTween = gsap.to(orbit, {
      angle: Math.PI * 2,
      duration: 12,
      repeat: -1,
      ease: "none",
      onUpdate: updateOrbit,
    });

    let raf = 0;
    let pendingX = 0;
    let pendingY = 0;

    const flush = () => {
      raf = 0;
      reveal.style.setProperty("--mx", `${pendingX}px`);
      reveal.style.setProperty("--my", `${pendingY}px`);
    };

    const onMove = (e: MouseEvent) => {
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const px = x / rect.width - 0.5;
      const py = y / rect.height - 0.5;

      rotateYTo(px * 7);
      rotateXTo(py * -7);

      pendingX = x;
      pendingY = y;

      if (!raf) raf = requestAnimationFrame(flush);
    };

    const onEnter = (e: MouseEvent) => {
      updateRect();
      orbitTween.pause();

      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      pendingX = x;
      pendingY = y;

      reveal.style.setProperty("--mx", `${pendingX}px`);
      reveal.style.setProperty("--my", `${pendingY}px`);
      revealOpacityTo(1);
    };

    const onLeave = () => {
      rotateXTo(0);
      rotateYTo(0);
      revealOpacityTo(0.55);
      orbitTween.play();
    };

    window.addEventListener("resize", updateRect);
    wrap.addEventListener("mouseenter", onEnter as EventListener);
    wrap.addEventListener("mousemove", onMove);
    wrap.addEventListener("mouseleave", onLeave);

    return () => {
      window.removeEventListener("resize", updateRect);
      wrap.removeEventListener("mouseenter", onEnter as EventListener);
      wrap.removeEventListener("mousemove", onMove);
      wrap.removeEventListener("mouseleave", onLeave);
      orbitTween.kill();
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen overflow-hidden bg-transparent pt-28"
      aria-label="Hero intro"
    >
      <div
        ref={bgZoomRef}
        className="pointer-events-none absolute inset-0 will-change-transform"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(139,92,246,0.04),transparent_65%)]" />
      </div>

      <div className="relative z-10 mx-auto grid min-h-[calc(100vh-7rem)] max-w-7xl grid-cols-1 items-center gap-10 px-6 pb-16 md:gap-12 md:px-12 lg:grid-cols-12 lg:gap-6">
        <div className="lg:col-span-7">
          <div
            ref={badgeRef}
            className="mb-8 inline-flex min-h-11 items-center rounded-full border border-white/10 bg-white/[0.03] px-5 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-white/70"
          >
            Portfolio 2026 · Open to Premium Collaborations
          </div>

          <h1
            className="text-6xl font-serif font-black uppercase leading-[0.86] tracking-tight text-white sm:text-7xl md:text-8xl lg:text-[108px]"
            aria-label="Geetha Krishna"
          >
            <span ref={firstLineRef} className="block">
              Geetha
            </span>
            <span
              ref={secondLineRef}
              className="block text-[var(--color-accent)]"
            >
              Krishna
            </span>
          </h1>

          <p
            ref={roleRef}
            className="mt-6 min-h-11 font-mono text-base font-semibold uppercase tracking-[0.24em] text-white/90 md:text-xl"
          >
            <span className="mr-3 text-[var(--color-accent)]/85">[ROLE]</span>
            <span aria-hidden="true">{displayRole}</span>
            <span
              aria-hidden="true"
              className="ml-1 inline-block text-white/55"
              style={{ animation: "caretFast 0.45s steps(1, end) infinite" }}
            >
              ▌
            </span>
            <span className="sr-only" aria-live="polite">{HERO_ROLES[roleIndex]}</span>
          </p>

          <p
            ref={bodyRef}
            className="mt-5 max-w-[66ch] text-base leading-relaxed text-white/80 md:text-lg"
          >
            I help brands and founders turn ideas into high-impact visuals — from
            identity systems to cinematic edits and digital experiences that
            audiences remember.
          </p>

          <div ref={ctaRef} className="mt-10 flex flex-wrap items-center gap-4">
            <a
              href="#work"
              className="group relative inline-flex min-h-11 items-center overflow-hidden rounded-full bg-[var(--color-accent)] px-8 py-3 font-sans text-xs font-extrabold uppercase tracking-[0.22em] text-white transition-all duration-300 hover:shadow-[0_0_30px_rgba(139,92,246,0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0B0F]"
            >
              <span className="relative z-10 transition-colors duration-300 group-hover:text-[#0B0B0F]">View Projects</span>
              <div className="absolute inset-0 translate-y-full bg-white transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0" />
            </a>
            <a
              href="#contact"
              className="group relative inline-flex min-h-11 items-center overflow-hidden rounded-full border border-white/25 px-8 py-3 font-sans text-xs font-bold uppercase tracking-[0.22em] text-white/92 transition-all duration-300 hover:border-white/65 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0B0F]"
            >
              <span className="relative z-10 transition-colors duration-300 group-hover:text-[#0B0B0F]">Let&apos;s Work Together</span>
              <div className="absolute inset-0 translate-y-full bg-white transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0" />
            </a>
          </div>

          <ul className="mt-8 flex flex-wrap gap-3" aria-label="Core services">
            {heroPillars.map((pillar) => (
              <li
                key={pillar}
                className="inline-flex min-h-10 items-center rounded-full border border-white/15 bg-white/5 px-4 py-2 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-white/85"
              >
                {pillar}
              </li>
            ))}
          </ul>

          <dl className="mt-8 grid gap-3 sm:grid-cols-3" aria-label="Portfolio proof points">
            {HERO_PROOF_POINTS.map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4"
              >
                <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/65">
                  {item.label}
                </dt>
                <dd className="mt-2 font-serif text-2xl font-black text-white">
                  {item.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="lg:col-span-5 lg:justify-self-end">
          <div
            ref={portraitWrapRef}
            className="relative mx-auto aspect-[4/5] w-full max-w-[34rem] overflow-hidden rounded-[2.25rem] border border-white/15 bg-[#11111A] shadow-[0_30px_120px_rgba(0,0,0,0.7)] lg:mx-0 lg:ml-auto"
          >
            <Image
              src="/blackwhite.jpeg"
              alt="Geetha Krishna portrait black and white"
              fill
              priority
              sizes="(max-width: 1024px) 80vw, 33vw"
              className="object-cover opacity-60 grayscale"
            />

            <div
              ref={colorRevealRef}
              className="pointer-events-none absolute inset-0 opacity-0"
              style={{
                WebkitMaskImage:
                  "radial-gradient(circle 180px at var(--mx,50%) var(--my,50%), #000 0%, transparent 100%)",
                maskImage:
                  "radial-gradient(circle 180px at var(--mx,50%) var(--my,50%), #000 0%, transparent 100%)",
                WebkitMaskRepeat: "no-repeat",
                maskRepeat: "no-repeat",
              }}
            >
              <Image
                src="/color.jpeg"
                alt="Geetha Krishna portrait color reveal"
                fill
                sizes="(max-width: 1024px) 80vw, 33vw"
                className="object-cover saturate-110"
              />
            </div>


            <div className="absolute inset-0 bg-[linear-gradient(to-t,rgba(11,11,15,0.90)_0%,rgba(11,11,15,0.22)_48%,transparent_100%)]" />

          </div>

          <div ref={chipsRef} className="mt-6 grid grid-cols-2 gap-3">
            {["Brand Systems", "Cinematic Editing", "UI Storytelling", "Motion + Design"].map(
              (item) => (
                <div
                  key={item}
                  className="chip min-h-11 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-center font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-white/70"
                >
                  {item}
                </div>
              )
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes caretFast {
          0%, 49% { opacity: 1; }
          50%, 100% { opacity: 0.15; }
        }
      `}</style>
    </section>
  );
}
