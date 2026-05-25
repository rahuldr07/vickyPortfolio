import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  clampScrollTarget,
  getAnchorScrollTarget,
  getDirectionalSectionScrollTarget,
  getKeyboardScrollDestination,
  getLerpScrollStep,
  getWheelSectionScrollTarget,
  isScrollSettled,
  isNativeScrollableTarget,
  normalizeWheelDelta,
} from "@/lib/smooth-scroll";

describe("smooth scroll helpers", () => {
  function setScrollMetrics(
    element: HTMLElement,
    {
      clientHeight,
      scrollHeight,
      scrollTop,
    }: { clientHeight: number; scrollHeight: number; scrollTop: number }
  ) {
    Object.defineProperties(element, {
      clientHeight: { configurable: true, value: clientHeight },
      scrollHeight: { configurable: true, value: scrollHeight },
      scrollTop: { configurable: true, writable: true, value: scrollTop },
    });
  }

  it("clamps requested scroll positions to the document range", () => {
    expect(clampScrollTarget(-80, 900)).toBe(0);
    expect(clampScrollTarget(420, 900)).toBe(420);
    expect(clampScrollTarget(1200, 900)).toBe(900);
  });

  it("resolves same-page anchors with scroll-margin-top", () => {
    document.body.innerHTML = `<section id="work" style="scroll-margin-top: 96px"></section>`;
    const target = document.getElementById("work") as HTMLElement;

    target.getBoundingClientRect = () =>
      ({
        top: 500,
        bottom: 700,
        left: 0,
        right: 0,
        width: 0,
        height: 200,
        x: 0,
        y: 500,
        toJSON: () => ({}),
      }) as DOMRect;

    expect(getAnchorScrollTarget("#work", 120)).toBe(524);
  });

  it("keeps nested scrollable areas native while they can scroll in the wheel direction", () => {
    document.body.innerHTML = `
      <div>
        <div data-native-scroll="true"><button id="inside">Filter</button></div>
        <button id="outside">Outside</button>
      </div>
    `;
    const nativeScroller = document.querySelector("[data-native-scroll='true']") as HTMLElement;

    setScrollMetrics(nativeScroller, {
      clientHeight: 100,
      scrollHeight: 300,
      scrollTop: 80,
    });

    expect(
      isNativeScrollableTarget(document.getElementById("inside"), 40)
    ).toBe(true);
    expect(
      isNativeScrollableTarget(document.getElementById("inside"), -40)
    ).toBe(true);
    expect(
      isNativeScrollableTarget(document.getElementById("outside"), 40)
    ).toBe(false);
  });

  it("hands off downward wheel scroll when a nested scroller is already at the bottom", () => {
    document.body.innerHTML = `
      <div data-native-scroll="true"><button id="inside">Filter</button></div>
    `;
    const nativeScroller = document.querySelector("[data-native-scroll='true']") as HTMLElement;

    setScrollMetrics(nativeScroller, {
      clientHeight: 100,
      scrollHeight: 300,
      scrollTop: 200,
    });

    expect(
      isNativeScrollableTarget(document.getElementById("inside"), 40)
    ).toBe(false);
  });

  it("hands off upward wheel scroll when a nested scroller is already at the top", () => {
    document.body.innerHTML = `
      <div data-native-scroll="true"><button id="inside">Filter</button></div>
    `;
    const nativeScroller = document.querySelector("[data-native-scroll='true']") as HTMLElement;

    setScrollMetrics(nativeScroller, {
      clientHeight: 100,
      scrollHeight: 300,
      scrollTop: 0,
    });

    expect(
      isNativeScrollableTarget(document.getElementById("inside"), -40)
    ).toBe(false);
  });

  it("maps keyboard navigation to smooth destinations", () => {
    expect(getKeyboardScrollDestination("ArrowDown", 100, 800, 2000)).toBe(180);
    expect(getKeyboardScrollDestination("PageDown", 100, 800, 2000)).toBe(740);
    expect(getKeyboardScrollDestination("End", 100, 800, 2000)).toBe(2000);
    expect(getKeyboardScrollDestination("Tab", 100, 800, 2000)).toBeNull();
  });

  it("moves from hero to work when scrolling downward between full-screen chapters", () => {
    expect(getDirectionalSectionScrollTarget([0, 920, 1840], 0, 1)).toBe(920);
  });

  it("moves from work to about when scrolling downward at the work chapter top", () => {
    expect(getDirectionalSectionScrollTarget([0, 920, 1840], 920, 1)).toBe(1840);
  });

  it("moves from work back to hero when scrolling upward at the work chapter top", () => {
    expect(getDirectionalSectionScrollTarget([0, 920, 1840], 920, -1)).toBe(0);
  });

  it("does not jump to the next chapter on light wheel input", () => {
    expect(getWheelSectionScrollTarget([0, 920, 1840], 0, 48)).toBeNull();
  });

  it("jumps to the next chapter on deliberate wheel input", () => {
    expect(getWheelSectionScrollTarget([0, 920, 1840], 0, 220)).toBe(920);
  });

  it("normalizes wheel deltas across delta modes", () => {
    expect(normalizeWheelDelta(3, 1, 800)).toBe(48);
    expect(normalizeWheelDelta(1, 2, 800)).toBe(800);
    expect(normalizeWheelDelta(24, 0, 800)).toBe(24);
  });

  it("calculates frame-rate corrected lerp scroll steps", () => {
    const firstFrame = getLerpScrollStep(0, 1000, 16.67, 0.15);
    const slowFrame = getLerpScrollStep(0, 1000, 33.34, 0.15);

    expect(firstFrame).toBeCloseTo(150, 0);
    expect(slowFrame).toBeGreaterThan(firstFrame);
    expect(slowFrame).toBeLessThan(1000);
  });

  it("detects when smooth scroll is close enough to settle", () => {
    expect(isScrollSettled(199.7, 200)).toBe(true);
    expect(isScrollSettled(198, 200)).toBe(false);
  });

  it("keeps desktop wheel smoothing conservative for long work-section scrolls", () => {
    const source = readFileSync(
      join(process.cwd(), "src", "components", "SmoothScroll.tsx"),
      "utf8"
    );

    expect(source).toContain("const SCROLL_LERP = 0.16;");
    expect(source).toContain("const MAX_WHEEL_DELTA = 220;");
  });
});
