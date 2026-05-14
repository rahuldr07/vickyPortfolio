"use client";

import { useEffect, useId, useMemo, useState } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { CONTACT, NAV_LINKS } from "@/content/portfolio";

const sectionIds = NAV_LINKS.map((link) => link.href.replace("#", ""));

export default function TopNav() {
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState(() => {
    if (typeof window !== "undefined") {
      const hash = window.location.hash.replace("#", "");
      if (hash && sectionIds.includes(hash)) return hash;
    }

    return sectionIds[0] ?? "";
  });
  const shouldReduceMotion = useReducedMotion();
  const menuId = useId();

  const desktopLinks = useMemo(
    () =>
      NAV_LINKS.map((link) => {
        const section = link.href.replace("#", "");
        const isActive = activeSection === section;

        return (
          <a
            key={link.href}
            href={link.href}
            aria-current={isActive ? "page" : undefined}
            onClick={() => setActiveSection(section)}
            className={`inline-flex min-h-10 items-center rounded-lg px-2.5 transition-colors duration-300 ${
              isActive
                ? "text-[var(--color-accent)]"
                : "text-white/75 hover:text-[var(--color-accent)]"
            }`}
          >
            {link.label}
          </a>
        );
      }),
    [activeSection]
  );

  useEffect(() => {
    if (!open) return;

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    window.addEventListener("keydown", onEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onEscape);
    };
  }, [open]);

  useEffect(() => {
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => section !== null);

    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible[0]) {
          setActiveSection(visible[0].target.id);
        }
      },
      {
        root: null,
        rootMargin: "-42% 0px -45% 0px",
        threshold: [0.1, 0.25, 0.4, 0.6],
      }
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <nav
        aria-label="Primary"
        className="fixed top-0 z-40 flex w-full items-center justify-between border-b border-white/5 bg-[var(--color-background)]/60 px-5 py-3 backdrop-blur-md md:px-10"
      >
        <a
          href="#main-content"
          className="font-serif text-lg font-bold uppercase tracking-[0.14em] text-white"
        >
          GK<span className="text-[var(--color-accent)]">.</span>
        </a>

        <div className="hidden gap-5 font-sans text-xs uppercase tracking-wider md:flex">
          {desktopLinks}
        </div>

        <a
          href={`mailto:${CONTACT.email}`}
          className="hidden min-h-10 items-center rounded-full bg-[var(--color-accent)] px-4 py-2 font-sans text-[11px] font-bold uppercase tracking-wider text-white transition-shadow duration-300 hover:shadow-[0_0_20px_rgba(139,92,246,0.5)] md:inline-flex"
        >
          Hire Me
        </a>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls={menuId}
          onClick={() => setOpen((value) => !value)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-white md:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id={menuId}
            role="dialog"
            aria-modal="true"
            aria-label="Mobile menu"
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -10 }}
            animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-30 bg-[var(--color-background)]/96 px-6 pt-24 md:hidden"
          >
            <div className="flex flex-col gap-4 font-sans text-lg uppercase tracking-widest">
              {NAV_LINKS.map((link) => {
                const section = link.href.replace("#", "");
                const isActive = activeSection === section;

                return (
                  <a
                    key={link.href}
                    href={link.href}
                    aria-current={isActive ? "page" : undefined}
                    onClick={() => {
                      setActiveSection(section);
                      setOpen(false);
                    }}
                    className={`inline-flex min-h-11 items-center rounded-xl border px-4 py-3 ${
                      isActive
                        ? "border-[var(--color-accent)]/30 bg-[var(--color-accent)]/10 text-white"
                        : "border-white/10 text-white/90"
                    }`}
                  >
                    {link.label}
                  </a>
                );
              })}
              <a
                href={`mailto:${CONTACT.email}`}
                className="mt-2 inline-flex min-h-11 items-center justify-center rounded-full bg-[var(--color-accent)] px-5 py-3 text-sm font-bold text-white"
              >
                Hire Me
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
