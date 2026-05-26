"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { NAV_LINKS } from "@/content/portfolio";

const sectionIds = NAV_LINKS.map((link) => link.href.replace("#", ""));
const SHOW_AT_TOP_OFFSET = 80;
const HIDE_DELTA = 10;
const SHOW_DELTA = -6;

export default function TopNav() {
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState(sectionIds[0] ?? "");
  const [isHidden, setIsHidden] = useState(false);
  const previousScrollYRef = useRef(0);
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
            className={`relative isolate inline-flex min-h-10 items-center rounded-full px-4 text-[13px] transition-colors duration-300 ${
              isActive
                ? "text-white"
                : "text-white/62 hover:text-white"
            }`}
          >
            {isActive && (
              <span
                className="absolute inset-0 -z-10 rounded-full border border-[var(--color-accent)]/40 bg-[var(--color-accent)]/20 shadow-[0_0_24px_rgba(176,132,246,0.25)]"
              />
            )}
            <span className="relative z-10">{link.label}</span>
          </a>
        );
      }),
    [activeSection]
  );

  useEffect(() => {
    let previousTouchY: number | null = null;
    previousScrollYRef.current = window.scrollY;

    const updateVisibility = (delta: number, latest = window.scrollY) => {
      if (open || latest < SHOW_AT_TOP_OFFSET) {
        setIsHidden(false);
        return;
      }

      if (delta > HIDE_DELTA) {
        setIsHidden(true);
        return;
      }

      if (delta < SHOW_DELTA) {
        setIsHidden(false);
      }
    };

    const onScroll = () => {
      const latest = window.scrollY;
      const delta = latest - previousScrollYRef.current;
      previousScrollYRef.current = latest;
      updateVisibility(delta, latest);
    };

    const onWheel = (event: WheelEvent) => {
      updateVisibility(event.deltaY);
    };

    const onTouchStart = (event: TouchEvent) => {
      previousTouchY = event.touches[0]?.clientY ?? null;
    };

    const onTouchMove = (event: TouchEvent) => {
      const currentTouchY = event.touches[0]?.clientY;
      if (previousTouchY === null || currentTouchY === undefined) return;

      updateVisibility(previousTouchY - currentTouchY);
      previousTouchY = currentTouchY;
    };

    const scrollTargets: EventTarget[] = [window, document, document.body];

    scrollTargets.forEach((target) => {
      target.addEventListener("scroll", onScroll, { passive: true });
    });
    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });

    return () => {
      scrollTargets.forEach((target) => {
        target.removeEventListener("scroll", onScroll);
      });
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
    };
  }, [open]);

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
    const syncHashSection = () => {
      const hash = window.location.hash.replace("#", "");
      if (hash && sectionIds.includes(hash)) {
        setActiveSection(hash);
      }
    };

    syncHashSection();
    window.addEventListener("hashchange", syncHashSection);

    return () => window.removeEventListener("hashchange", syncHashSection);
  }, []);

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

  const navHidden = Boolean(isHidden && !open);

  return (
    <>
      <nav
        aria-label="Primary"
        data-scroll-hidden={navHidden}
        style={{
          opacity: navHidden ? 0 : 1,
          pointerEvents: navHidden ? "none" : "auto",
          transform: `translate(-50%, ${navHidden ? "-135%" : "0%"})`,
        }}
        className="nas-style-nav fixed left-1/2 top-4 z-40 flex w-[calc(100%-1.25rem)] max-w-5xl items-center justify-between gap-3 rounded-full px-3 py-2 text-[var(--color-ivory)] transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform"
      >
        <a
          href="#main-content"
          className="relative z-10 inline-flex h-11 min-w-11 items-center justify-center rounded-full px-3 font-serif text-xl font-black uppercase tracking-normal text-white"
        >
          <span
            className="mr-2 inline-flex h-4 w-4 rotate-45 rounded-[4px] bg-[var(--color-accent)] shadow-[0_0_16px_rgba(159,122,234,0.36)]"
            aria-hidden="true"
          />
          GK<span className="text-[var(--color-accent)]">.</span>
        </a>

        <div className="relative z-10 hidden items-center rounded-full font-sans font-extrabold tracking-normal lg:flex">
          {desktopLinks}
        </div>

        <div className="relative z-10 hidden items-center gap-2 lg:flex">
          <a
            href="#contact"
            className="scan-sweep inline-flex min-h-12 items-center rounded-full bg-[var(--color-accent)] px-6 py-2 font-sans text-sm font-extrabold text-[#07070A] transition-shadow duration-300 hover:shadow-[0_8px_22px_rgba(159,122,234,0.38)]"
          >
            Brief Me
          </a>
        </div>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls={menuId}
          onClick={() => setOpen((value) => !value)}
          className="relative z-10 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.08] text-white lg:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {open && (
        <div className="fixed inset-0 z-30 lg:hidden">
          <div className="absolute inset-0 bg-black/45" onClick={() => setOpen(false)} />
          <div
            id={menuId}
            role="dialog"
            aria-modal="true"
            aria-label="Mobile menu"
            className="absolute left-2 right-2 top-20 max-h-[calc(100svh-6rem)] overflow-y-auto rounded-[1.35rem] border border-white/[0.12] bg-[#0e0e13] p-3 text-white shadow-[0_18px_45px_rgba(0,0,0,0.42)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="relative z-10 flex flex-col gap-2 font-sans text-base font-extrabold tracking-normal">
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
                    className={`inline-flex min-h-12 items-center rounded-[1rem] border px-4 py-3 transition-colors ${
                      isActive
                        ? "border-[var(--color-accent)]/30 bg-[var(--color-accent)]/14 text-white"
                        : "border-white/[0.08] bg-white/[0.06] text-white/76"
                    }`}
                  >
                    {link.label}
                  </a>
                );
              })}
              <a
                href="#contact"
                onClick={() => setOpen(false)}
                className="scan-sweep mt-2 inline-flex min-h-12 items-center justify-center rounded-full bg-[var(--color-accent)] px-5 py-3 text-sm font-black text-[#07070A]"
              >
                Brief Me
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
