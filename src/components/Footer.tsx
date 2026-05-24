"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { CONTACT } from "@/content/portfolio";

export default function Footer() {
  const shouldReduceMotion = useReducedMotion();
  const availableSocials = CONTACT.socials
    .map((social) => ({ ...social, href: social.href ?? "" }))
    .filter((social) => social.href.length > 0);

  const fadeUp = shouldReduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
      };

  return (
    <footer
      id="contact"
      className="relative scroll-mt-28 overflow-x-clip border-t border-white/5 bg-transparent px-4 pb-12 pt-20 sm:px-6 md:pt-24 lg:px-8 xl:px-10 2xl:px-12"
    >
      <div className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[50vh] bg-gradient-to-t from-[var(--color-accent)]/15 to-transparent blur-3xl" />
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-px bg-gradient-to-r from-transparent via-[var(--color-accent)]/45 to-transparent" />

      <div className="mx-auto grid min-h-screen max-w-none min-w-0 items-start gap-10 lg:grid-cols-[clamp(220px,20vw,300px)_minmax(0,1fr)] lg:gap-10 xl:gap-12">
        <header className="z-20 w-full min-w-0 space-y-4 text-left lg:sticky lg:top-28">
          <motion.p
            {...fadeUp}
            className="flex items-center gap-2 font-mono text-sm uppercase tracking-widest text-[var(--color-accent)]"
          >
            <span className="motion-safe:animate-pulse h-2 w-2 rounded-full bg-[var(--color-accent)]" />
            Premium project briefs open
          </motion.p>
          <h2 className="font-serif text-4xl font-black tracking-tight text-white md:text-5xl">
            Contact Dossier
          </h2>
          <p className="max-w-sm text-sm leading-relaxed text-white/72">
            Send a focused brief for identity, motion, interface, or campaign
            systems built with premium visual direction.
          </p>
        </header>

        <div className="dossier-chapter-pane w-full min-w-0 overflow-x-clip text-left">
          <motion.h3
          {...(shouldReduceMotion
            ? {}
            : {
                initial: { opacity: 0, y: 30 },
                whileInView: { opacity: 1, y: 0 },
                viewport: { once: true },
              })}
          className="text-glow mb-12 font-serif text-5xl md:text-8xl lg:text-9xl"
        >
          Start the next <br />
          <span className="italic text-white/60">visual system.</span>
          </motion.h3>

        <p className="mb-4 text-sm text-white/72">
          Send the goal, timeline, and scope. I usually reply within 24 hours.
        </p>

        <motion.a
          {...(shouldReduceMotion
            ? {}
            : {
                initial: { opacity: 0, scale: 0.95 },
                whileInView: { opacity: 1, scale: 1 },
                viewport: { once: true },
                transition: { type: "spring", stiffness: 200, damping: 20 },
              })}
          href={`mailto:${CONTACT.email}`}
          className="group relative flex max-w-full items-center gap-3 overflow-hidden rounded-full bg-[var(--color-accent)] px-8 py-5 font-sans text-sm font-medium text-[#0B0B0F] md:text-lg"
        >
          <span className="relative z-10 truncate">{CONTACT.email}</span>
          <ArrowUpRight
            className="relative z-10 h-5 w-5 flex-shrink-0 transition-transform duration-300 group-hover:rotate-45"
            aria-hidden="true"
          />
          <div className="absolute inset-0 translate-y-full bg-white transition-transform duration-500 ease-in-out group-hover:translate-y-0" />
        </motion.a>

        <div className="mt-32 flex w-full flex-col items-center justify-between gap-6 border-t border-white/10 pt-8 font-mono text-sm text-[var(--color-muted)] md:flex-row md:items-start">
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
                href={`mailto:${CONTACT.email}?subject=${encodeURIComponent("Share social profile links")}`}
                className="inline-flex min-h-11 items-center text-white/75 transition-colors hover:text-[var(--color-accent)]"
              >
                Social profiles available on request
              </a>
            )}
          </div>
        </div>
        </div>
      </div>
    </footer>
  );
}
