import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import TopNav from "@/components/TopNav";

afterEach(() => {
  cleanup();
  Object.defineProperty(window, "scrollY", {
    configurable: true,
    value: 0,
  });
});

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
});
