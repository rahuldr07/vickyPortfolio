import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import Hero from "@/components/Hero";

afterEach(() => {
  cleanup();
});

describe("Hero", () => {
  it("keeps the mobile hero focused on CTAs and a compact portrait signal", () => {
    render(<Hero />);

    const viewWorks = screen.getByRole("link", { name: /view works/i });
    const contact = screen.getByRole("link", { name: /^contact me$/i });
    const portraitWrap = screen.getByTestId("hero-portrait-wrap");
    const proofPoints = screen.getByLabelText(/portfolio proof points/i);

    expect(viewWorks).toHaveAttribute("href", "#work");
    expect(contact).toHaveAttribute("href", "#contact");
    expect(portraitWrap).toHaveClass("max-w-[13.6rem]");
    expect(portraitWrap).toHaveClass("sm:max-w-[34rem]");
    expect(proofPoints).toHaveClass("hidden");
    expect(proofPoints).toHaveClass("sm:grid");
  });

  it("tilts the portrait without GSAP reset warnings", () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    render(<Hero />);

    const portraitWrap = screen.getByTestId("hero-portrait-wrap");
    vi.spyOn(portraitWrap, "getBoundingClientRect").mockReturnValue({
      x: 0,
      y: 0,
      left: 0,
      top: 0,
      right: 400,
      bottom: 500,
      width: 400,
      height: 500,
      toJSON: () => ({}),
    });

    fireEvent.mouseEnter(portraitWrap, { clientX: 200, clientY: 250 });
    fireEvent.mouseMove(portraitWrap, { clientX: 260, clientY: 300 });
    fireEvent.mouseLeave(portraitWrap);

    const gsapResetWarnings = warnSpy.mock.calls.filter((call) =>
      call.join(" ").includes("not eligible for reset")
    );

    expect(gsapResetWarnings).toHaveLength(0);
    warnSpy.mockRestore();
  });
});
