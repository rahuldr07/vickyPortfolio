"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { ScrollTrigger } from "@/lib/gsap";

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

function isScrollLocked() {
  return (
    document.body.style.overflow === "hidden" ||
    window.getComputedStyle(document.body).overflow === "hidden"
  );
}

function shouldPreventLenis(node: HTMLElement) {
  return Boolean(
    node.closest("[data-native-scroll='true'], [data-lenis-prevent]")
  );
}

export default function SmoothScroll() {
  useEffect(() => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reducedMotion) return;

    const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
    if (coarsePointer) return;

    const lenis = new Lenis({
      autoRaf: true,
      anchors: { offset: 0 },
      smoothWheel: true,
      syncTouch: false,
      stopInertiaOnNavigate: true,
      prevent: shouldPreventLenis,
    });
    window.__lenis = lenis;

    const unsubscribeScroll = lenis.on("scroll", () => {
      ScrollTrigger.update();
      window.dispatchEvent(new Event("portfolio:scroll"));
    });

    const syncScrollLock = () => {
      if (isScrollLocked()) {
        lenis.stop();
        return;
      }

      lenis.start();
    };

    syncScrollLock();

    const bodyObserver = new MutationObserver(syncScrollLock);
    bodyObserver.observe(document.body, {
      attributes: true,
      attributeFilter: ["class", "style"],
    });

    window.addEventListener("resize", syncScrollLock);

    return () => {
      unsubscribeScroll();
      bodyObserver.disconnect();
      window.removeEventListener("resize", syncScrollLock);
      if (window.__lenis === lenis) {
        delete window.__lenis;
      }
      lenis.destroy();
    };
  }, []);

  return null;
}
