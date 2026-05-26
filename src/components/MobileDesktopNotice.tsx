"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";

const STORAGE_KEY = "portfolioMobileDesktopNoticeSeen";
const MOBILE_QUERY = "(max-width: 767px)";
const MOBILE_USER_AGENT = /Mobi|Android|iPhone|iPad/i;

function isMobileViewport() {
  return (
    window.matchMedia(MOBILE_QUERY).matches ||
    MOBILE_USER_AGENT.test(window.navigator.userAgent)
  );
}

function hasSeenNotice() {
  try {
    return window.sessionStorage.getItem(STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

function markNoticeSeen() {
  try {
    window.sessionStorage.setItem(STORAGE_KEY, "true");
  } catch {
    // Storage can be blocked in private or embedded browsing contexts.
  }
}

export default function MobileDesktopNotice() {
  const [visible, setVisible] = useState(false);
  const [dismissing, setDismissing] = useState(false);
  const continueButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const dismiss = useCallback(() => {
    markNoticeSeen();
    setDismissing(true);
    window.setTimeout(() => {
      setVisible(false);
      setDismissing(false);
    }, 260);
  }, []);

  useEffect(() => {
    const syncVisibility = () => {
      if (isMobileViewport() && !hasSeenNotice()) {
        setVisible(true);
      }
    };

    syncVisibility();
    window.addEventListener("resize", syncVisibility);

    return () => window.removeEventListener("resize", syncVisibility);
  }, []);

  useEffect(() => {
    if (!visible) return;

    previousFocusRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusFrame = window.requestAnimationFrame(() => {
      continueButtonRef.current?.focus();
    });

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") dismiss();
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.cancelAnimationFrame(focusFrame);
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      previousFocusRef.current?.focus();
    };
  }, [dismiss, visible]);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[70] flex items-center justify-center bg-[#050508]/94 px-5 backdrop-blur-[18px] ${
        dismissing ? "animate-[mobileNoticeFadeOut_260ms_ease_forwards]" : "animate-[mobileNoticeFadeIn_400ms_ease]"
      }`}
      data-testid="mobile-desktop-notice"
      data-lenis-prevent="true"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-5 top-7 h-px bg-white/10"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-7 left-5 w-px bg-white/10"
      />
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="mobile-desktop-notice-title"
        aria-describedby="mobile-desktop-notice-description"
        className="relative w-full max-w-[22.5rem] border border-white/[0.13] bg-[#09090d] px-5 pb-5 pt-5 text-left text-[var(--color-ivory)] shadow-[0_28px_90px_rgba(0,0,0,0.72)] animate-[mobileNoticeSlideUp_500ms_cubic-bezier(0.22,1,0.36,1)_100ms_both]"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-5 top-[4.35rem] h-px bg-white/10"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-5 right-5 h-14 w-14 border-b border-r border-[#e8c547]/30"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-5 top-5 h-14 w-14 border-l border-t border-[#e8c547]/30"
        />

        <div className="relative z-10 mb-9 flex items-start justify-between">
          <div>
            <p className="font-serif text-[1.35rem] font-black leading-none text-white">
              GK<span className="text-[#e8c547]">.</span>
            </p>
            <p className="mt-1.5 font-mono text-[9px] font-bold uppercase tracking-[0.24em] text-white/36">
              Visual Dossier
            </p>
          </div>
          <p className="border border-white/10 px-2.5 py-1.5 font-mono text-[8px] font-bold uppercase tracking-[0.2em] text-[#e8c547]">
            Desktop Recommended
          </p>
        </div>

        <h2
          id="mobile-desktop-notice-title"
          className="relative z-10 mb-5 max-w-[15rem] font-serif text-[2.45rem] font-black leading-[0.88] tracking-normal text-white"
        >
          You&apos;re on a small screen
        </h2>

        <div aria-hidden="true" className="relative z-10 mb-5 grid grid-cols-[4.5rem_1fr] border-y border-white/10 font-mono text-[9px] uppercase tracking-[0.18em] text-white/38">
          <span className="border-r border-white/10 py-3 text-[#e8c547]">01</span>
          <span className="py-3 pl-3">Desktop layout carries the full casework.</span>
          <span className="border-r border-t border-white/10 py-3 text-[#e8c547]">02</span>
          <span className="border-t border-white/10 py-3 pl-3">Mobile view remains available.</span>
        </div>

        <p
          id="mobile-desktop-notice-description"
          className="relative z-10 mb-6 max-w-[18.5rem] text-[0.95rem] leading-[1.65] text-white/60"
        >
          This experience is crafted for{" "}
          <strong className="font-bold text-white/78">desktop browsers</strong>.
          You might miss some visual details on mobile, but you&apos;re welcome
          to continue.
        </p>

        <div className="relative z-10 flex flex-col gap-2.5">
          <button
            ref={continueButtonRef}
            type="button"
            onClick={dismiss}
            className="group inline-flex min-h-12 items-center justify-between gap-3 bg-[#e8c547] px-5 py-3.5 font-sans text-[15px] font-black text-[#09090d] transition duration-200 hover:bg-[#f0d060] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f3d766] focus-visible:ring-offset-2 focus-visible:ring-offset-[#09090d]"
          >
            Continue Anyway
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" strokeWidth={2.8} aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={dismiss}
            className="min-h-12 border border-white/[0.13] bg-transparent px-5 py-3 font-sans text-sm font-bold text-white/48 transition duration-200 hover:border-white/[0.24] hover:text-white/82 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#09090d]"
          >
            Got it, I&apos;ll switch devices
          </button>
        </div>

        <p className="relative z-10 mt-5 border-t border-white/[0.08] pt-4 font-mono text-[9px] uppercase tracking-[0.18em] text-white/28">
          This message only appears once per session.
        </p>
      </section>
    </div>
  );
}
