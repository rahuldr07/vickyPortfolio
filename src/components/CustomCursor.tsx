"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { AnimatePresence, motion } from "framer-motion";

type CursorBaseState = "default" | "interactive" | "media" | "text";
type CursorRenderState = CursorBaseState | "pressed" | "hidden";

type CursorTarget = {
  label?: string;
  state: CursorBaseState;
};

const DEFAULT_TARGET: CursorTarget = { state: "default" };

const INTERACTIVE_SELECTOR =
  "a[href], button:not([disabled]), [role='button'], input:not([type='hidden']), textarea, select, summary, [tabindex]:not([tabindex='-1'])";
const MEDIA_SELECTOR = "img, video, canvas, picture";
const TEXT_SELECTOR =
  "p, h1, h2, h3, h4, h5, h6, li, blockquote, code, pre, [contenteditable='true']";

const STATE_STYLES: Record<
  Exclude<CursorRenderState, "hidden">,
  {
    accentOpacity: number;
    caretOpacity: number;
    crossOpacity: number;
    dotOpacity: number;
    dotScale: number;
    ringOpacity: number;
    ringSize: number;
    rotate: number;
    scale: number;
  }
> = {
  default: {
    accentOpacity: 0.44,
    caretOpacity: 0,
    crossOpacity: 0.68,
    dotOpacity: 0.82,
    dotScale: 1,
    ringOpacity: 0.66,
    ringSize: 40,
    rotate: 0,
    scale: 1,
  },
  interactive: {
    accentOpacity: 0.96,
    caretOpacity: 0,
    crossOpacity: 0.9,
    dotOpacity: 0,
    dotScale: 0,
    ringOpacity: 0.92,
    ringSize: 56,
    rotate: 0,
    scale: 1,
  },
  media: {
    accentOpacity: 1,
    caretOpacity: 0,
    crossOpacity: 0.86,
    dotOpacity: 0.74,
    dotScale: 0.8,
    ringOpacity: 0.92,
    ringSize: 68,
    rotate: 45,
    scale: 1,
  },
  text: {
    accentOpacity: 0,
    caretOpacity: 1,
    crossOpacity: 0,
    dotOpacity: 0,
    dotScale: 0,
    ringOpacity: 0,
    ringSize: 22,
    rotate: 0,
    scale: 1,
  },
  pressed: {
    accentOpacity: 1,
    caretOpacity: 0,
    crossOpacity: 1,
    dotOpacity: 0.94,
    dotScale: 0.72,
    ringOpacity: 1,
    ringSize: 36,
    rotate: 0,
    scale: 0.84,
  },
};

function getHTMLElement(target: EventTarget | null) {
  return target instanceof HTMLElement ? target : null;
}

function getOverrideTarget(element: HTMLElement) {
  return element.closest<HTMLElement>("[data-cursor]");
}

function fromOverride(element: HTMLElement): CursorTarget | null {
  const overrideTarget = getOverrideTarget(element);

  if (!overrideTarget) return null;

  const override = overrideTarget.dataset.cursor;
  const label = overrideTarget.dataset.cursorLabel;

  if (override === "media") {
    return { state: "media", label: label ?? "View" };
  }

  if (override === "text") {
    return { state: "text" };
  }

  if (override === "link" || override === "interactive") {
    return { state: "interactive", label };
  }

  return null;
}

function getCursorTarget(target: EventTarget | null): CursorTarget {
  const element = getHTMLElement(target);

  if (!element) return DEFAULT_TARGET;

  const overrideTarget = getOverrideTarget(element);
  const interactiveTarget = element.closest<HTMLElement>(INTERACTIVE_SELECTOR);

  if (
    interactiveTarget &&
    overrideTarget &&
    interactiveTarget !== overrideTarget &&
    overrideTarget.contains(interactiveTarget)
  ) {
    return {
      state: "interactive",
      label: interactiveTarget.dataset.cursorLabel,
    };
  }

  const override = fromOverride(element);

  if (override) return override;

  if (interactiveTarget) {
    return {
      state: "interactive",
      label: interactiveTarget.dataset.cursorLabel,
    };
  }

  const mediaTarget = element.closest<HTMLElement>(MEDIA_SELECTOR);

  if (mediaTarget) {
    return {
      state: "media",
      label: mediaTarget.dataset.cursorLabel ?? "View",
    };
  }

  if (element.closest(TEXT_SELECTOR)) {
    return { state: "text" };
  }

  return DEFAULT_TARGET;
}

export default function CustomCursor() {
  const [cursorTarget, setCursorTarget] =
    useState<CursorTarget>(DEFAULT_TARGET);
  const [isEnabled, setIsEnabled] = useState(true);
  const [isPressed, setIsPressed] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsEnabled(!(reduced || coarse));
  }, []);

  useEffect(() => {
    if (!isEnabled) return;

    document.body.classList.add("custom-cursor-enabled");

    return () => {
      document.body.classList.remove("custom-cursor-enabled");
    };
  }, [isEnabled]);

  useEffect(() => {
    if (!isEnabled) return;

    const syncCursorPosition = (event: MouseEvent) => {
      setPosition({ x: event.clientX, y: event.clientY });
      setIsVisible(true);
    };

    const moveCursor = (event: MouseEvent) => {
      syncCursorPosition(event);
    };

    const handleTargetChange = (event: MouseEvent) => {
      syncCursorPosition(event);
      setCursorTarget(getCursorTarget(event.target));
    };

    const handleMouseDown = () => {
      setIsPressed(true);
      setIsVisible(true);
    };

    const handleMouseUp = () => setIsPressed(false);

    const handleLeave = () => {
      setCursorTarget(DEFAULT_TARGET);
      setIsPressed(false);
      setIsVisible(false);
    };

    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("mouseover", handleTargetChange);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mouseleave", handleLeave);
    window.addEventListener("blur", handleLeave);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mouseover", handleTargetChange);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mouseleave", handleLeave);
      window.removeEventListener("blur", handleLeave);
    };
  }, [isEnabled]);

  const cursorState: CursorRenderState = !isVisible
    ? "hidden"
    : isPressed
      ? "pressed"
      : cursorTarget.state;

  if (!isEnabled || cursorState === "hidden") return null;

  const style = STATE_STYLES[cursorState];
  const label = cursorState === "pressed" ? undefined : cursorTarget.label;
  const positionStyle = {
    transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
  } as CSSProperties;

  return (
    <div
      aria-hidden="true"
      className="fixed left-0 top-0 pointer-events-none z-[9999] text-[var(--cursor-ivory)] transition-transform duration-75 ease-out will-change-transform"
      data-cursor-state={cursorState}
      data-testid="custom-cursor"
      style={positionStyle}
    >
      <div style={{ transform: "translate(-50%, -50%)" }}>
      <motion.div
        className="relative flex h-20 w-20 items-center justify-center"
        animate={{ scale: style.scale }}
        transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.div
          className="absolute rounded-full border-2 border-[var(--cursor-ivory)]/70 bg-black/[0.05] shadow-[0_0_30px_rgba(255,250,238,0.16),0_0_34px_rgba(184,154,255,0.2)] backdrop-blur-[1px]"
          animate={{
            height: style.ringSize,
            opacity: style.ringOpacity,
            rotate: style.rotate,
            width: style.ringSize,
          }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
        />

        <motion.div
          className="absolute rounded-full border-2 border-[var(--cursor-accent)] shadow-[0_0_26px_rgba(184,154,255,0.58)]"
          animate={{
            height: style.ringSize + 12,
            opacity: style.accentOpacity,
            rotate: -style.rotate,
            width: style.ringSize + 12,
          }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        />

        <motion.div
          className="absolute h-0.5 w-12 bg-gradient-to-r from-transparent via-[var(--cursor-ivory)] to-transparent"
          animate={{ opacity: style.crossOpacity, scaleX: cursorState === "media" ? 0.72 : 1 }}
        />
        <motion.div
          className="absolute h-12 w-0.5 bg-gradient-to-b from-transparent via-[var(--cursor-ivory)] to-transparent"
          animate={{ opacity: style.crossOpacity, scaleY: cursorState === "media" ? 0.72 : 1 }}
        />

        <motion.div
          className="absolute h-11 w-0.5 rounded-full bg-[var(--cursor-accent)] shadow-[0_0_18px_rgba(184,154,255,0.78)]"
          animate={{ opacity: style.caretOpacity, scaleY: style.caretOpacity ? 1 : 0.5 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
        />

        <motion.div
          className="h-2 w-2 rounded-full bg-[var(--cursor-ivory)] shadow-[0_0_16px_rgba(255,250,238,0.72)]"
          animate={{ opacity: style.dotOpacity, scale: style.dotScale }}
          transition={{ duration: 0.18, ease: "easeOut" }}
        />

        <AnimatePresence>
          {label && (
            <motion.div
              className="absolute left-14 top-1/2 whitespace-nowrap rounded-full border-2 border-[var(--cursor-accent)]/70 bg-[#07070A]/86 px-3.5 py-1.5 font-mono text-[10px] font-black uppercase tracking-[0.22em] text-[var(--cursor-ivory)] shadow-[0_12px_34px_rgba(0,0,0,0.34),0_0_24px_rgba(184,154,255,0.24)] backdrop-blur-md"
              initial={{ opacity: 0, x: -4, y: "-50%" }}
              animate={{ opacity: 1, x: 0, y: "-50%" }}
              exit={{ opacity: 0, x: -4, y: "-50%" }}
              transition={{ duration: 0.16, ease: "easeOut" }}
            >
              {label}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      </div>
    </div>
  );
}
