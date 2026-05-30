import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import TopNav from "@/components/TopNav";

afterEach(() => {
  cleanup();
  document
    .querySelectorAll("[data-test-section='true']")
    .forEach((section) => section.remove());
  vi.restoreAllMocks();
  Object.defineProperty(window, "scrollY", {
    configurable: true,
    value: 0,
  });
});

function appendNavSections(
  bounds: Record<string, { top: number; bottom: number }>
) {
  for (const [id, rect] of Object.entries(bounds)) {
    const section = document.createElement("section");
    section.id = id;
    section.dataset.testSection = "true";
    section.getBoundingClientRect = vi.fn(
      () =>
        ({
          top: rect.top,
          bottom: rect.bottom,
          left: 0,
          right: 1000,
          width: 1000,
          height: rect.bottom - rect.top,
          x: 0,
          y: rect.top,
          toJSON: () => ({}),
        }) as DOMRect
    );
    document.body.appendChild(section);
  }
}

function runAnimationFramesImmediately() {
  vi.spyOn(window, "requestAnimationFrame").mockImplementation((callback) => {
    callback(0);
    return 0;
  });
  vi.spyOn(window, "cancelAnimationFrame").mockImplementation(() => {});
}

describe("TopNav", () => {
  it("links Home to the hero while keeping Profile as its own section", () => {
    render(<TopNav />);

    expect(screen.getByRole("link", { name: /^Home$/i })).toHaveAttribute(
      "href",
      "#home"
    );
    expect(screen.getByRole("link", { name: /^Profile$/i })).toHaveAttribute(
      "href",
      "#about"
    );
  });

  it("opens and closes the mobile menu", () => {
    render(<TopNav />);

    const nav = screen.getByRole("navigation", { name: /primary/i });
    expect(nav).toHaveClass("nas-style-nav");
    expect(nav).toHaveAttribute("data-scroll-hidden", "false");

    const toggleButton = screen.getByRole("button", { name: /open menu/i });
    fireEvent.click(toggleButton);

    const mobileMenu = screen.getByRole("dialog", { name: /mobile menu/i });
    expect(mobileMenu).toBeInTheDocument();
    expect(mobileMenu).toHaveClass("max-h-[calc(100svh-6rem)]");
    expect(mobileMenu).toHaveClass("overflow-y-auto");
    expect(document.body.style.overflow).toBe("hidden");

    expect(within(mobileMenu).getByRole("link", { name: /^Home$/i })).toHaveClass(
      "min-h-12"
    );

    const closeButton = screen.getByRole("button", { name: /close menu/i });
    fireEvent.click(closeButton);

    expect(closeButton).toHaveAttribute("aria-expanded", "false");
    expect(document.body.style.overflow).toBe("");
  });

  it("hides on downward scroll intent and returns on upward scroll intent", () => {
    render(<TopNav />);

    const nav = screen.getByRole("navigation", { name: /primary/i });

    Object.defineProperty(window, "scrollY", {
      configurable: true,
      value: 240,
    });

    fireEvent.wheel(window, { deltaY: 80 });
    expect(nav).toHaveAttribute("data-scroll-hidden", "true");

    fireEvent.wheel(window, { deltaY: -12 });
    expect(nav).toHaveAttribute("data-scroll-hidden", "false");
  });

  it("updates the active link from section position during continuous scroll", async () => {
    runAnimationFramesImmediately();
    Object.defineProperty(window, "innerHeight", {
      configurable: true,
      value: 1000,
    });
    appendNavSections({
      home: { top: -1600, bottom: -700 },
      work: { top: -700, bottom: 180 },
      about: { top: -620, bottom: -420 },
      arsenal: { top: -420, bottom: -40 },
      experience: { top: 40, bottom: 1040 },
      contact: { top: 1040, bottom: 1740 },
    });

    render(<TopNav />);

    await waitFor(() => {
      expect(screen.getByRole("link", { name: /^Journey$/i })).toHaveAttribute(
        "aria-current",
        "page"
      );
    });
  });

  it("updates the active link from the smooth-scroll event", async () => {
    runAnimationFramesImmediately();
    Object.defineProperty(window, "innerHeight", {
      configurable: true,
      value: 1000,
    });
    const bounds = {
      home: { top: -1000, bottom: -100 },
      work: { top: -100, bottom: 900 },
      about: { top: 900, bottom: 1900 },
      arsenal: { top: 1900, bottom: 2900 },
      experience: { top: 2900, bottom: 3900 },
      contact: { top: 3900, bottom: 4900 },
    };
    appendNavSections(bounds);

    render(<TopNav />);

    await waitFor(() => {
      expect(screen.getByRole("link", { name: /^Work$/i })).toHaveAttribute(
        "aria-current",
        "page"
      );
    });

    bounds.work.top = -1300;
    bounds.work.bottom = -300;
    bounds.about.top = -300;
    bounds.about.bottom = 700;
    window.dispatchEvent(new Event("portfolio:scroll"));

    await waitFor(() => {
      expect(screen.getByRole("link", { name: /^Profile$/i })).toHaveAttribute(
        "aria-current",
        "page"
      );
    });
  });

  it("keeps the mostly visible section active while scrolling upward", async () => {
    runAnimationFramesImmediately();
    Object.defineProperty(window, "innerHeight", {
      configurable: true,
      value: 1000,
    });
    appendNavSections({
      home: { top: -5200, bottom: -4300 },
      work: { top: -4300, bottom: -707 },
      about: { top: -707, bottom: 293 },
      arsenal: { top: 293, bottom: 1293 },
      experience: { top: 1293, bottom: 2293 },
      contact: { top: 2293, bottom: 3293 },
    });

    render(<TopNav />);

    await waitFor(() => {
      expect(
        screen.getByRole("link", { name: /^Capabilities$/i })
      ).toHaveAttribute("aria-current", "page");
    });
  });
});
