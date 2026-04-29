"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const roles = [
  "Graphic Designer",
  "Video Editor",
  "Visual Storyteller",
  "Brand Architect",
];

const scrambleChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$#@%&*";

export default function Hero() {
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayRole, setDisplayRole] = useState(roles[0]);

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
  const trailRevealRef = useRef<HTMLDivElement>(null);
  const revealGlowRef = useRef<HTMLDivElement>(null);
  const chipsRef = useRef<HTMLDivElement>(null);
  const previousRoleRef = useRef(roles[0]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % roles.length);
    }, 2600);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const target = roles[roleIndex];

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
    }, 30);

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
    const trail = trailRevealRef.current;
    const glow = revealGlowRef.current;
    if (!wrap || !reveal || !trail || !glow) return;

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
      duration: 0.22,
      ease: "power2.out",
    });
    const trailOpacityTo = gsap.quickTo(trail, "opacity", {
      duration: 0.3,
      ease: "power2.out",
    });
    const glowOpacityTo = gsap.quickTo(glow, "opacity", {
      duration: 0.25,
      ease: "power2.out",
    });

    gsap.to(reveal, {
      "--driftX": "10px",
      "--driftY": "-8px",
      duration: 2.4,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    let raf = 0;
    let pendingX = 0;
    let pendingY = 0;
    let trailX = 0;
    let trailY = 0;

    const flush = () => {
      raf = 0;
      trailX += (pendingX - trailX) * 0.22;
      trailY += (pendingY - trailY) * 0.22;

      reveal.style.setProperty("--mx", `${pendingX}px`);
      reveal.style.setProperty("--my", `${pendingY}px`);

      trail.style.setProperty("--tx", `${trailX}px`);
      trail.style.setProperty("--ty", `${trailY}px`);

      glow.style.setProperty("--mx", `${pendingX}px`);
      glow.style.setProperty("--my", `${pendingY}px`);

      if (Math.abs(pendingX - trailX) > 0.6 || Math.abs(pendingY - trailY) > 0.6) {
        raf = requestAnimationFrame(flush);
      }
    };

    const onMove = (e: MouseEvent) => {
      const rect = wrap.getBoundingClientRect();
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
      const rect = wrap.getBoundingClientRect();
      pendingX = e.clientX - rect.left;
      pendingY = e.clientY - rect.top;
      trailX = pendingX;
      trailY = pendingY;

      reveal.style.setProperty("--mx", `${pendingX}px`);
      reveal.style.setProperty("--my", `${pendingY}px`);
      trail.style.setProperty("--tx", `${trailX}px`);
      trail.style.setProperty("--ty", `${trailY}px`);

      revealOpacityTo(1);
      trailOpacityTo(0.55);
      glowOpacityTo(1);
    };

    const onLeave = () => {
      rotateXTo(0);
      rotateYTo(0);
      revealOpacityTo(0);
      trailOpacityTo(0);
      glowOpacityTo(0);
    };

    wrap.addEventListener("mouseenter", onEnter as EventListener);
    wrap.addEventListener("mousemove", onMove);
    wrap.addEventListener("mouseleave", onLeave);

    return () => {
      wrap.removeEventListener("mouseenter", onEnter as EventListener);
      wrap.removeEventListener("mousemove", onMove);
      wrap.removeEventListener("mouseleave", onLeave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen overflow-hidden bg-[#0B0B0F] pt-28"
      aria-label="Hero intro"
    >
      <div ref={bgZoomRef} className="absolute inset-0 will-change-transform">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(139,92,246,0.30),transparent_38%),radial-gradient(circle_at_80%_20%,rgba(59,130,246,0.14),transparent_36%),radial-gradient(circle_at_50%_80%,rgba(168,85,247,0.12),transparent_42%)]" />
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.18)_1px,transparent_1px)",
            backgroundSize: "44px 44px",
          }}
        />
        <div className="absolute -top-60 left-1/2 h-[980px] w-[980px] -translate-x-1/2 rounded-full border border-white/10" />
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
            <span className="sr-only" aria-live="polite">{roles[roleIndex]}</span>
          </p>

          <p
            ref={bodyRef}
            className="mt-5 max-w-[66ch] text-base leading-relaxed text-white/72 md:text-lg"
          >
            I design modern brand systems and cinematic visuals that look bold,
            feel intentional, and move audiences to act.
          </p>

          <div ref={ctaRef} className="mt-10 flex flex-wrap items-center gap-4">
            <a
              href="#work"
              className="inline-flex min-h-11 items-center rounded-full bg-[var(--color-accent)] px-8 py-3 font-sans text-xs font-extrabold uppercase tracking-[0.22em] text-white transition-all duration-300 hover:brightness-110 hover:shadow-[0_0_30px_rgba(139,92,246,0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0B0F]"
            >
              View Projects
            </a>
            <a
              href="#contact"
              className="inline-flex min-h-11 items-center rounded-full border border-white/25 px-8 py-3 font-sans text-xs font-bold uppercase tracking-[0.22em] text-white/92 transition-all duration-300 hover:border-white/65 hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0B0F]"
            >
              Let&apos;s Work Together
            </a>
          </div>
        </div>

        <div className="lg:col-span-5 lg:justify-self-end">
          <div
            ref={portraitWrapRef}
            className="relative mx-auto aspect-[4/5] w-full max-w-[30rem] overflow-hidden rounded-[2rem] border border-white/15 bg-[#11111A] shadow-[0_25px_100px_rgba(0,0,0,0.7)] lg:mx-0 lg:ml-auto"
          >
            <Image
              src="/blackwhite.jpeg"
              alt="Geetha Krishna portrait black and white"
              fill
              priority
              sizes="(max-width: 1024px) 80vw, 33vw"
              className="object-cover"
            />

            <div
              ref={colorRevealRef}
              className="pointer-events-none absolute inset-0 opacity-0"
              style={{
                WebkitMaskImage:
                  "radial-gradient(150px 122px at calc(var(--mx,50%) + var(--driftX,0px)) calc(var(--my,50%) + var(--driftY,0px)), #000 0%, #000 53%, transparent 76%), radial-gradient(106px 86px at calc(var(--mx,50%) + 46px - var(--driftX,0px)) calc(var(--my,50%) - 28px + var(--driftY,0px)), #000 0%, #000 49%, transparent 74%), radial-gradient(94px 80px at calc(var(--mx,50%) - 40px + var(--driftX,0px)) calc(var(--my,50%) + 34px - var(--driftY,0px)), #000 0%, #000 46%, transparent 73%), radial-gradient(66px 58px at calc(var(--mx,50%) - 72px) calc(var(--my,50%) - 12px), #000 0%, #000 42%, transparent 71%)",
                maskImage:
                  "radial-gradient(150px 122px at calc(var(--mx,50%) + var(--driftX,0px)) calc(var(--my,50%) + var(--driftY,0px)), #000 0%, #000 53%, transparent 76%), radial-gradient(106px 86px at calc(var(--mx,50%) + 46px - var(--driftX,0px)) calc(var(--my,50%) - 28px + var(--driftY,0px)), #000 0%, #000 49%, transparent 74%), radial-gradient(94px 80px at calc(var(--mx,50%) - 40px + var(--driftX,0px)) calc(var(--my,50%) + 34px - var(--driftY,0px)), #000 0%, #000 46%, transparent 73%), radial-gradient(66px 58px at calc(var(--mx,50%) - 72px) calc(var(--my,50%) - 12px), #000 0%, #000 42%, transparent 71%)",
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

            <div
              ref={trailRevealRef}
              className="pointer-events-none absolute inset-0 opacity-0"
              style={{
                mixBlendMode: "screen",
                WebkitMaskImage:
                  "radial-gradient(190px 152px at var(--tx,50%) var(--ty,50%), #000 0%, #000 38%, transparent 82%)",
                maskImage:
                  "radial-gradient(190px 152px at var(--tx,50%) var(--ty,50%), #000 0%, #000 38%, transparent 82%)",
                WebkitMaskRepeat: "no-repeat",
                maskRepeat: "no-repeat",
              }}
            >
              <Image
                src="/color.jpeg"
                alt="Geetha Krishna portrait color trail"
                fill
                sizes="(max-width: 1024px) 80vw, 33vw"
                className="object-cover saturate-110 blur-[1.5px]"
              />
            </div>

            <div
              ref={revealGlowRef}
              className="pointer-events-none absolute inset-0 opacity-0"

              style={{
                background:
                  "radial-gradient(240px 190px at var(--mx,50%) var(--my,50%), rgba(139,92,246,0.34), rgba(139,92,246,0.10) 48%, transparent 74%)",
                mixBlendMode: "screen",
              }}
            />

            <div className="absolute inset-0 opacity-[0.06] mix-blend-soft-light" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22320%22 height=%22320%22 viewBox=%220 0 320 320%22%3E%3Cfilter id=%22n%22 x=%220%22 y=%220%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.95%22 numOctaves=%222%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22320%22 height=%22320%22 filter=%22url(%23n)%22 opacity=%220.62%22/%3E%3C/svg%3E')" }} />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(11,11,15,0.06)_0%,rgba(11,11,15,0.84)_100%)]" />

            <div className="absolute left-7 top-7 rounded-full border border-white/20 bg-black/25 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.22em] text-white/75 backdrop-blur">
              Hover to reveal
            </div>
            <div className="absolute bottom-8 left-8 right-8">
              <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-[var(--color-soft)]">
                Visual Identity Director
              </p>
              <p className="mt-2 text-3xl font-serif font-bold text-white">Geetha Krishna</p>
            </div>
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
