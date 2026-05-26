import { cleanup, render, waitFor } from "@testing-library/react";
import { createElement } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import SmoothScroll from "@/components/SmoothScroll";
import { ScrollTrigger } from "@/lib/gsap";

const lenisMock = vi.hoisted(() => ({
  instances: [] as Array<{
    options: {
      autoRaf: boolean;
      anchors: { offset: number };
      smoothWheel: boolean;
      syncTouch: boolean;
      stopInertiaOnNavigate: boolean;
      prevent: (node: HTMLElement) => boolean;
    };
    handlers: Map<string, () => void>;
    on: ReturnType<typeof vi.fn>;
    scrollTo: ReturnType<typeof vi.fn>;
    start: ReturnType<typeof vi.fn>;
    stop: ReturnType<typeof vi.fn>;
    destroy: ReturnType<typeof vi.fn>;
  }>,
  constructor: vi.fn(),
  unsubscribe: vi.fn(),
}));

const scrollTriggerMock = vi.hoisted(() => ({
  update: vi.fn(),
}));

vi.mock("lenis", () => {
  class MockLenis {
    options;
    handlers = new Map<string, () => void>();
    on = vi.fn((event: string, callback: () => void) => {
      this.handlers.set(event, callback);
      return lenisMock.unsubscribe;
    });
    scrollTo = vi.fn();
    start = vi.fn();
    stop = vi.fn();
    destroy = vi.fn();

    constructor(options: MockLenis["options"]) {
      this.options = options;
      lenisMock.instances.push(this);
      lenisMock.constructor(options);
    }
  }

  return { default: MockLenis };
});

vi.mock("@/lib/gsap", () => ({
  ScrollTrigger: scrollTriggerMock,
}));

function setMatchMedia(matchesFor: Partial<Record<string, boolean>> = {}) {
  vi.mocked(window.matchMedia).mockImplementation((query: string) => ({
    matches: Boolean(matchesFor[query]),
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
}

describe("SmoothScroll", () => {
  beforeEach(() => {
    lenisMock.instances.length = 0;
    lenisMock.constructor.mockClear();
    lenisMock.unsubscribe.mockClear();
    scrollTriggerMock.update.mockClear();
    document.body.style.overflow = "";
    delete window.__lenis;
    setMatchMedia();
  });

  afterEach(() => {
    cleanup();
    document.body.style.overflow = "";
    delete window.__lenis;
  });

  it("initializes Lenis with smooth anchors and ScrollTrigger syncing", () => {
    render(createElement(SmoothScroll));

    expect(lenisMock.constructor).toHaveBeenCalledTimes(1);
    const instance = lenisMock.instances[0];
    expect(instance.options).toMatchObject({
      autoRaf: true,
      anchors: { offset: 0 },
      smoothWheel: true,
      syncTouch: false,
      stopInertiaOnNavigate: true,
    });
    expect(instance.on).toHaveBeenCalledWith("scroll", expect.any(Function));

    instance.handlers.get("scroll")?.();
    expect(ScrollTrigger.update).toHaveBeenCalledTimes(1);
  });

  it("exposes the active Lenis instance and clears it on unmount", () => {
    const { unmount } = render(createElement(SmoothScroll));
    const instance = lenisMock.instances[0];

    expect(window.__lenis).toBe(instance);

    unmount();

    expect(window.__lenis).toBeUndefined();
  });

  it("keeps nested native scroll areas out of Lenis smoothing", () => {
    render(createElement(SmoothScroll));

    const instance = lenisMock.instances[0];
    document.body.innerHTML = `
      <div>
        <div data-native-scroll="true"><button id="native-child">Filter</button></div>
        <div data-lenis-prevent><button id="prevent-child">Modal</button></div>
        <button id="outside">Outside</button>
      </div>
    `;

    expect(
      instance.options.prevent(document.getElementById("native-child") as HTMLElement)
    ).toBe(true);
    expect(
      instance.options.prevent(document.getElementById("prevent-child") as HTMLElement)
    ).toBe(true);
    expect(
      instance.options.prevent(document.getElementById("outside") as HTMLElement)
    ).toBe(false);
  });

  it("skips Lenis for reduced motion and coarse pointers", () => {
    setMatchMedia({ "(prefers-reduced-motion: reduce)": true });
    const reduced = render(createElement(SmoothScroll));
    expect(lenisMock.constructor).not.toHaveBeenCalled();
    reduced.unmount();

    setMatchMedia({ "(pointer: coarse)": true });
    render(createElement(SmoothScroll));
    expect(lenisMock.constructor).not.toHaveBeenCalled();
  });

  it("stops Lenis while body scroll is locked and destroys it on unmount", async () => {
    const { unmount } = render(createElement(SmoothScroll));
    const instance = lenisMock.instances[0];

    expect(instance.start).toHaveBeenCalledTimes(1);

    document.body.style.overflow = "hidden";
    await waitFor(() => expect(instance.stop).toHaveBeenCalledTimes(1));

    document.body.style.overflow = "";
    await waitFor(() => expect(instance.start).toHaveBeenCalledTimes(2));

    unmount();

    expect(lenisMock.unsubscribe).toHaveBeenCalledTimes(1);
    expect(instance.destroy).toHaveBeenCalledTimes(1);
  });
});
