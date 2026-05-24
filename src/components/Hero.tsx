"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { HERO_PROOF_POINTS, HERO_ROLES } from "@/content/portfolio";

const scrambleChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/#%&";

const heroPillars = [
  "Brand Systems",
  "Cinematic Editing",
  "Digital Experience",
] as const;

export default function Hero() {
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayRole, setDisplayRole] = useState<string>(HERO_ROLES[0]);

  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const roleRef = useRef<HTMLParagraphElement>(null);
  const bodyRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const proofRef = useRef<HTMLDListElement>(null);
  const portraitWrapRef = useRef<HTMLDivElement>(null);
  const portraitTiltRef = useRef<HTMLDivElement>(null);
  const colorRevealRef = useRef<HTMLDivElement>(null);
  const previousRoleRef = useRef<string>(HERO_ROLES[0]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % HERO_ROLES.length);
    }, 5200);

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
    }, 54);

    return () => window.clearInterval(scramble);
  }, [roleIndex]);

  useGSAP(
    () => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.from(stageRef.current, {
        opacity: 0,
        y: reduced ? 0 : 24,
        duration: reduced ? 0.2 : 0.9,
      })
        .from(
          [badgeRef.current, titleRef.current, roleRef.current, bodyRef.current],
          {
            y: reduced ? 0 : 22,
            opacity: 0,
            duration: reduced ? 0.2 : 0.8,
            stagger: reduced ? 0 : 0.12,
            ease: "power3.out"
          },
          "-=0.4"
        )
        .from(ctaRef.current, { y: reduced ? 0 : 16, opacity: 0, duration: 0.52 }, "-=0.22")
        .from(
          proofRef.current?.querySelectorAll(".proof-card") ?? [],
          { y: reduced ? 0 : 14, opacity: 0, stagger: reduced ? 0 : 0.06, duration: 0.48 },
          "-=0.25"
        )
        .from(
          portraitWrapRef.current,
          { x: reduced ? 0 : 34, opacity: 0, scale: reduced ? 1 : 0.97, duration: 0.9 },
          "-=0.85"
        );
    },
    { scope: sectionRef }
  );

  useEffect(() => {
    const wrap = portraitWrapRef.current;
    const tilt = portraitTiltRef.current;
    const reveal = colorRevealRef.current;
    if (!wrap || !tilt || !reveal) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;

    if (reduced || coarse) {
      reveal.style.opacity = "0.38";
      return;
    }

    const tiltState = { rotateX: 0, rotateY: 0 };
    const applyTilt = () => {
      tilt.style.transform = `perspective(900px) rotateX(${tiltState.rotateX.toFixed(
        3
      )}deg) rotateY(${tiltState.rotateY.toFixed(3)}deg)`;
    };

    applyTilt();

    const rotateXTo = gsap.quickTo(tiltState, "rotateX", {
      duration: 0.32,
      ease: "power3.out",
      onUpdate: applyTilt,
    });
    const rotateYTo = gsap.quickTo(tiltState, "rotateY", {
      duration: 0.32,
      ease: "power3.out",
      onUpdate: applyTilt,
    });
    const revealOpacityTo = gsap.quickTo(reveal, "opacity", {
      duration: 0.3,
      ease: "power2.out",
    });

    gsap.set(reveal, { opacity: 0.52 });

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

    const onMove = (event: MouseEvent) => {
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const px = x / rect.width - 0.5;
      const py = y / rect.height - 0.5;

      rotateYTo(px * 6);
      rotateXTo(py * -6);

      pendingX = x;
      pendingY = y;

      if (!raf) raf = requestAnimationFrame(flush);
    };

    const onEnter = (event: MouseEvent) => {
      updateRect();
      orbitTween.pause();

      pendingX = event.clientX - rect.left;
      pendingY = event.clientY - rect.top;

      reveal.style.setProperty("--mx", `${pendingX}px`);
      reveal.style.setProperty("--my", `${pendingY}px`);
      revealOpacityTo(1);
    };

    const onLeave = () => {
      rotateXTo(0);
      rotateYTo(0);
      revealOpacityTo(0.52);
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
      rotateXTo.tween.kill();
      rotateYTo.tween.kill();
      revealOpacityTo.tween.kill();
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen overflow-hidden bg-transparent px-6 pb-10 pt-28 md:px-12"
      aria-label="Hero intro"
    >
      <div
        ref={stageRef}
        className="relative z-10 mx-auto grid min-h-[calc(100vh-8rem)] w-full max-w-[calc(100vw_-_3rem)] grid-cols-1 items-center gap-12 overflow-hidden lg:max-w-7xl lg:grid-cols-12"
      >
        <div className="hero-copy-lock w-full min-w-0 max-w-[calc(100vw_-_3rem)] lg:col-span-7 lg:max-w-full">
          <div
            ref={badgeRef}
            className="dossier-panel mb-7 inline-flex min-h-11 max-w-full items-center rounded-full px-5 py-2 font-mono text-[9px] font-extrabold uppercase tracking-[0.24em] text-white/72 sm:text-[10px] sm:tracking-[0.32em]"
          >
            Premium visual systems
          </div>

          <h1
            ref={titleRef}
            className="max-w-full font-serif text-[3.2rem] font-black uppercase leading-[0.8] tracking-normal text-white min-[430px]:text-[3.7rem] sm:text-[4.8rem] md:text-[6rem] lg:text-[7.2rem] xl:text-[8.4rem]"
            aria-label="Geetha Krishna"
          >
            <span className="block">Geetha</span>
            <span className="block text-[var(--color-accent)]">Krishna</span>
          </h1>

          <p
            ref={roleRef}
            className="mt-7 min-h-11 font-mono text-sm font-extrabold uppercase tracking-[0.22em] text-white/92 md:text-lg"
          >
            <span className="mr-3 text-[var(--color-accent)]">[SIGNAL]</span>
            <span aria-hidden="true">{displayRole}</span>
            <span aria-hidden="true" className="ml-1 inline-block text-white/45 motion-safe:animate-pulse">
              |
            </span>
            <span className="sr-only" aria-live="polite">
              {HERO_ROLES[roleIndex]}
            </span>
          </p>

          <p
            ref={bodyRef}
            className="mt-5 max-w-full text-base leading-relaxed text-white/78 sm:max-w-[68ch] md:text-lg"
          >
            I translate brand ambition into premium visual systems—from identity and motion to campaign assets—delivering clarity and atmosphere.
          </p>

          <div ref={ctaRef} className="mt-10 flex flex-col items-stretch gap-4 sm:flex-row sm:flex-wrap sm:items-center">
            <a
              href="#work"
              className="group scan-sweep relative inline-flex min-h-12 w-full max-w-full items-center justify-center overflow-hidden rounded-full bg-[var(--color-accent)] px-8 py-3 font-sans text-xs font-extrabold uppercase tracking-[0.18em] text-[#050508] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_12px_34px_rgba(176,132,246,0.35)] sm:w-auto sm:tracking-[0.22em]"
            >
              View Works
              <ArrowUpRight className="ml-2 h-4 w-4 transition-transform duration-500 group-hover:rotate-45" />
            </a>
            <a
              href="#contact"
              className="group inline-flex min-h-12 w-full max-w-full items-center justify-center rounded-full border border-white/20 px-8 py-3 font-sans text-xs font-bold uppercase tracking-[0.18em] text-white/90 transition-all duration-500 hover:-translate-y-1 hover:border-white/55 hover:bg-white/[0.08] sm:w-auto sm:tracking-[0.22em]"
            >
              Start a Brief
            </a>
          </div>

          <ul className="mt-8 flex flex-wrap gap-3" aria-label="Core services">
            {heroPillars.map((pillar) => (
              <li
                key={pillar}
                className="dossier-panel inline-flex min-h-10 items-center rounded-full px-4 py-2 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-white/76"
              >
                {pillar}
              </li>
            ))}
          </ul>

          <dl ref={proofRef} className="mt-8 grid gap-3 sm:grid-cols-3" aria-label="Portfolio proof points">
            {HERO_PROOF_POINTS.map((item) => (
              <div key={item.label} className="proof-card dossier-panel rounded-2xl px-4 py-4">
                <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/55">
                  {item.label}
                </dt>
                <dd className="mt-2 font-serif text-3xl font-black text-white">
                  {item.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="w-full min-w-0 lg:col-span-5">
          <div
            ref={portraitWrapRef}
            data-testid="hero-portrait-wrap"
            className="dossier-panel relative mx-auto aspect-[4/5] w-full max-w-[34rem] overflow-hidden rounded-[2rem] shadow-[0_34px_110px_rgba(0,0,0,0.62)] lg:mx-0 lg:ml-auto"
          >
            <div
              ref={portraitTiltRef}
              className="absolute inset-0 will-change-transform"
              style={{ transformStyle: "preserve-3d" }}
            >
              <Image
                src="/blackwhite.jpeg"
                alt="Geetha Krishna portrait black and white"
                fill
                loading="eager"
                sizes="(max-width: 1024px) 86vw, 34vw"
                className="object-cover opacity-[0.62] grayscale"
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
                  sizes="(max-width: 1024px) 86vw, 34vw"
                  className="object-cover saturate-110"
                />
              </div>

              <div className="absolute inset-0 archive-texture opacity-25" />
              <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(7,7,10,0.92)_0%,rgba(7,7,10,0.26)_46%,transparent_100%)]" />

              <div className="absolute left-5 top-5 rounded-full border border-white/[0.12] bg-[#08080d]/85 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.24em] text-white/65">
                Geetha Krishna / 2026
              </div>
              <div className="absolute bottom-5 left-5 right-5 grid grid-cols-2 gap-3">
                {["Visual Direction", "Brand Systems", "Campaign Motion", "Client-ready Output"].map((item) => (
                  <div
                    key={item}
                    className="min-h-11 rounded-xl border border-white/10 bg-[#08080d]/85 px-3 py-3 text-center font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-white/70"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <a
        href="#work"
        className="absolute bottom-5 left-1/2 z-20 hidden -translate-x-1/2 items-center gap-2 rounded-full border border-white/10 bg-[#08080d]/80 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.22em] text-white/50 transition-colors hover:text-white md:inline-flex"
      >
        Scroll to explore
        <ArrowDown className="h-3.5 w-3.5" aria-hidden="true" />
      </a>
    </section>
  );
}
