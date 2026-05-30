"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight, Clock3, Mail, MessageSquareText, Phone } from "lucide-react";
import { CONTACT } from "@/content/portfolio";

gsap.registerPlugin(ScrollTrigger);

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const railRef = useRef<HTMLElement>(null);
  const topLineRef = useRef<HTMLDivElement>(null);
  const briefPanelRef = useRef<HTMLDivElement>(null);
  const contactCardsRef = useRef<HTMLDivElement>(null);
  const checklistRef = useRef<HTMLDivElement>(null);
  const [copyStatus, setCopyStatus] = useState<string | null>(null);
  const availableSocials = CONTACT.socials
    .map((social) => ({ ...social, href: social.href ?? "" }))
    .filter((social) => social.href.length > 0);
  const briefHref = `mailto:${CONTACT.email}?subject=${encodeURIComponent(
    "Portfolio project brief"
  )}&body=${encodeURIComponent(
    "Hi Geetha,\n\nProject type:\nTimeline:\nDeliverables needed:\nBrand references:\nBudget range:\n\n"
  )}`;

  const copyToClipboard = async (value: string, label: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopyStatus(`${label} copied`);
      window.setTimeout(() => setCopyStatus(null), 1800);
    } catch {
      setCopyStatus(`Select and copy: ${value}`);
    }
  };

  useGSAP(
    () => {
      const root = footerRef.current;
      if (!root) return;

      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const finePointer = window.matchMedia("(pointer: fine)").matches;

      const revealItems = [
        railRef.current,
        briefPanelRef.current,
        ...(contactCardsRef.current
          ? Array.from(contactCardsRef.current.children)
          : []),
        ...(checklistRef.current ? Array.from(checklistRef.current.children) : []),
      ].filter(Boolean);

      let cleanupPointerEffects = () => {};

      const ctx = gsap.context(() => {
        gsap.set(root, { "--contact-x": "62%", "--contact-y": "36%" });

        ScrollTrigger.create({
          trigger: root,
          start: "top 86%",
          once: true,
          onEnter: () => {
            const timeline = gsap.timeline({ defaults: { ease: "power3.out" } });

            if (topLineRef.current) {
              timeline.fromTo(
                topLineRef.current,
                { scaleX: 0, opacity: 0.25 },
                {
                  scaleX: 1,
                  opacity: 1,
                  transformOrigin: "center",
                  duration: reduced ? 0.2 : 0.9,
                  onComplete: () => {
                    gsap.set(topLineRef.current, { clearProps: "transform,opacity" });
                  },
                },
                0
              );
            }

            timeline.fromTo(
              ".contact-aura",
              { autoAlpha: 0, scale: 0.96 },
              {
                autoAlpha: 1,
                scale: 1,
                duration: reduced ? 0.2 : 1.2,
              },
              0
            );

            if (revealItems.length) {
              timeline.fromTo(
                revealItems,
                { y: reduced ? 0 : 26, opacity: 0, filter: "blur(10px)" },
                {
                  y: 0,
                  opacity: 1,
                  filter: "blur(0px)",
                  duration: reduced ? 0.2 : 0.72,
                  stagger: reduced ? 0 : 0.065,
                  onComplete: () => {
                    gsap.set(revealItems, {
                      clearProps: "transform,opacity,filter",
                    });
                  },
                },
                0.12
              );
            }
          },
        });

        if (reduced || !finePointer) return;

        const moveContactGlow = (event: PointerEvent) => {
          const rect = root.getBoundingClientRect();
          gsap.to(root, {
            "--contact-x": `${event.clientX - rect.left}px`,
            "--contact-y": `${event.clientY - rect.top}px`,
            duration: 0.55,
            ease: "power3.out",
            overwrite: "auto",
          });
        };

        root.addEventListener("pointermove", moveContactGlow);

        const magneticTargets = Array.from(
          root.querySelectorAll<HTMLElement>("[data-contact-magnet='true']")
        );

        const handleMagnetMove = (event: PointerEvent) => {
          const target = event.currentTarget as HTMLElement;
          const rect = target.getBoundingClientRect();
          const x = event.clientX - rect.left - rect.width / 2;
          const y = event.clientY - rect.top - rect.height / 2;

          gsap.to(target, {
            x: x * 0.09,
            y: y * 0.12,
            rotateX: y * -0.04,
            rotateY: x * 0.035,
            scale: 1.018,
            duration: 0.45,
            ease: "power3.out",
            overwrite: "auto",
          });
        };

        const handleMagnetLeave = (event: PointerEvent) => {
          gsap.to(event.currentTarget, {
            x: 0,
            y: 0,
            rotateX: 0,
            rotateY: 0,
            scale: 1,
            duration: 0.65,
            ease: "elastic.out(1, 0.55)",
            overwrite: "auto",
          });
        };

        magneticTargets.forEach((target) => {
          target.addEventListener("pointermove", handleMagnetMove);
          target.addEventListener("pointerleave", handleMagnetLeave);
        });

        cleanupPointerEffects = () => {
          root.removeEventListener("pointermove", moveContactGlow);
          magneticTargets.forEach((target) => {
            target.removeEventListener("pointermove", handleMagnetMove);
            target.removeEventListener("pointerleave", handleMagnetLeave);
          });
        };
      }, footerRef);

      return () => {
        cleanupPointerEffects();
        ctx.revert();
      };
    },
    { scope: footerRef }
  );

  return (
    <footer
      ref={footerRef}
      id="contact"
      data-scroll-chapter="true"
      data-contact-effects="premium"
      className="relative scroll-mt-24 overflow-x-clip border-t border-white/5 bg-transparent px-4 pb-10 pt-10 sm:min-h-[100svh] sm:px-6 sm:pt-12 md:pt-16 lg:px-8 xl:px-10 2xl:px-12"
    >
      <div className="contact-aura" aria-hidden="true">
        <span className="contact-orbit" />
        <span className="contact-scanline" />
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[50vh] bg-gradient-to-t from-[var(--color-accent)]/15 to-transparent blur-3xl" />
      <div
        ref={topLineRef}
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-px bg-gradient-to-r from-transparent via-[var(--color-accent)]/45 to-transparent"
      />

      <div className="mx-auto grid max-w-none min-w-0 items-start gap-7 lg:grid-cols-[clamp(190px,17vw,260px)_minmax(0,1fr)] lg:gap-8 xl:gap-10">
        <header
          ref={railRef}
          className="z-20 w-full min-w-0 space-y-4 text-left lg:sticky lg:top-28"
        >
          <p className="flex items-center gap-2 font-mono text-sm uppercase tracking-widest text-[var(--color-accent)]">
            <span className="h-2 w-2 rounded-full bg-[var(--color-accent)]" />
            Brief desk open
          </p>
          <h2 className="font-serif text-4xl font-black tracking-tight text-white md:text-5xl">
            Contact Dossier
          </h2>
          <p className="max-w-sm text-[15px] leading-relaxed text-white/72">
            Send the project type, timeline, deliverables, and brand references.
            I will reply with the next practical step.
          </p>
        </header>

        <div className="dossier-chapter-pane w-full min-w-0 overflow-x-clip text-left">
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1.05fr)_minmax(280px,0.95fr)]">
            <div ref={briefPanelRef} className="dossier-panel rounded-3xl p-6 md:p-8">
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.24em] text-[var(--color-accent)]">
                Start here
              </p>
              <h3 className="mt-4 max-w-3xl font-serif text-4xl font-black leading-[0.98] text-white md:text-6xl">
                Send a clear brief. Get a visual direction.
              </h3>
              <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-white/70">
                Best fit for logos, posters, menu cards, banners, UI screens,
                reels, and e-learning visual material.
              </p>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <a
                  href={briefHref}
                  aria-label="Start project brief email template"
                  data-contact-magnet="true"
                  className="contact-premium-cta inline-flex min-h-12 items-center justify-center rounded-full bg-[var(--color-accent)] px-5 py-2 font-mono text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#07070A] transition-colors hover:bg-white"
                >
                  Start project brief
                  <ArrowUpRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </a>
                <button
                  type="button"
                  aria-label="Copy email address"
                  onClick={() => void copyToClipboard(CONTACT.email, "Email")}
                  data-contact-magnet="true"
                  className="contact-premium-ghost inline-flex min-h-12 items-center justify-center rounded-full border border-white/12 px-5 py-2 font-mono text-[11px] font-extrabold uppercase tracking-[0.16em] text-white/78 transition-colors hover:border-[var(--color-accent)]/50 hover:text-white"
                >
                  Copy email
                </button>
              </div>
              <p className="mt-3 min-h-5 font-mono text-[10px] uppercase tracking-[0.16em] text-white/50">
                {copyStatus ?? "If email does not open, copy the email instead."}
              </p>
            </div>

            <div ref={contactCardsRef} className="grid gap-3">
              {[
                { icon: Mail, label: "Email", value: CONTACT.email },
                { icon: Phone, label: "Phone", value: CONTACT.phone },
                { icon: Clock3, label: "Reply window", value: "Usually within 24 hours" },
              ].map((item) => {
                const Icon = item.icon;
                const copyValue = item.label === "Phone" ? CONTACT.phone : CONTACT.email;
                const canCopy = item.label !== "Reply window";
                const cardClassName =
                  "contact-premium-card group flex min-w-0 items-center gap-4 rounded-2xl border border-white/10 bg-[#0d0d13] p-4 text-left transition-colors hover:border-[var(--color-accent)]/45 hover:bg-[#111119]";
                const cardContent = (
                  <>
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-[#15151d] text-[var(--color-accent)]">
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <span className="min-w-0">
                      <span className="block font-mono text-[10px] uppercase tracking-[0.2em] text-white/42">
                        {item.label}
                      </span>
                      <span className="mt-1 block truncate text-sm font-semibold text-white/78 group-hover:text-white">
                        {item.value}
                      </span>
                    </span>
                    {canCopy && (
                      <span className="ml-auto hidden font-mono text-[10px] uppercase tracking-[0.16em] text-white/38 sm:block">
                        Copy
                      </span>
                    )}
                  </>
                );

                return canCopy ? (
                  <button
                    key={item.label}
                    type="button"
                    aria-label={`Copy ${item.label.toLowerCase()}: ${item.value}`}
                    onClick={() => void copyToClipboard(copyValue, item.label)}
                    data-contact-magnet="true"
                    className={cardClassName}
                  >
                    {cardContent}
                  </button>
                ) : (
                  <div
                    key={item.label}
                    aria-label={`${item.label}: ${item.value}`}
                    data-contact-magnet="true"
                    className={cardClassName}
                  >
                    {cardContent}
                  </div>
                );
              })}
            </div>
          </div>

          <div ref={checklistRef} className="mt-5 grid gap-3 md:grid-cols-4">
            {[
              "Project type",
              "Timeline",
              "Deliverables",
              "Brand references",
            ].map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-white/10 bg-[#0d0d13] px-4 py-3"
              >
                <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-white/58">
                  <MessageSquareText className="h-3.5 w-3.5 text-[var(--color-accent)]" />
                  {item}
                </div>
              </div>
            ))}
          </div>

        <div className="mt-10 flex w-full flex-col items-center justify-between gap-6 border-t border-white/10 pt-8 font-mono text-sm text-[var(--color-muted)] md:flex-row md:items-start">
          <p>(c) {new Date().getFullYear()} Geetha Krishna. All rights reserved.</p>

          <div className="flex flex-wrap justify-center gap-8 md:justify-start">
            <a
              href={`tel:${CONTACT.phone}`}
              className="inline-flex min-h-11 items-center transition-colors hover:text-[var(--color-accent)]"
            >
              {CONTACT.phone}
            </a>

            {availableSocials.length > 0 ? (
              availableSocials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-11 items-center transition-colors hover:text-[var(--color-accent)]"
                >
                  {social.label}
                </a>
              ))
            ) : (
              <a
                href="#contact"
                className="inline-flex min-h-11 items-center text-white/75 transition-colors hover:text-[var(--color-accent)]"
              >
                Copy contact details above
              </a>
            )}
          </div>
        </div>
        </div>
      </div>
    </footer>
  );
}
