"use client";

import { useEffect, useRef } from "react";
import {
  clampScrollTarget,
  getAnchorScrollTarget,
  getKeyboardScrollDestination,
  getLerpScrollStep,
  isScrollSettled,
  isEditableTarget,
  isNativeScrollableTarget,
  normalizeWheelDelta,
} from "@/lib/smooth-scroll";

const SCROLL_LERP = 0.2;
const MAX_WHEEL_DELTA = 260;

function getMaxScroll() {
  return Math.max(
    document.documentElement.scrollHeight - window.innerHeight,
    0
  );
}

function isScrollLocked() {
  return (
    document.body.style.overflow === "hidden" ||
    window.getComputedStyle(document.body).overflow === "hidden"
  );
}

export default function SmoothScroll() {
  const currentYRef = useRef(0);
  const lastFrameTimeRef = useRef(0);
  const targetYRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reducedMotion) return;

    const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
    if (coarsePointer) return;

    const root = document.documentElement;
    const previousScrollBehavior =
      root.style.getPropertyValue("scroll-behavior");
    const previousScrollBehaviorPriority =
      root.style.getPropertyPriority("scroll-behavior");
    currentYRef.current = window.scrollY;
    targetYRef.current = window.scrollY;
    root.classList.add("lenis-like-scroll");
    root.style.setProperty("scroll-behavior", "auto", "important");

    const stop = () => {
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };

    const tick = (now: number) => {
      if (isScrollLocked()) {
        currentYRef.current = window.scrollY;
        targetYRef.current = window.scrollY;
        rafRef.current = null;
        return;
      }

      const deltaMs = now - lastFrameTimeRef.current;
      lastFrameTimeRef.current = now;

      const nextY = getLerpScrollStep(
        currentYRef.current,
        targetYRef.current,
        deltaMs,
        SCROLL_LERP
      );
      currentYRef.current = nextY;
      window.scrollTo(0, nextY);

      if (isScrollSettled(nextY, targetYRef.current)) {
        currentYRef.current = targetYRef.current;
        window.scrollTo(0, targetYRef.current);
        rafRef.current = null;
        return;
      }

      rafRef.current = window.requestAnimationFrame(tick);
    };

    const start = (nextTarget: number) => {
      targetYRef.current = clampScrollTarget(nextTarget, getMaxScroll());

      if (rafRef.current === null) {
        currentYRef.current = window.scrollY;
        lastFrameTimeRef.current = window.performance.now();
        rafRef.current = window.requestAnimationFrame(tick);
      }
    };

    const onWheel = (event: WheelEvent) => {
      if (
        event.defaultPrevented ||
        event.ctrlKey ||
        isScrollLocked() ||
        isNativeScrollableTarget(event.target)
      ) {
        return;
      }

      event.preventDefault();

      const delta = normalizeWheelDelta(
        event.deltaY,
        event.deltaMode,
        window.innerHeight
      );
      const clampedDelta = Math.max(
        Math.min(delta, MAX_WHEEL_DELTA),
        -MAX_WHEEL_DELTA
      );
      start(targetYRef.current + clampedDelta);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (
        event.defaultPrevented ||
        event.altKey ||
        event.ctrlKey ||
        event.metaKey ||
        isScrollLocked() ||
        isEditableTarget(event.target)
      ) {
        return;
      }

      const destination = getKeyboardScrollDestination(
        event.key,
        targetYRef.current,
        window.innerHeight,
        getMaxScroll()
      );

      if (destination === null) return;

      event.preventDefault();
      start(destination);
    };

    const onClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const link = (event.target as Element | null)?.closest<HTMLAnchorElement>(
        'a[href^="#"]'
      );
      if (!link) return;

      const destination = getAnchorScrollTarget(link.hash, window.scrollY);
      if (destination === null) return;

      event.preventDefault();
      window.history.pushState(null, "", link.hash);
      start(destination);
    };

    const onResize = () => {
      targetYRef.current = clampScrollTarget(window.scrollY, getMaxScroll());
    };

    const onNativeScroll = () => {
      if (rafRef.current === null) {
        currentYRef.current = window.scrollY;
        targetYRef.current = window.scrollY;
      }
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onNativeScroll, { passive: true });
    document.addEventListener("click", onClick);

    return () => {
      stop();
      root.classList.remove("lenis-like-scroll");
      if (previousScrollBehavior) {
        root.style.setProperty(
          "scroll-behavior",
          previousScrollBehavior,
          previousScrollBehaviorPriority
        );
      } else {
        root.style.removeProperty("scroll-behavior");
      }
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onNativeScroll);
      document.removeEventListener("click", onClick);
    };
  }, []);

  return null;
}
