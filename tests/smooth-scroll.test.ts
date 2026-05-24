import { describe, expect, it } from "vitest";
import {
  clampScrollTarget,
  getAnchorScrollTarget,
  getKeyboardScrollDestination,
  getLerpScrollStep,
  isScrollSettled,
  isNativeScrollableTarget,
  normalizeWheelDelta,
} from "@/lib/smooth-scroll";

describe("smooth scroll helpers", () => {
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

  it("keeps nested scrollable areas native", () => {
    document.body.innerHTML = `
      <div>
        <div data-native-scroll="true"><button id="inside">Filter</button></div>
        <button id="outside">Outside</button>
      </div>
    `;

    expect(
      isNativeScrollableTarget(document.getElementById("inside"))
    ).toBe(true);
    expect(
      isNativeScrollableTarget(document.getElementById("outside"))
    ).toBe(false);
  });

  it("maps keyboard navigation to smooth destinations", () => {
    expect(getKeyboardScrollDestination("ArrowDown", 100, 800, 2000)).toBe(180);
    expect(getKeyboardScrollDestination("PageDown", 100, 800, 2000)).toBe(740);
    expect(getKeyboardScrollDestination("End", 100, 800, 2000)).toBe(2000);
    expect(getKeyboardScrollDestination("Tab", 100, 800, 2000)).toBeNull();
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
});
