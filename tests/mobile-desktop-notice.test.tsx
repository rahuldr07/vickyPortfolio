import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import MobileDesktopNotice from "@/components/MobileDesktopNotice";

const createMatchMedia = (matches: boolean) =>
  vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));

beforeEach(() => {
  window.sessionStorage.clear();
  document.body.style.overflow = "";
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  window.sessionStorage.clear();
  document.body.style.overflow = "";
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: createMatchMedia(false),
  });
});

describe("MobileDesktopNotice", () => {
  it("does not render on desktop-sized screens", () => {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: createMatchMedia(false),
    });

    render(<MobileDesktopNotice />);

    expect(
      screen.queryByRole("dialog", { name: /small screen/i })
    ).not.toBeInTheDocument();
    expect(document.body.style.overflow).toBe("");
  });

  it("shows a desktop recommendation on mobile and prevents smoothed modal scrolling", async () => {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: createMatchMedia(true),
    });

    render(<MobileDesktopNotice />);

    const dialog = await screen.findByRole("dialog", {
      name: /you're on a small screen/i,
    });
    const overlay = screen.getByTestId("mobile-desktop-notice");

    expect(dialog).toHaveTextContent(/desktop recommended/i);
    expect(screen.getByRole("button", { name: /continue anyway/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /switch devices/i })).toBeInTheDocument();
    expect(overlay).toHaveAttribute("data-lenis-prevent", "true");
    expect(document.body.style.overflow).toBe("hidden");
  });

  it("dismisses once per session and restores body scroll", async () => {
    vi.useFakeTimers();
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: createMatchMedia(true),
    });

    render(<MobileDesktopNotice />);

    fireEvent.click(screen.getByRole("button", { name: /continue anyway/i }));

    expect(window.sessionStorage.getItem("portfolioMobileDesktopNoticeSeen")).toBe(
      "true"
    );

    act(() => {
      vi.advanceTimersByTime(280);
    });

    expect(
      screen.queryByRole("dialog", { name: /you're on a small screen/i })
    ).not.toBeInTheDocument();
    expect(document.body.style.overflow).toBe("");

    cleanup();
    render(<MobileDesktopNotice />);

    expect(
      screen.queryByRole("dialog", { name: /you're on a small screen/i })
    ).not.toBeInTheDocument();
  });

  it("can be dismissed with Escape", async () => {
    vi.useFakeTimers();
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: createMatchMedia(true),
    });

    render(<MobileDesktopNotice />);

    expect(
      screen.getByRole("dialog", { name: /you're on a small screen/i })
    ).toBeInTheDocument();

    fireEvent.keyDown(window, { key: "Escape" });

    act(() => {
      vi.advanceTimersByTime(280);
    });

    expect(
      screen.queryByRole("dialog", { name: /you're on a small screen/i })
    ).not.toBeInTheDocument();
  });
});
