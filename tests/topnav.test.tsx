import { cleanup, fireEvent, render, screen } from "@testing-library/react";
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
  it("opens and closes the mobile menu", () => {
    render(<TopNav />);

    const nav = screen.getByRole("navigation", { name: /primary/i });
    expect(nav).toHaveClass("nas-style-nav");
    expect(nav).toHaveAttribute("data-scroll-hidden", "false");

    const toggleButton = screen.getByRole("button", { name: /open menu/i });
    fireEvent.click(toggleButton);

    expect(screen.getByRole("dialog", { name: /mobile menu/i })).toBeInTheDocument();
    expect(document.body.style.overflow).toBe("hidden");

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
